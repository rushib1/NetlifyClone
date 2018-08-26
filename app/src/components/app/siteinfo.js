import React from 'react';
import {
    netlifyClone_siteDetails
} from '../../misc/network_utils/index.js'

import firebase from 'firebase';

import {
    Row,
    Col,
    Container,
    Navbar,
    Collapse,
    Nav,
    NavItem,
    NavbarBrand,
    NavbarToggler,
    UncontrolledDropdown,
    NavLink,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Card,
    CardBody,
    CardHeader,
    Table
} from 'reactstrap';

class SiteInfo extends React.Component {
    state = {
        id: this.props.match.params.id,
        error: null,
        data: null,
        logs: []
    }

    componentDidMount() {
        var config = {
            apiKey: "AIzaSyB8Tya7fhntcD9JPjd3xDjfcAwYmDyKE7w",
            authDomain: "netlifyclone-2286a.firebaseapp.com",
            databaseURL: "https://netlifyclone-2286a.firebaseio.com",
            storageBucket: "netlifyclone-2286a.appspot.com",
        };
        firebase.initializeApp(config);
        let defaultDatabase = firebase.database()
        netlifyClone_siteDetails(this.props.match.params.id)
            .then((res) => {
                this.setState({
                    data: res.data
                })
                let log = defaultDatabase.ref(`site/${res.data.site}`);
                log.on('value', snapshot => {
                    this.setState({ logs: snapshot.val() })
                })
            })
        

        // console.log(firebase);
        // firebase.database.setLogLevel(Logger.Level.DEBUG)
        
        
    }

    render() {
        if (!this.state.data) return "Data Loading";
        return (
            <div>
                <header style={{ backgroundColor: "#0f1e25"}}>
                    <Container>
                    <Navbar dark expand="md">
                        <NavbarBrand href="/app/index">Netlify</NavbarBrand>
                        <Collapse isOpen={true} navbar>
                            <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href="/components/">Components</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
                            </NavItem>
                            </Nav>
                        </Collapse>
                    </Navbar>
                    </Container>
                </header>
                <main className="app-main">
                    <Container className="container">
                        <Row>
                            <Col lg="8" md="12">
                                <Card>
                                    <CardBody>
                                    <img src="https://images.pexels.com/photos/236047/pexels-photo-236047.jpeg?cs=srgb&dl=clouds-cloudy-countryside-236047.jpg&fm=jpg" className="media-screenshot" style={{float: "right"}}/>
                                        <h2>{this.state.data.site}</h2>
                                        <br/>
                                        <ul className="green-ol"><li><a href={`$http://{this.state.data.url}`} className="active-site">{this.state.data.url}</a></li></ul>
                                        <p>Deploys from <u>{this.state.data.provider}</u> Last update on: </p>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <br/>
                        <br/>
                        <Row>
                            <Col>
                                <Card>
                                    <CardBody>
                                        <h3>Site Details</h3>
                                        <hr></hr>
                                        <Table borderless striped style={{fontSize: "1.2rem"}}>
                                            <col width="30%" />
                                            <col width="70%" />
                                            <tbody>
                                                <tr>
                                                    <td scope="row">provider:</td>
                                                    <td><p>{this.state.data.provider}</p></td>
                                                </tr>
                                                <tr>
                                                    <td scope="row">Repository Name:</td>
                                                    <td colSpan="3"><p>{this.state.data.repo_name}</p></td>
                                                </tr>
                                                <tr>
                                                    <td scope="row">branch:</td>
                                                    <td><p>{this.state.data.repo_branch}</p></td>
                                                </tr>
                                                <tr>
                                                    <td scope="row">build command:</td>
                                                    <td><p>{this.state.data.build_command}</p></td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <br/>
                        <br/>
                        <Row>
                            <Col>
                                <Card inverse={true} style={{ backgroundColor: "#2a2734", letterSpacing: "1px", color: 'white' }}>
                                    <CardBody>
                                        <Table borderless striped style={{fontSize: "1.2rem"}}>
                                            <col width="20%" />
                                            <col width="80%" />
                                            <tbody>
                                               {
                                                    this.state.logs.map((val) => {
                                                        return (
                                                            <tr>
                                                                <td scope="row" style={{color: "wheat"}}>{val[0]}:</td>
                                                                <td><p>{val[1]}</p></td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            
                                            </tbody>
                                        </Table>
                                        
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </main>
            </div>
        )
    }
}

export default SiteInfo;