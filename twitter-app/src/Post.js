import axios from 'axios';
import React, { useState, useEffect } from 'react'
import './Tweets.css'


const Post = () => {
    const username = sessionStorage.getItem('username');
    if (username === null) {
        window.location.href = '/';
    }
    const [post, setPost] = useState([]);
    //get tweets
    useEffect(() => {
        const tid = sessionStorage.getItem('tid');
        let formData = new FormData();
        formData.append('tid', tid);
        formData.append('type', 'Post');
        axios({
            method: 'post',
            url: 'http://localhost:8100/Desktop/webProjects/firstapp/phptemplate/tweets.php',
            data: formData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        }).then(function (response) {
            console.log(response.data);
            setPost(response.data);
        }).catch(function (response) {
            console.log(response)
        });
    }, []);

    return (
        <>
            <h3 className="nothing">Tweet</h3>
            <div className="post">

                <h4>{post.username}</h4>
                <p>{post.tweet}</p>
                <h6>{post.date}</h6>

            </div>
        </>
    )
}

export default Post
