import React from 'react'
import './index.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SUCCESS_REGISTER = "User details are inserted";

class Register extends React.Component {

    state = {
        username: "",
        password: "",
        name: "",
        phone: "",
        mail: ""
    }

    registerHandler(event) {
        event.preventDefault();

        if (this.state.username.trim() === "" || this.state.password.trim() === "" || this.state.name.trim() === "" || this.state.phone.trim() === "" || this.state.mail.trim() === "") {
            alert('please enter all required feilds');
            return;
        }
        let formData = new FormData();
        const username = this.state.username.trim();
        formData.append('username', this.state.username.trim());
        formData.append('password', this.state.password.trim());
        formData.append('name', this.state.name.trim());
        formData.append('phone', this.state.phone.trim());
        formData.append('mail', this.state.mail.trim());

        axios({
            method: 'post',
            url: 'http://localhost:8100/Desktop/webProjects/firstapp/phptemplate/index.php',
            data: formData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        }).then(function (response) {
            if (response.data === SUCCESS_REGISTER) {
                window.location.href = '/' + username;
            } else {
                alert(response.data);
            }
        }).catch(function (response) {
            console.log(response)
        });
    }
    render() {
        return (
            <div className="auth">
                <input type="text" name="username" placeholder="enter username" id="username" value={this.state.username} onChange={(e) => this.setState({ username: e.target.value })} /> <br />
                <input type="text" name="password" placeholder="enter password" id="password" value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} /> <br />
                <input type="text" name="name" placeholder="enter name" id="name" value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} /> <br />
                <input type="text" name="phone" placeholder="enter phone" id="phone" value={this.state.phone} onChange={(e) => this.setState({ phone: e.target.value })} /> <br />
                <input type="text" name="mail" placeholder="enter mail" id="mail" value={this.state.mail} onChange={(e) => this.setState({ mail: e.target.value })} /> <br />
                <button onClick={(e) => this.registerHandler(e)}>Register</button><br />
                <h4>already has an account? <Link to="/">Login</Link></h4>
            </div>
        )
    }
}

export default Register
