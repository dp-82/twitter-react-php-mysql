import React from 'react'
import './auth.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import { FaTwitter } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import { Row, Col, Form } from 'react-bootstrap'

const SUCCESS_LOGIN = "User details are correct";

class Login extends React.Component {

    constructor(props) {
        super(props);
        if (sessionStorage.getItem('username') != null) window.location.href = '/home';
    }
    state = {
        username: "",
        password: ""
    }

    loginHandler(event) {
        event.preventDefault();

        if (this.state.username.trim() === "" || this.state.password.trim() === "") {
            alert('please enter all required feilds');
            return;
        }
        let formData = new FormData();
        const username = this.state.username.trim();
        const password = this.state.password.trim();
        formData.append('username', username);
        formData.append('password', password);
        axios({
            method: 'get',
            url: 'http://localhost:8282/login/' + username + '=' + password,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        }).then(function (response) {
            if (response.data === SUCCESS_LOGIN) {
                sessionStorage.setItem('username', username);
                window.location.href = "/home";
            } else {
                alert(response.data);
            }
            console.log(response);
        }).catch(function (response) {
            console.log(response)
        });
        // axios({
        //     method: 'post',
        //     url: 'http://localhost:8100/Desktop/webProjects/firstapp/phptemplate/index.php',
        //     data: formData,
        //     config: { headers: { 'Content-Type': 'multipart/form-data' } }
        // }).then(function (response) {
        //     if (response.data === SUCCESS_LOGIN) {
        //         sessionStorage.setItem('username', username);
        //         window.location.href = "/home";
        //     } else {
        //         alert(response.data);
        //     }
        //     console.log(response);
        // }).catch(function (response) {
        //     console.log(response)
        // });
    }

    render() {
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <Row style={{ width: '100%', height: '100%' }}>
                    <Col></Col>
                    <Col style={{ width: '33%', padding: '2%' }}>
                        <IconContext.Provider value={{ style: { fontSize: '50px', color: "rgb(0, 123, 255)" } }}>
                            <div>
                                <FaTwitter />
                            </div>
                        </IconContext.Provider>
                        <h3 style={{ marginTop: '3%' }}>Log in to Twitter</h3>
                        <Form style={{ width: "60%" }}>
                            <Form.Group>
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="Enter username" value={this.state.username} onChange={(e) => this.setState({ username: e.target.value })} />
                            </Form.Group>
                            <br />
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter password" value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} />
                            </Form.Group>
                            <br />
                            <Button onClick={(e) => this.loginHandler(e)} style={{ borderRadius: '2rem', backgroundColor: 'rgb(0, 123, 255)', width: '100%', height: '2.5rem' }}>Log in</Button> <br />

                        </Form><br />
                        <Link to="/register" style={{ textDecoration: 'none' }}><h6 style={{ marginLeft: '7rem', fontWeight: 'normal' }}>Sign up for Twitter</h6></Link>
                    </Col>
                    <Col></Col>
                </Row>

            </div>
        )
    }
}

export default Login
