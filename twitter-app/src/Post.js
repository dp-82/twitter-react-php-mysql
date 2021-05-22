import axios from 'axios';
import React, { useState, useEffect } from 'react'
import './Tweets.css'
import { FiMessageCircle, FiRepeat, FiHeart, FiUpload } from 'react-icons/fi'
import { IconContext } from 'react-icons'
import { Row, Col } from 'react-bootstrap'

const getDateDisplayFormatString = (timestamp) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'];
    const [fullDate, fullTime] = timestamp.split(' ');
    const [year, month, date] = fullDate.split('-');
    const [hours, minutes, seconds] = fullTime.split(':');
    let display = hours + ':' + minutes + '-' + monthNames[parseInt(month) - 1] + ' ' + date + ',' + year;
    return display;
}

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
            response.data.timestamp = getDateDisplayFormatString(response.data.timestamp);
            setPost(response.data);
        }).catch(function (response) {
            console.log(response)
        });
    }, []);

    return (
        <>
            <h4 className="nothing">Tweet</h4>
            <div style={{ padding: '2%' }}>

                <div>
                    <h5 style={{ display: 'inline' }}>{post.name}</h5>
                    <h6 style={{ display: 'inline', paddingTop: '3%', fontWeight: 'lighter' }}>{'@' + post.username}</h6>
                </div>
                <p style={{ padding: '1%' }}>{post.tweet}</p>
                <h6 style={{ display: 'inline', paddingTop: '3%', fontWeight: 'lighter' }}>{post.timestamp}</h6>

            </div>
            <div style={{ borderTop: '1px solid aqua', borderBottom: '1px solid aqua' }}>
                <Row style={{ width: '98%', marginLeft: '1px' }}>
                    <Col style={{ textAlign: 'center' }}>
                        <IconContext.Provider value={{ style: { fontSize: '30px' } }}>
                            <div>
                                <FiMessageCircle />
                            </div>
                        </IconContext.Provider>
                    </Col>
                    <Col style={{ textAlign: 'center' }}>
                        <IconContext.Provider value={{ style: { fontSize: '30px' } }}>
                            <div>
                                <FiRepeat />
                            </div>
                        </IconContext.Provider>
                    </Col>
                    <Col style={{ textAlign: 'center' }}>
                        <IconContext.Provider value={{ style: { fontSize: '30px' } }}>
                            <div>
                                <FiHeart />
                            </div>
                        </IconContext.Provider>
                    </Col>
                    <Col style={{ textAlign: 'center' }}>
                        <IconContext.Provider value={{ style: { fontSize: '30px' } }}>
                            <div>
                                <FiUpload />
                            </div>
                        </IconContext.Provider>
                    </Col>
                </Row>




            </div>
        </>
    )
}

export default Post
