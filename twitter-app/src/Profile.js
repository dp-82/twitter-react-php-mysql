import axios from 'axios';
import React, { useState, useEffect } from 'react'
import './Tweets.css'

const ERR_CON = "Connecting to MySQL failed";
const ERR_QUERY = "Query Execution Failed";


const Profile = () => {
    const username = sessionStorage.getItem('username');
    if (username === null) {
        window.location.href = '/';
    }
    const [profileData, setProfileData] = useState({});
    const [tweets, setTweets] = useState([]);

    //get profile information
    useEffect(() => {
        const username = sessionStorage.getItem('username');
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

    //get tweets
    useEffect(() => {
        const username = sessionStorage.getItem('username');
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
            if (response.data === ERR_CON || response.data === ERR_QUERY) {
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
        <>
            <h3 className="nothing">Profile</h3>
            <div className="profile-info">
                <h4>Name : {profileData.name}</h4>
                <h4>Username : {profileData.username}</h4>
                <h4>Phone : {profileData.phone}</h4>
                <h4>Mail : {profileData.mail}</h4>
            </div>
            <h3 className="nothing">Tweets</h3>
            <div className="tweets">
                {
                    tweets.filter((data) => data.username === username).map((data) =>
                        <div className="tweet" style={{ maxHeight: "15%" }} key={data.tid}>
                            <div className="part">
                                <h4>{data.username}</h4>
                                <h6>{data.date}</h6>
                            </div>
                            <div className="profile-tweet-rem">
                                <p>{data.tweet}</p>
                                <button onClick={() => deleteTweet(data.tid)}>delete</button>
                            </div>
                        </div>
                    )
                }

            </div>
        </>
    )
}

export default Profile
