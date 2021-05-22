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

function insertUser($username, $name, $pass, $phone, $mail)
{
    $server = "172.17.0.2";
    $user = "root";
    $password = "password";
    $db = "Twiier";
    $con = mysqli_connect($server, $user, $password, $db) or die($GLOBALS['ERR_CON']);
    $query = "INSERT INTO users(username,password,name,phone,mail) VALUES('$username','$pass','$name','$phone','$mail')";
    if (!$con->query($query)) {
        echo $GLOBALS['ERR_QUERY'];
    }
    $con->close();
}

function getAllUsers($username)
{
    $server = "172.17.0.2";
    $user = "root";
    $password = "password";
    $db = "Twiier";
    $con = mysqli_connect($server, $user, $password, $db) or die($GLOBALS['ERR_CON']);
    $query = "SELECT username,name FROM users WHERE username NOT IN ('$username')";
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

function getFollowingUsers($username)
{
    $server = "172.17.0.2";
    $user = "root";
    $password = "password";
    $db = "Twiier";
    $con = mysqli_connect($server, $user, $password, $db) or die($GLOBALS['ERR_CON']);
    $query = "SELECT following FROM followings WHERE follower='$username'";
    $result = $con->query($query);
    if (!$result) {
        echo $GLOBALS['ERR_QUERY'];
    }
    $con->close();
    $users_array = array();
    while ($row = mysqli_fetch_assoc($result)) {
        array_push($users_array, $row['following']);
    }
    return $users_array;
}


if (isset($_POST['username']) && isset($_POST['password']) && isset($_POST['name']) && isset($_POST['phone']) && isset($_POST['mail'])) {
    $username = $_POST['username'];
    $name = $_POST['name'];
    $password = $_POST['password'];
    $phone = $_POST['phone'];
    $mail = $_POST['mail'];
    $user_array = checkUserHasAccount($username);
    if (count($user_array) > 0) {
        echo $GLOBALS['ERR_REGISTER'];
    } else {
        insertUser($username, $name, $password, $phone, $mail);
        $user_array = checkUserHasAccount($username);
        if (count($user_array) > 0) {
            echo $GLOBALS['SUCCESS_REGISTER'];
        }
    }
} else if (isset($_POST['username']) && isset($_POST['password'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $user_array = checkUserHasAccount($username);
    if (count($user_array) > 0 && $user_array['password'] == $password) {
        echo $GLOBALS['SUCCESS_LOGIN'];
    } else {
        echo $GLOBALS['ERR_LOGIN'];
    }
}


if (isset($_POST['type'])) {
    $username = $_POST['username'];
    $type = $_POST['type'];
    if ($type == "People") {
        $users_array = getAllUsers($username);
        $following_array = getFollowingUsers($username);
        $res_array = array();
        for ($i = 0; $i < count($users_array); $i++) {
            $ok = 0;
            for ($j = 0; $j < count($following_array); $j++) {
                if ($users_array[$i]['username'] === $following_array[$j]) $ok = 1;
            }
            array_push($res_array, array($users_array[$i]['username'], $users_array[$i]['name'], $ok));
        }
        echo json_encode($res_array);
    }
}






/*

users table
---------------------------------
1	username 	text	Primary
2	password	text	
3	name	    text	
4	phone	    text	
5	mail	    text
----------------------------------
Records
1. dp        dp        DharmaRaj      9640246745   dharmarajupilli5610@gmail.com
2. steve    steve      Steve Rogers   99999999999   steve@gmail.com
3. leo      leo    Leonardo Dicaprio  9898989898    leo@gmail.com
4. johnny  johnny    Johnny Depp      8888888888    johnny@gmail.com
5. robert  robert  Robert Downey Jr   7777777777    




following table
-----------------------------
1	fid 	 int	  Primary
2	source	text	
3	dest	text
-----------------------------

*/