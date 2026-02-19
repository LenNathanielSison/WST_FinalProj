<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $xml = new DOMDocument();
  $xml->load('teams.xml');

  $teams = $xml->getElementsByTagName('teams')->item(0);

  $team = $xml->createElement('team');

  $name = $xml->createElement('name', $_POST['name']);
  $logo = $xml->createElement('logo', $_POST['logo']);

  $playersElement = $xml->createElement('players');
  foreach ($_POST['players'] as $playerName) {
    $player = $xml->createElement('player', $playerName);
    $playersElement->appendChild($player);
  }

  $team->appendChild($name);
  $team->appendChild($logo);
  $team->appendChild($playersElement);

  $teams->appendChild($team);

  $xml->save('teams.xml');

  echo "Team added successfully!";
}
?>
