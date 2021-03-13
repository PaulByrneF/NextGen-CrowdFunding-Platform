import React from 'react';
import { Menu, menu } from 'semantic-ui-react';
import { Link } from '../routes';
//Link object is React Component allow us to render anchor tags into our React Components & navigate around application.

export default () => {
    return (
        <Menu style={{marginTop: '10px'}} >
            {/* link to home page */}
            <Link route="/" >
                <a className="item">CrowdCoin</a>
            </Link>

            {/* Link to HomePage */}
            <Menu.Menu position="right">
            <Link route="/" >
                <a className="item">Campaigns</a>
            </Link>

            {/* Link to Create CampaignPage */}
            <Link route="/campaigns/new" >
                <a className="item">+</a>
            </Link>
            </Menu.Menu>
        </Menu>
    );
};