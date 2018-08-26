import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import 'react-select/dist/react-select.css';

import {
    Container,
    Navbar,
    Nav,
    Collapse,
    NavbarBrand,
    NavLink,
    NavItem,
    Card,
    CardBody,
    Button,
    Dropdown,
    DropdownItem,
    DropdownToggle,
    DropdownMenu,
    Input
} from 'reactstrap';

import Select from 'react-select';

import { gitlab_GetRepositoryList, gitlab_GetBranchList, netlifyClone_newDeployKey, netlifyClone_deployKeySuccess, gitlab_addNewDeployKey, gitlab_addGitHook } from '../../misc/network_utils';
import RepoItem from './repoItem';

let src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIC4wNDMgMzAuOTEzKSI+CiAgICA8cGF0aCBmaWxsPSIjRkM2RDI2IiBkPSJNMzEuNzQxOTM0NywxMi43NTEwOTE0IEwyOS45NjM5NTYzLDE4LjMwNjYzNzEgTDI2LjQ0MDI1NzQsMjkuMzE3Mzc5MSBDMjYuMjU5MDEwMSwyOS44ODM4NDIgMjUuNDY5NTkwOCwyOS44ODM4NDIgMjUuMjg4MjU3NCwyOS4zMTczNzkxIEwyMS43NjQ0NzI2LDE4LjMwNjYzNzEgTDEwLjA2MzM5NzYsMTguMzA2NjM3MSBMNi41Mzk1MjY3MSwyOS4zMTczNzkxIEM2LjM1ODI3OTQxLDI5Ljg4Mzg0MiA1LjU2ODg2MDA4LDI5Ljg4Mzg0MiA1LjM4NzUyNjc1LDI5LjMxNzM3OTEgTDEuODYzODI3OTEsMTguMzA2NjM3MSBMMC4wODU5MzU0ODE5LDEyLjc1MTA5MTQgQy0wLjA3NjMwMTA3MzUsMTIuMjQ0MzY2NSAwLjEwMTQxOTM1MiwxMS42ODkyNTc0IDAuNTI1OTM1NDcxLDExLjM3NjA2OTYgTDE1LjkxMzg5MjEsMC4wMjUyNDAxNzQxIEwzMS4zMDE5MzQ3LDExLjM3NjA2OTYgQzMxLjcyNjQ1MDgsMTEuNjg5MjU3NCAzMS45MDQwODUyLDEyLjI0NDM2NjUgMzEuNzQxOTM0NywxMi43NTEwOTE0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSguMDM0IC4wNSkiLz4KICAgIDxwb2x5Z29uIGZpbGw9IiNFMjQzMjkiIHBvaW50cz0iNS44NzEgMCA1Ljg3MSAwIDExLjcyMiAxOC4yODEgLjAyIDE4LjI4MSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAuMDc3IC4wNzYpIi8+CiAgICA8cG9seWdvbiBmaWxsPSIjRkM2RDI2IiBwb2ludHM9IjE0LjEwOCAwIDguMjU3IDE4LjI4MSAuMDU3IDE4LjI4MSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS44NCAuMDc2KSIvPgogICAgPHBhdGggZmlsbD0iI0ZDQTMyNiIgZD0iTTEuODkyNDczMDcsMTguMzQwNjEwOSBMMS44OTI0NzMwNywxOC4zNDA2MTA5IEwwLjExNDQ5NDYyMSwxMi43ODUwNjUyIEMtMC4wNDc2NTU5MTI4LDEyLjI3ODM0MDMgMC4xMjk5Nzg0OTIsMTEuNzIzMjMxMSAwLjU1NDU4MDYzMiwxMS40MTAxMzA3IEwxNS45NDI1MzcyLDAuMDU5MzAxMzA4NiBMMS44OTI0NzMwNywxOC4zNDA2MTA5IEwxLjg5MjQ3MzA3LDE4LjM0MDYxMDkgWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLjAwNiAuMDE3KSIvPgogICAgPHBhdGggZmlsbD0iI0UyNDMyOSIgZD0iTTAsMCBMOC4xOTk0ODM2OCwwIEw0LjY3NTY5ODgxLDExLjAxMDc0MjEgQzQuNDk0MzY1NDgsMTEuNTc3MjkyMyAzLjcwNDk0NjE0LDExLjU3NzI5MjMgMy41MjM2OTg4NCwxMS4wMTA3NDIxIEwwLDAgTDAsMCBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjg5OCAxOC4zNTcpIi8+CiAgICA8cG9seWdvbiBmaWxsPSIjRkM2RDI2IiBwb2ludHM9IjAgMCA1Ljg1MSAxOC4yODEgMTQuMDUgMTguMjgxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNS45NDggLjA3NikiLz4KICAgIDxwYXRoIGZpbGw9IiNGQ0EzMjYiIGQ9Ik0xNC4xMDc1MjY1LDE4LjM0MDYxMDkgTDE0LjEwNzUyNjUsMTguMzQwNjEwOSBMMTUuODg1NTA1LDEyLjc4NTA2NTIgQzE2LjA0NzY1NTUsMTIuMjc4MzQwMyAxNS44NzAwMjExLDExLjcyMzIzMTEgMTUuNDQ1NDE5LDExLjQxMDEzMDcgTDAuMDU3NDYyMzY0MSwwLjA1OTMwMTMwODYgTDE0LjEwNzUyNjUsMTguMzQwNjEwOSBMMTQuMTA3NTI2NSwxOC4zNDA2MTA5IFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1Ljg5IC4wMTcpIi8+CiAgICA8cGF0aCBmaWxsPSIjRTI0MzI5IiBkPSJNOC4yNTgwNjQzMiwwIEwwLjA1ODU4MDY0MzcsMCBMMy41ODIzNjU1LDExLjAxMDc0MjEgQzMuNzYzNjk4ODMsMTEuNTc3MjkyMyA0LjU1MzExODE3LDExLjU3NzI5MjMgNC43MzQzNjU0NywxMS4wMTA3NDIxIEw4LjI1ODA2NDMyLDAgTDguMjU4MDY0MzIsMCBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMS43NCAxOC4zNTcpIi8+CiAgPC9nPgo8L3N2Zz4K";

const StepGit = ({callert}) => {

    const vanner = (provider) => {
        let myWindow = window.open("http://localhost:8080/auth/authorize/?provider=gitlab", 'myWindow', "height=600 width=600")
        myWindow.facebook = (oauth2, username) => {
            myWindow.close()
            callert(provider, oauth2, username);
        }
    }

    return (    
        <Button color="sucess" onClick={() => vanner('gitlab')} className="git-provider-btn"><img src={src} height="18px" width="18px"></img> gitlab</Button>
    )   
}

const StepRepoSelect = ({repos, provider, repoClick}) => {
    if (repos)
        return (
            <div>
                <ul className="repo-list">
                {
                    repos.map(repoitem => {
                        return (
                                <RepoItem repoitem={repoitem} onClick={repoClick} />
                        )
                    }) 
                    
                }
                </ul>
            </div>
        )   
    return "Loading"
}

class StepBranchSelect extends React.Component {

    state = {
        branch: this.props.branch,
        build_command: this.props.buildCommand,
        work_directory: this.props.workDirectory
    }

    // constructor(props){
    //     super(props);
    //     this.state = {
    //         isOpen: false,
    //         branch: this.props.branch,
    //         build_command: this.props.buildCommand
    //     }
    // }

    reposToOptions = () => {
        let options = this.props.branches.map((branch) => {
            return {
                label: branch['name'],
                value: branch['name']
            }
        })
        return options;
    }

    submit = () => {
        this.props.changeDeployOptions({...this.state}, () => {
            this.props.onNewSiteSubmit();
        });
    }

    render() {
        const colorStyles = {
            control: styles => ({ ...styles, backgroundColor: 'white', cusor: 'pointer'}),
            option: styles => ({ ...styles, cursor: 'pointer'})
        }
        if (this.props.branches) {
            let options = this.reposToOptions();  
            return (
                <div>
                    <Select
                        options={options}
                        placeholder="select branch"
                        value={this.state.branch}
                        styles={colorStyles}
                        onChange={(value) => this.setState({ branch: value.value })}
                    />
                    <br/>
                    <h5>Basic build settings</h5>
                    <p> Get more control over how Netlify builds and deploys your site with these settings. </p>
                    <Input
                        placeholder="build command"
                        name="build_command"
                        type="text"
                        value={this.state.build_command}
                        onChange={(e) => this.setState({ build_command: e.target.value})}
                    />
                    <br/>
                    <Input
                        placeholder="working directory"
                        name="work_dir"
                        type="text"
                        value={this.state.work_directory}
                        onChange={(e) => this.setState({ work_directory: e.target.value})}
                    />
                    <br/>
                    <Button color='success' onClick={() => this.submit()}>Deploy</Button>
                </div>
            );
        }
        return "Loading";
    }
}



class NewSite extends React.Component {

    constructor() {
        super();
        this.state = {
            selected: {},
            oauth2: null,
            provider: null,
            repos: null,
            branches: null,
            username: null,
            step: 1
        }
    }

    hellbone = (provider, oauth2, username) => {
        this.setState({
            provider,
            oauth2,
            username,
            step: 2
        });
        gitlab_GetRepositoryList(username, oauth2)
            .then(res => this.setState({ repos: res.data }))
    }

    onNewSiteSubmit = () => {
        let siteid = null;
        netlifyClone_newDeployKey()
            .then(res => {
                siteid = res.data['siteid']
                return gitlab_addNewDeployKey(this.state.selected, res.data['public_key'], this.state.oauth2)
            })
            .then(res => netlifyClone_deployKeySuccess(
                siteid,
                this.state.provider, 
                this.state.selected.repoid, 
                this.state.selected.branch, 
                this.state.selected.repo_path_with_namespace, 
                this.state.selected.ssh_url_to_repo,
                this.state.selected.build_command,
                this.state.selected.work_directory
                
            ))
            .then(res => {
                if (res.status == 200) {
                    gitlab_addGitHook(this.state.selected.repoid, this.state.oauth2)
                        .then(res => {
                            this.props.history.push('/index')
                        })
                }
            })
    }

    onRepoSelect = (repoid, repo_path_with_namespace, ssh_url_to_repo) => {
        let selected = {
            repoid,
            ssh_url_to_repo,
            repo_path_with_namespace
        }
        this.setState({selected, step: 3});
        gitlab_GetBranchList(repoid, this.state.oauth2)
            .then(res => {
                this.setState({branches: res.data})
            })
    }

    changeDeployOptions = ({branch, build_command, work_directory}, callback) => {
        let selected = {
            ...this.state.selected,
            branch,
            build_command: build_command,
            work_directory
        }
        this.setState({
            selected
        }, () => {
            callback()
        })
    }

    renderSteps = () => {
        let step = this.state.step;
        switch(step) {
            case 1: return (
                <StepGit callert={this.hellbone}/>
            )
            case 2: return (
                <StepRepoSelect repos={this.state.repos} provider={this.state.provider} repoClick={this.onRepoSelect}/>
            )
            case 3: return (
                <StepBranchSelect 
                    branches={this.state['branches']} 
                    changeDeployOptions={this.changeDeployOptions} 
                    branch={this.state.selected.branch}
                    buildCommand={this.state.selected.build_command}
                    workDirectory={this.state.selected.work_directory}
                    onNewSiteSubmit={this.onNewSiteSubmit}
                />
            )
        }
    }

    displayHelperText = () => {
        switch(this.state.step) {
            case 1: return (
                <p>
                    Choose the Git provider where your site’s source code is hosted. When you push to Git, we run your build tool of choice on our servers and deploy the result.
                </p>
            )
            case 2: return (
                <p>
                    Choose the repository you want to link to your site on Netlify. When you push to Git, we run your build tool of choice on our servers and deploy the result.
                </p>
            )
            case 3: return (
                <p>
                    Get more control over how Netlify builds and deploys your site with these settings.
                </p>
            )
        }
    }

    render() {
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
                            <CardBody>
                                <section className="task-box">
                                    <div>
                                        <h3>Create new Site</h3>
                                        <p>From zero to hero, three easy steps to get your site on Netlify.</p>
                                        <ol className="task-progress">
                                            <li className={classnames("task-progress-step", {'active': this.state.step > 0})}>
                                                Connect to git provider
                                            </li>
                                            <li className={classnames("task-progress-step", {'active': this.state.step > 1})}>
                                                Pick a repository
                                            </li>
                                            <li className={classnames("task-progress-step", {'active': this.state.step > 2})}>
                                                branch and build options
                                            </li>
                                        </ol>
                                    </div>

                                    <div>
                                        <h4>Continuous Deployment: GitLab</h4>
                                        {this.displayHelperText()}

                                        <div className="task-body-steps">
                                            {this.renderSteps()}
                                        </div>
                                    </div>
                                    
                                </section>
                            </CardBody>
                        </Card>
                    </Container>
                </main>
            </div>
        )
    }
}

export default NewSite;