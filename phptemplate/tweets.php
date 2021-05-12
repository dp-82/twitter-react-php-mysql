<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Methods: *');

$ERR_CON = "Connecting to MySQL failed";
$ERR_QUERY = "Query Execution Failed";
$ERR_LOGIN = "User details are wrong";
$ERR_REGISTER = "Username is already taken";
$SUCCESS_LOGIN = "User details are correct";
$SUCCESS_REGISTER = "User details are inserted";



function getTweets($username)
{
    $server = "172.17.0.2";
    $user = "root";
    $password = "password";
    $db = "Twiier";
    $con = mysqli_connect($server, $user, $password, $db) or die($GLOBALS['ERR_CON']);
    $query = "SELECT * FROM tweets WHERE username='$username' OR username IN (SELECT following AS username FROM followings WHERE follower='$username') ORDER BY date DESC";
    $result = $con->query($query);
    if (!$result) {
        echo $GLOBALS['ERR_QUERY'];
    }
    $con->close();
    $users_array = array();
    while ($row = mysqli_fetch_assoc($result)) {
        array_push($users_array, $row);
    }
    return $users_array;
}

function insertTweet($username, $tweet)
{
    $server = "172.17.0.2";
    $user = "root";
    $password = "password";
    $db = "Twiier";
    $con = mysqli_connect($server, $user, $password, $db) or die($GLOBALS['ERR_CON']);
    $query = "INSERT INTO tweets(username,tweet) VALUES('$username','$tweet')";
    if (!$con->query($query)) {
        echo $GLOBALS['ERR_QUERY'];
    }
    $con->close();
}

function deleteTweet($tid)
{
    $server = "172.17.0.2";
    $user = "root";
    $password = "password";
    $db = "Twiier";
    $con = mysqli_connect($server, $user, $password, $db) or die($GLOBALS['ERR_CON']);
    $query = "DELETE FROM tweets WHERE tid='$tid'";
    if (!$con->query($query)) {
        echo $GLOBALS['ERR_QUERY'];
    }
    $con->close();
}

function getTweetInfo($tid)
{
    $server = "172.17.0.2";
    $user = "root";
    $password = "password";
    $db = "Twiier";
    $con = mysqli_connect($server, $user, $password, $db) or die($GLOBALS['ERR_CON']);
    $query = "SELECT * FROM tweets WHERE tid='$tid'";
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

if (isset($_POST['type'])) {
    $type = $_POST['type'];
    if ($type == "Tweets") {
        $username = $_POST['username'];
        $tweets = getTweets($username);
        echo json_encode($tweets);
    } else if ($type == "NewTweet") {
        $username = $_POST['username'];
        insertTweet($username, $_POST['tweet']);
    } else if ($type == 'DeleteTweet') {
        $tid = $_POST['tid'];
        deleteTweet($tid);
    } else if ($type == 'Post') {
        $tid = $_POST['tid'];
        $tweetInfo = getTweetInfo($tid);
        echo json_encode($tweetInfo);
    }
}
