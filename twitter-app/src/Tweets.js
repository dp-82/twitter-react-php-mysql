import axios from 'axios';
import React, { useState, useEffect } from 'react'
import './Tweets.css'

const ERR_CON = "Connecting to MySQL failed";
const ERR_QUERY = "Query Execution Failed";

const Tweets = (args) => {
    const username = args.match.params.id;
    const [profileData, setProfileData] = useState({});
    const [peopleData, setPeopleData] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [newTweet, setNewTweet] = useState({});

    //get profile information
    useEffect(() => {
        let formData = new FormData();
        formData.append('username', username);
        formData.append('type', 'Profile');
        axios({
            method: 'post',
            url: 'http://localhost:8100/Desktop/webProjects/firstapp/phptemplate/index.php',
            data: formData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        }).then(function (response) {
            setProfileData(response.data);
        }).catch(function (response) {
            console.log(response)
        });
    }, []);

    //get twitter people data
    useEffect(() => {
        let formData = new FormData();
        formData.append('username', username);
        formData.append('type', 'People');
        axios({
            method: 'post',
            url: 'http://localhost:8100/Desktop/webProjects/firstapp/phptemplate/index.php',
            data: formData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        }).then(function (response) {
            setPeopleData(response.data);
        }).catch(function (response) {
            console.log(response)
        });
    }, []);

    //get tweets
    useEffect(() => {
        let formData = new FormData();
        formData.append('username', username);
        formData.append('type', 'Tweets');
        axios({
            method: 'post',
            url: 'http://localhost:8100/Desktop/webProjects/firstapp/phptemplate/tweets.php',
            data: formData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        }).then(function (response) {
            console.log(response.data);
            setTweets(response.data);
        }).catch(function (response) {
            console.log(response)
        });
    }, []);

    const uploadTweet = () => {
        if (newTweet.newTweet == undefined || newTweet.newTweet.trim() == "") {
            alert('type something');
            return;
        }
        let text = newTweet.newTweet.trim();
        if (text.length > 140) {
            alert('tweet size must be atmost 140 characters ');
            return;
        }
        let formData = new FormData();
        formData.append('username', username);
        formData.append('type', 'NewTweet');
        formData.append('tweet', text);
        axios({
            method: 'post',
            url: 'http://localhost:8100/Desktop/webProjects/firstapp/phptemplate/tweets.php',
            data: formData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        }).then(function (response) {
            if (response.data == ERR_CON || response.data == ERR_QUERY) {
                alert('Some error occured');
            } else {
                window.location.reload();
            }
            console.log(response.data);
        }).catch(function (response) {
            console.log(response)
            alert('Some error occured');
        });
    }

    const updateFollowingStatus = (name, value) => {
        //updateFollowings
        let formData = new FormData();
        formData.append('username', username);
        formData.append('following', name);
        formData.append('status', value);
        formData.append('type', 'UpdateFollowingStatus');
        axios({
            method: 'post',
            url: 'http://localhost:8100/Desktop/webProjects/firstapp/phptemplate/updateFollowings.php',
            data: formData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        }).then(function (response) {
            console.log(response.data);
            if (response.data == ERR_CON || response.data == ERR_QUERY) {
                alert('Some error occured');
            } else {
                window.location.reload();
            }
        }).catch(function (response) {
            console.log(response)
            alert('Some error occured');
        });
    }

    const deleteTweet = (tid) => {
        let formData = new FormData();
        formData.append('tid', tid);
        formData.append('type', 'DeleteTweet');
        axios({
            method: 'post',
            url: 'http://localhost:8100/Desktop/webProjects/firstapp/phptemplate/tweets.php',
            data: formData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        }).then(function (response) {
            console.log(response.data);
            if (response.data == ERR_CON || response.data == ERR_QUERY) {
                alert('Some error occured');
            } else {
                window.location.reload();
            }
        }).catch(function (response) {
            console.log(response)
            alert('Some error occured');
        });
    }

    return (
        <div className="main">
            <div className="first">
                <h3 className="nothing">Profile</h3>
                <div className="profile">
                    <h4>Name : {profileData.name}</h4>
                    <h4>Username : {profileData.username}</h4>
                    <h4>Phone : {profileData.phone}</h4>
                    <h4>Mail : {profileData.mail}</h4>
                </div>
                <h3 className="nothing">My Tweets</h3>
                <div class="my-tweets">
                    {
                        tweets.filter((data) => data.username == username).map((data) =>
                            <div className="my-tweet">
                                <div className="part">
                                    <h4>{data.username}</h4>
                                    <h6>{data.date}</h6>
                                </div>
                                <div className="rem">
                                    <p>{data.tweet}</p>
                                    <button onClick={() => deleteTweet(data.tid)}>delete</button>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="second">
                <h3 className="nothing">Home</h3>
                <div className="tweets">
                    {
                        tweets.filter((data) => data.username != username).map((data) =>
                            <div className="tweet">
                                <div className="part">
                                    <h4>{data.username}</h4>
                                    <h6>{data.date}</h6>
                                </div>
                                <p>{data.tweet}</p>
                            </div>
                        )
                    }

                </div>
            </div>
            <div className="third">
                <h3 class="nothing">People</h3>
                <div className="people">
                    {
                        peopleData.map(
                            (value) => (
                                <div className="person">
                                    <h4>{value[1]}</h4>
                                    <button onClick={() => updateFollowingStatus(value[0], 1 - value[2])}>&nbsp;{['Follow', 'Following'][value[2]]}&nbsp;</button>
                                </div>
                            )
                        )
                    }
                </div>
                <h3 className="nothing">Tweet Now</h3>
                <div className="addTweet">
                    <textarea cols="20" rows="5" onChange={(e) => setNewTweet({ newTweet: e.target.value })} placeholder="Whats' happening" /> <br />
                    <button onClick={(e) => uploadTweet(e)}>Tweet</button>
                </div>
            </div>
        </div >


    )
}

export default Tweets


/*


                <div className="tweets">
                <h2>Tweets</h2>
                {
                    tweets.filter((data) => data.username != username).map((data) =>
                        <div className="tweet">
                            <div className="part">
                                <h4>{data.username}</h4>
                                <h6>{data.date}</h6>
                            </div>
                            <br></br>
                            <p>{data.tweet}</p>
                        </div>
                    )
                }

            </div>
            <div class="my-thing">
                <h2>My Tweets</h2>
                <div class="my-tweets">
                    {
                        tweets.filter((data) => data.username == username).map((data) =>
                            <div className="my-tweet">
                                <div className="part">
                                    <h4>{data.username}</h4>
                                    <h6>{data.date}</h6>
                                </div>
                                <br></br>
                                <p>{data.tweet}</p>
                                <button onClick={() => deleteTweet(data.tid)}>delete</button><br />
                            </div>
                        )
                    }
                </div>
            </div>




*/