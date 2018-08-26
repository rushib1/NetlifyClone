import React from 'react';
import {
    Input,
    Button
} from 'reactstrap'

import { Link, withRouter } from 'react-router-dom';

class SiteHeader extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            search_keyword: ""
        }
    }

    render(){
        return (
            <div className="app-main-toolbar">
                <div className="app-toolbar-search">
                    <Input
                        className="icon-input"
                    />
                    <i className="fa  fat fa-search input-icons"></i>
                </div>
                <Button color="success" className="app-toolbar-new" onClick={ () => this.props.history.push('/start') }>Deploy new site</Button>
            </div>
        )
    }
}

export default withRouter(SiteHeader);