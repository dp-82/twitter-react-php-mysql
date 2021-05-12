import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import './Tweets.css'
import Home from './Home.js';
import Profile from './Profile';
import Post from './Post';

const ERR_CON = "Connecting to MySQL failed";
const ERR_QUERY = "Query Execution Failed";


const Tweets = (args) => {
    const username = sessionStorage.getItem('username');

    if (username === null) {
        window.location.href = '/';
    }
    const query = args.match.params.id;
    if (query === "logout") {
        sessionStorage.removeItem('username');
        window.location.href = '/';
    }
    const items = [['/home', 'Home', 1], ['/explore', 'Explore', 2], ['/notifications', 'Notifications', 3], ['messages', 'Messages', 4], ['/' + username, 'Profile', 5], ['/logout', 'Logout', 6]];

    let query_component = <Home />;
    if (query === username) {
        query_component = <Profile />;
    }
    if (query.includes('-')) {
        const postId = query.split('-')[1];
        sessionStorage.setItem('tid', postId);
        query_component = <Post postId={postId} />
    }

    const [peopleData, setPeopleData] = useState([]);
    const [newTweet, setNewTweet] = useState({});


    //get twitter people data
    useEffect(() => {
        const username = sessionStorage.getItem('username');
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



    const uploadTweet = () => {
        if (newTweet.newTweet === undefined || newTweet.newTweet.trim() === "") {
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
            if (response.data === ERR_CON || response.data === ERR_QUERY) {
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
        <div className="main">
            <div className="first">
                <img src="tiniLogo.png" alt="Logo" />
                {
                    items.map((data) => (
                        <div className="item" key={data[2]}>
                            <Link to={data[0]}>
                                <div>
                                    <h3>{data[1]}</h3>
                                </div>
                            </Link>
                        </div>
                    )
                    )
                }
            </div>

            <div className="second">
                {
                    query_component
                }
            </div>
            <div className="third">
                <h3 className="nothing">People</h3>
                <div className="people">
                    {
                        peopleData.map(
                            (value) => (
                                <div className="person" key={value[0]}>
                                    <h4>{value[1]}</h4>
                                    <button onClick={() => updateFollowingStatus(value[0], 1 - value[2])}>&nbsp;{['Follow', 'Following'][value[2]]}&nbsp;</button>
                                </div>
                            )
                        )
                    }
                </div>
                <h3 className="nothing">Tweet Now</h3>
                <div className="addTweet">
                    <textarea cols="20" rows="5" onChange={(e) => setNewTweet({ newTweet: e.target.value })} placeholder="What's happening" /> <br />
                    <button onClick={(e) => uploadTweet(e)}>Tweet</button>
                </div>
            </div>
        </div >

    )
}

export default Tweets

