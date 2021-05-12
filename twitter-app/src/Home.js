import axios from 'axios';
import React, { useState, useEffect } from 'react'
import './Tweets.css'
import { Link } from 'react-router-dom'

const Home = () => {
    const username = sessionStorage.getItem('username');
    if (username === null) {
        window.location.href = '/';
    }
    const [tweets, setTweets] = useState([]);
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

    return (
        <>
            <h3 className="nothing">Home</h3>
            <div className="tweets">
                {
                    tweets.filter((data) => data.username !== username).map((data) =>
                        <Link to={'/post-' + data.tid} style={{ textDecoration: "None", color: "inherit" }} key={data.tid}>
                            <div className="tweet">
                                <div className="part">
                                    <h4>{data.username}</h4>
                                    <h6>{data.date}</h6>
                                </div>
                                <p>{data.tweet}</p>
                            </div>
                        </Link>
                    )
                }

            </div>
        </>
    )
}

export default Home
