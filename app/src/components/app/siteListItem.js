import React from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router';

// SiteListItem.propTypes = {
//     deploy: PropTypes.string,
//     image_url: PropTypes.string,
//     owner: PropTypes.string,
//     last_update: PropTypes.string
// }

class SiteListItem extends React.Component {

    constructor(props){
        super(props)
    }

    render() {
        return (
            <li className="clickable" onClick={() => {
                this.props.history.push(`/site_info/${this.props.site['id']}`)
            }}>
                <div style={{ display: "flex", paddingLeft: "3px"}}>
                    <div className="media-figure">
                        <img src="https://images.pexels.com/photos/236047/pexels-photo-236047.jpeg?cs=srgb&dl=clouds-cloudy-countryside-236047.jpg&fm=jpg" className="media-screenshot"/>
                    </div>
                    <div className="media-body">
                        <div className="site-info">
                            <p className="pimportant">{this.props.site['repo']}</p>
                            <p className="pmeta">Deploys from {this.props.site['provider']}</p>
                        </div>
                        <div className="site-info">
                            <p className="pimportant">{this.props.site['owned']}</p>
                            <p className="pmeta">{this.props.site['last_updated']}</p>
                        </div>
                    </div>
                </div>
            </li>
        )
    }

}

export default withRouter(SiteListItem);