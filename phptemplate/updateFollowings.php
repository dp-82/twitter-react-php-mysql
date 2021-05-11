<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Methods: *');

$ERR_CON = "Connecting to MySQL failed";
$ERR_QUERY = "Query Execution Failed";


function check($follower, $following)
{
    $server = "172.17.0.2";
    $user = "root";
    $password = "password";
    $db = "Twiier";
    $con = mysqli_connect($server, $user, $password, $db) or die($GLOBALS['ERR_CON']);
    $query = "SELECT * FROM followings WHERE follower='$follower' AND following='$following'";
    $result = $con->query($query);
    $con->close();
    if (!$result) {
        echo $GLOBALS['ERR_QUERY'];
        return true;
    }
    while ($row = mysqli_fetch_assoc($result)) {
        return true;
    }
    return false;
}

function addFollowing($username, $following)
{
    if (check($username, $following)) return;
    $server = "172.17.0.2";
    $user = "root";
    $password = "password";
    $db = "Twiier";
    $con = mysqli_connect($server, $user, $password, $db) or die($GLOBALS['ERR_CON']);
    $query = "INSERT INTO followings(follower,following) VALUES('$username','$following')";
    if (!$con->query($query)) {
        echo $GLOBALS['ERR_QUERY'];
    }
    $con->close();
}

function removeFollowing($username, $following)
{
    $server = "172.17.0.2";
    $user = "root";
    $password = "password";
    $db = "Twiier";
    $con = mysqli_connect($server, $user, $password, $db) or die($GLOBALS['ERR_CON']);
    $query = "DELETE FROM followings WHERE follower='$username' AND following='$following'";
    if (!$con->query($query)) {
        echo $GLOBALS['ERR_QUERY'];
    }
    $con->close();
}

if (isset($_POST['type'])) {
    $type = $_POST['type'];
    if ($type == "UpdateFollowingStatus") {
        $username = $_POST['username'];
        $following = $_POST['following'];
        $status = $_POST['status'];
        if ($status == 1) {
            addFollowing($username, $following);
        } else {
            removeFollowing($username, $following);
        }
    }
}
