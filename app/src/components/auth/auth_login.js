import React from 'react';
import ReactDOM from 'react-dom';

import classnames from 'classnames';

import 'bootstrap/dist/css/bootstrap.css';

import {
    Container,
    Row,
    Col,
    Card,
    Input,
    FormGroup,
    Button
} from 'reactstrap'

class Login extends React.Component {

    constructor(){
        super();
        this.state = {
            email: '',
            password: ''
        }
    }

    render(){
        return (
            <div 
                className="gradient"
            >
                <Container >
                    <Card 
                        className="login-wrapper"
                    >
                        <Row>
                            <Col 
                                sm='0' 
                                lg='6' 
                                className="sm-hidden"
                            >
                                <div
                                    className="alternate-options"
                                >
                                    <h5>Alternate Options...</h5>
                                    <div className="options">
                                        <div>
                                            <a href="#" className="fa fat fa-github" title="Github"></a>
                                            <div className="options-name-github">Github</div>
                                        </div>
                                        <div >
                                            <a href="http://localhost:8080/auth/authorize/?provider=gitlab" className="fa fat fa-gitlab" title="Gitlab"></a>
                                            <div className="options-name-gitlab">Gitlab</div>
                                        </div>
                                    </div>
                                    <div className="footer">
                                        <p>We Provide support for OAUTH2 logins</p>
                                        <p><b>More options coming soon work under progress</b></p>
                                    </div>
                                </div>
                            </Col>
                            <Col
                                sm='12' 
                                lg='6'
                                className="login"
                            >
                                <h2>Member Login</h2>
                                <form
                                    className="login-form"
                                    method="POST"
                                    action="/auth/signin"
                                >   
                                    <div className="login-form-group">
                                        <Input
                                            placeholder="email address"
                                            className="login-input"
                                            type="email"
                                            name="email"
                                            value={this.state.email}
                                            onChange={(e) => this.setState({ email: e.target.value})}
                                        />
                                        <i className={
                                            classnames(
                                                "material-icons",
                                                "login-input-icons",
                                                {
                                                    'icon-active': this.state.email
                                                }
                                            )
                                        }>
                                            email
                                        </i>
                                    </div>
                                    <div className="login-form-group">
                                        <Input
                                            placeholder="password"
                                            className="login-input"
                                            name="password"
                                            type="password"
                                            value={this.state.password}
                                            onChange={(e) => this.setState({ password: e.target.value})}
                                        />
                                        <i className={
                                            classnames(
                                                "material-icons",
                                                "login-input-icons",
                                                {
                                                    'icon-active': this.state.password
                                                }
                                            )
                                        }>
                                            lock
                                        </i>
                                    </div>
                                    <Button className="login-submit" type="submit">
                                        Sign In
                                    </Button>
                                    <p>Forgot<b> <a href="#">Username</a> / <a href="#">Password</a> </b> ?</p>
                                </form>
                            </Col>
                        </Row>
                    </Card>
                </Container>
            </div>
        )
    }
}

export default Login;


