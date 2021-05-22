import axios from 'axios';
import React, { useState, useEffect } from 'react'
import './Tweets.css'
import { Link } from 'react-dom'
import { Button, Card, Modal, Row, Col, Container } from 'react-bootstrap';
import { IconContext } from 'react-icons';
import { FaUserCircle, FaMobile } from 'react-icons/fa';

const ERR_CON = "Connecting to MySQL failed";
const ERR_QUERY = "Query Execution Failed";

const getDateDisplayFormatString = (timestamp) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'];
    const [fullDate, fullTime] = timestamp.split(' ');
    const [year, month, date] = fullDate.split('-');
    const [hours, minutes, seconds] = fullTime.split(':');
    const cur_date = new Date();
    const tweet_date = new Date(year, month - 1, date, hours, minutes, seconds);
    let dif_seconds = (cur_date - tweet_date) / 1000;
    let dif_minutes = dif_seconds / 60;
    let dif_hours = dif_minutes / 60;
    let display = '';
    if (parseInt(dif_seconds) < 60) {
        display += parseInt(dif_seconds) + 's';
    } else if (parseInt(dif_minutes) < 60) {
        display += parseInt(dif_minutes) + 'm';
    } else if (parseInt(dif_hours) < 24) {
        display += parseInt(dif_hours) + 'h';
    } else if (cur_date.getFullYear() == year) {
        display += monthNames[parseInt(month) - 1] + ' ' + date;
    } else {
        display += monthNames[parseInt(month) - 1] + ' ' + date + ',' + year;
    }
    return display;
}

const Profile = () => {
    const username = sessionStorage.getItem('username');
    if (username === null) {
        window.location.href = '/';
    }
    const [profileData, setProfileData] = useState({});
    const [tweets, setTweets] = useState([]);
    const [show, setShow] = useState(false);

    //get profile information
    useEffect(() => {
        const username = sessionStorage.getItem('username');
        let formData = new FormData();
        formData.append('username', username);
        formData.append('type', 'Profile');
        axios({
            method: 'post',
            url: 'http://localhost:8100/Desktop/webProjects/firstapp/phptemplate/profileInfo.php',
            data: formData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        }).then(function (response) {
            setProfileData(response.data);
            console.log(response.data);
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
        <div className="divProfile">
            <h4 className="nothing">Profile</h4>
            <Card style={{ border: 'none', padding: '2%' }}>
                {/* <Card.Img src="logo.png" style={{ height: "5rem", width: "5rem" }} /> */}
                <IconContext.Provider value={{ style: { fontSize: '75px', color: "rgb(34, 72, 112)", paddingLeft: '2%' } }}>
                    <div>
                        <FaUserCircle />
                    </div>
                </IconContext.Provider>
                <Card.Body>
                    <Card.Title>{profileData.name}</Card.Title>
                    <Card.Subtitle style={{ fontFamily: 'monospace' }}>{'@' + profileData.username}</Card.Subtitle>
                    <Card.Text>
                        <div>
                            <h6 style={{ display: 'inline', fontFamily: 'monospace' }}>{profileData.phone}</h6>
                            <h6 style={{ float: 'right', display: 'inline', fontFamily: 'monospace' }}>{profileData.mail}</h6>
                        </div>
                    </Card.Text>
                    <Card.Text>
                        <h6 style={{ display: 'inline' }}>{profileData.Followings}</h6>&nbsp;
                        <h6 style={{ display: 'inline', fontWeight: '300' }}>Following</h6>&nbsp;&nbsp;&nbsp;
                        <h6 style={{ display: 'inline' }}>{profileData.Followers}</h6>&nbsp;
                        <h6 style={{ display: 'inline', fontWeight: '300' }}>Followers</h6>
                    </Card.Text>
                    {/* <Button variant="info" style={{ float: 'right' }}>Edit Details</Button> */}
                </Card.Body>
            </Card>
            <h4 className="nothing">Tweets</h4>
            <div className="tweets" style={{ height: 'calc(68vh)' }}>
                {
                    tweets.filter((data) => data.username === username).map((data) =>
                        <Container style={{ borderBottom: '0.5px solid aqua' }}>
                            <Row>
                                <Col sm='1' style={{ padding: '2%', paddingTop: '1%' }}>
                                    <IconContext.Provider value={{ style: { fontSize: '40px', color: "rgb(34, 72, 112)" } }}>
                                        <div>
                                            <FaUserCircle />
                                        </div>
                                    </IconContext.Provider>

                                    {/* <img src="tiniLogo.png" alt="dp" style={{ height: '2rem' }} /> */}
                                </Col>
                                <Col style={{ textAlign: 'start', padding: '1%' }}>
                                    <Row>
                                        <Col>
                                            <div>
                                                <h5 style={{ float: 'left' }}>{data.name}</h5>
                                                <h6 style={{ fontFamily: 'monospace', padding: '1%' }}>{'@' + data.username}</h6>
                                            </div>

                                        </Col>
                                        <Col sm={2} style={{ padding: '1%' }}><h6 style={{ textAlign: 'end', fontFamily: 'monospace' }}>{getDateDisplayFormatString(data.timestamp)}</h6></Col>

                                    </Row>
                                    <Row>
                                        <p style={{ wordBreak: 'break-all', whiteSpace: 'normal', fontWeight: 'normal' }}>{data.tweet}</p>
                                    </Row>
                                    <Row>
                                        <Col><Button onClick={() => { window.location.href = '/post-' + data.tid }} variant='outline-info' style={{ borderRadius: '2rem' }}>View</Button></Col>
                                        <Col><Button onClick={() => deleteTweet(data.tid)} variant='outline-info' style={{ float: 'right', borderRadius: '2rem' }}>delete</Button></Col>
                                    </Row>
                                </Col>

                            </Row>

                        </Container>
                    )
                }

            </div>
        </div>
    )
}

export default Profile
