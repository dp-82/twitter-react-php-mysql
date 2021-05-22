<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Methods: *');

$ERR_CON = "Connecting to MySQL failed";
$ERR_QUERY = "Query Execution Failed";

function checkUserHasAccount($username)
{
  $server = "172.17.0.2";
  $user = "root";
  $password = "password";
  $db = "Twiier";
  $con = mysqli_connect($server, $user, $password, $db) or die($GLOBALS['ERR_CON']);
  $query = "SELECT * FROM users WHERE username='$username'";
  $result = $con->query($query);
  if (!$result) {
    echo $GLOBALS['ERR_QUERY'];
  }
  $con->close();
  while ($row = mysqli_fetch_assoc($result)) {
    return $row;
  }
  return array();
}

function getFollowersAndFollowings($username)
{
  $server = "172.17.0.2";
  $user = "root";
  $password = "password";
  $db = "Twiier";
  $con = mysqli_connect($server, $user, $password, $db) or die($GLOBALS['ERR_CON']);
  $query = "SELECT COUNT(*) AS Followers FROM followings WHERE following='$username'";
  $result = $con->query($query);

  if (!$result) {
    echo $GLOBALS['ERR_QUERY'];
    $con->close();
    return array(0, 0);
  }
  $followers = 0;
  while ($row = mysqli_fetch_assoc($result)) {
    $followers = $row['Followers'];
    break;
  }
  $query = "SELECT COUNT(*) AS Followings FROM followings WHERE follower='$username'";
  $result = $con->query($query);

  if (!$result) {
    echo $GLOBALS['ERR_QUERY'];
    $con->close();
    return array(0, 0);
  }
  $followings = 0;
  while ($row = mysqli_fetch_assoc($result)) {
    $followings = $row['Followings'];
    break;
  }
  $con->close();
  return array($followings, $followers);
}

if (isset($_POST['type'])) {
  $type = $_POST['type'];
  if ($type == "Profile") {
    $username = $_POST['username'];
    $user_array = checkUserHasAccount($username);
    $res_array = getFollowersAndFollowings($username);
    $user_array['Followers'] = $res_array[1];
    $user_array['Followings'] = $res_array[0];
    echo json_encode($user_array);
  }
}
