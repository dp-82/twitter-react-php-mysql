import React from 'react'
import './auth.css';
import axios from 'axios';
import { Link } from 'react-router-dom';


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
            method: 'post',
            url: 'http://localhost:8100/Desktop/webProjects/firstapp/phptemplate/index.php',
            data: formData,
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
    }

    render() {
        return (
            <div className="login-auth">
                <img src="tiniLogo.png" alt="Logo" />
                <h1>Log in to Twitter</h1>
                <input type="text" name="username" placeholder="enter username" id="username" value={this.state.username} onChange={(e) => this.setState({ username: e.target.value })} /> <br />
                <input type="text" name="password" placeholder="enter password" id="password" value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} /> <br />
                <button onClick={(e) => this.loginHandler(e)}>Log in</button> <br />
                <h4>don't have an account? <Link to="/register">Register</Link></h4>
            </div>
        )
    }
}

export default Login
