import React from 'react';
import ReactDOM from 'react-dom';

import classnames from 'classnames';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';

import SiteListItem from './siteListItem.js';
import SiteHeader from './siteHeader.js';

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
    CardHeader
} from 'reactstrap';
import { netlifyClone_allSitesList } from '../../misc/network_utils/index.js';

class AppIndex extends React.Component {

    state = {
        sites: null
    }

    componentDidMount() {
        netlifyClone_allSitesList()
            .then(res => this.setState({ sites: res.data}))
    }

    render(){
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
                        <Card>
                            <CardHeader>
                                <SiteHeader />
                            </CardHeader>
                            <CardBody>
                             <ul className="site-list">
                                    {
                                        this.state.sites &&
                                        this.state.sites.map(site => (
                                            <SiteListItem site={site} />
                                        ))
                                    }
                                </ul>
                            </CardBody>
                        </Card>
                    </Container>
                </main>
            </div>
        )
    }
}

export default AppIndex;