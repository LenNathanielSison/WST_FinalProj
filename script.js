let teams = [];
let uploadedLogoDataUrl = "";
let playersShown = false;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("teamLogoFile").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        uploadedLogoDataUrl = e.target.result;
        const preview = document.getElementById("logoPreview");
        preview.src = uploadedLogoDataUrl;
        preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  fetch("teams.xml")
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "application/xml");
      const xmlTeams = xml.getElementsByTagName("team");

      Array.from(xmlTeams).forEach((team) => {
        const name = team.getElementsByTagName("name")[0].textContent;
        const logo = team.getElementsByTagName("logo")[0].textContent;
        const players = Array.from(team.getElementsByTagName("player")).map(p => p.textContent);
        teams.push({ name, logo, players });
      });

      renderTeams();
    });
});

function renderTeams() {
  const container = document.getElementById("teams-container");
  container.innerHTML = "";
  teams.forEach((team) => {
    const teamDiv = document.createElement("div");
    teamDiv.classList.add("team-card");
    if (playersShown) teamDiv.classList.add("show-players");

    const logoImg = document.createElement("img");
    logoImg.src = team.logo;
    logoImg.alt = `${team.name} Logo`;
    logoImg.classList.add("team-logo");

    const nameHeading = document.createElement("h3");
    nameHeading.textContent = team.name;

    const playersContainer = document.createElement("div");
    playersContainer.classList.add("players-container");

    const numbersColumn = document.createElement("div");
    numbersColumn.classList.add("player-numbers");

    const namesColumn = document.createElement("div");
    namesColumn.classList.add("players-list");

    team.players.forEach((player, i) => {
      const numberDiv = document.createElement("div");
      numberDiv.textContent = i + 1;
      numbersColumn.appendChild(numberDiv);

      const nameDiv = document.createElement("div");
      nameDiv.textContent = player;
      namesColumn.appendChild(nameDiv);
    });

    const row = document.createElement("div");
    row.classList.add("players-row");

    const line = document.createElement("div");
    line.classList.add("vertical-line");

    row.appendChild(numbersColumn);
    row.appendChild(line);
    row.appendChild(namesColumn);

    playersContainer.appendChild(row);

    teamDiv.appendChild(nameHeading);
    teamDiv.appendChild(logoImg);
    teamDiv.appendChild(playersContainer);
    container.appendChild(teamDiv);
  });
}

function showAddForm() {
  document.getElementById("teamForm").reset();
  document.getElementById("formTitle").textContent = "Add Team";
  document.getElementById("editIndex").value = "";
  document.getElementById("logoPreview").style.display = "none";
  uploadedLogoDataUrl = "";
  document.getElementById("teamFormModal").classList.remove("hidden");
}

function showEditSelect() {
  const select = document.getElementById("editSelect");
  select.innerHTML = "";
  teams.forEach((team, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = team.name;
    select.appendChild(option);
  });
  document.getElementById("editModal").classList.remove("hidden");
}

function loadEditForm() {
  const index = document.getElementById("editSelect").value;
  const team = teams[index];
  document.getElementById("formTitle").textContent = "Edit Team";
  document.getElementById("editIndex").value = index;
  document.getElementById("teamName").value = team.name;

  uploadedLogoDataUrl = team.logo;
  const preview = document.getElementById("logoPreview");
  preview.src = team.logo;
  preview.style.display = "block";

  const inputs = document.querySelectorAll("#playersInputs input");
  inputs.forEach((input, i) => input.value = team.players[i]);
  document.getElementById("editModal").classList.add("hidden");
  document.getElementById("teamFormModal").classList.remove("hidden");
}

function showDeleteForm() {
  const select = document.getElementById("deleteSelect");
  select.innerHTML = "";
  teams.forEach((team, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = team.name;
    select.appendChild(option);
  });
  document.getElementById("deleteModal").classList.remove("hidden");
}

function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("teamName").value;
  const players = Array.from(document.querySelectorAll("#playersInputs input")).map(i => i.value);
  const index = document.getElementById("editIndex").value;

  // ❗ Enforce logo upload only when adding a new team
  if (index === "" && !uploadedLogoDataUrl) {
    alert("Please upload a logo image for the team.");
    return;
  }

  const logo = uploadedLogoDataUrl || teams[index]?.logo;

  if (index === "") {
    teams.push({ name, logo, players });
  } else {
    teams[index] = { name, logo, players };
  }

  closeModal();
  renderTeams();
}


function confirmDelete() {
  const index = document.getElementById("deleteSelect").value;
  teams.splice(index, 1);
  closeModal();
  renderTeams();
}

function closeModal() {
  document.getElementById("teamFormModal").classList.add("hidden");
  document.getElementById("deleteModal").classList.add("hidden");
  document.getElementById("editModal").classList.add("hidden");
}

function toggleAllPlayers() {
  playersShown = !playersShown;
  const toggleBtn = document.getElementById("togglePlayersBtn");
  toggleBtn.textContent = playersShown ? "Hide Players" : "Show Players";
  renderTeams();
}

