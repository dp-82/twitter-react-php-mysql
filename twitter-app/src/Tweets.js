import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import './Tweets.css'
import Home from './Home.js';
import Profile from './Profile';
import Post from './Post';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { IconContext } from 'react-icons';
import { FaTwitter } from 'react-icons/fa';
import { BiHomeCircle, BiUser, BiMessageRoundedDots, BiBell, BiLogOut, BiWorld } from 'react-icons/bi';

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
    const items = [['/home', 'Home', 1, <BiHomeCircle />, 'black'], ['/explore', 'Explore', 2, <BiWorld />, 'black'], ['/notifications', 'Notifications', 3, <BiBell />, 'black'], ['messages', 'Messages', 4, <BiMessageRoundedDots />, 'black'], ['/' + username, 'Profile', 5, <BiUser />, 'black'], ['/logout', 'Logout', 6, <BiLogOut />, 'black']];

    let query_component = <Home />;
    for (var i = 0; i < items.length; i++) {
        if (items[i][1].toLowerCase() == query) {
            items[i][4] = 'blue';
        }
    }
    if (query === username) {
        items[4][4] = 'blue';
        query_component = <Profile />;
    }
    if (query.includes('-')) {
        const postId = query.split('-')[1];
        sessionStorage.setItem('tid', postId);
        query_component = <Post postId={postId} />
    }

    const [peopleData, setPeopleData] = useState([]);
    const [newTweet, setNewTweet] = useState({});
    const [show, setShow] = useState(false)

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
        if (text.length > 280) {
            alert('tweet size must be atmost 280 characters ');
            return;
        }
        const date = new Date();
        let timestamp = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        let formData = new FormData();
        formData.append('username', username);
        formData.append('type', 'NewTweet');
        formData.append('timestamp', timestamp);
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

    const modalClose = () => setShow(false)

    const modalOpen = () => setShow(true)


    return (
        <div className="main">
            <div className="first">
                <Row>
                    <Col></Col>
                    <Col sm={8} style={{ marginTop: '10%', marginLeft: '0%' }}>
                        <IconContext.Provider value={{ style: { fontSize: '50px', color: "rgb(0, 123, 255)" } }}>
                            <div>
                                <FaTwitter />
                            </div>
                        </IconContext.Provider>
                        {/* <img src="tiniLogo.png" alt="Logo" /> */}
                        {
                            items.map((data) => (
                                <div key={data[2]} style={{ borderRadius: '1rem', border: '', margin: '2%', marginLeft: '0%', marginTop: '10%' }}>
                                    <Link to={data[0]} style={{ textDecoration: 'none', color: data[4] }}>
                                        <Row>
                                            <Col sm={2}>
                                                <IconContext.Provider value={{ style: { fontSize: '30px' } }}>
                                                    <div>
                                                        {data[3]}
                                                    </div>
                                                </IconContext.Provider>

                                            </Col>
                                            <Col>
                                                <h4>{data[1]}</h4>
                                            </Col>
                                        </Row>
                                        {/* <IconContext.Provider value={{ style: { fontSize: '30px', textAlign: 'center' } }}>
                                            <div style={{ backgroundColor: 'aqua' }}>
                                                <BiHomeCircle />
                                                <h4 style={{ display: 'inline', paddingLeft: '5%' }}>{data[1]}</h4>
                                            </div>
                                        </IconContext.Provider> */}


                                    </Link>
                                </div>
                            )
                            )
                        }
                        <Button onClick={modalOpen} style={{ marginTop: '10%', width: '90%', height: '8%', borderRadius: '2rem', backgroundColor: 'rgb(0, 123, 255)' }}>Tweet</Button>
                    </Col>
                </Row>



                <Modal show={show}>
                    <Modal.Header>Add Tweet</Modal.Header>
                    <Modal.Body style={{ height: '10rem' }}>
                        <textarea onChange={(e) => setNewTweet({ newTweet: e.target.value })} style={{ height: '8rem', width: '90%' }} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={modalClose}>Cancel</Button>
                        <Button onClick={uploadTweet}>Tweet</Button>
                    </Modal.Footer>
                </Modal>

            </div>

            <div className="second">
                {
                    query_component
                }
            </div>
            <div className="third">
                <h4 className="nothing">People</h4>
                <div className="overflow-auto" style={{ padding: '1%', overflowY: 'scroll', height: 'calc(95vh)' }}>
                    {
                        peopleData.map(
                            (value) => (
                                <Row key={value[0]} style={{ margin: "1%", marginTop: '3%' }}>
                                    <Col><h5>{value[1]}</h5></Col>
                                    <Col>
                                        <Button onClick={() => updateFollowingStatus(value[0], 1 - value[2])} variant={(value[2] === 1) ? "info" : "outline-info"} size="sm" style={{ borderRadius: '2rem' }}>
                                            &nbsp;{['Follow', 'Following'][value[2]]}&nbsp;
                                        </Button>
                                    </Col>
                                </Row>
                            )
                        )
                    }
                </div>
            </div>
        </div >

    )
}

export default Tweets

