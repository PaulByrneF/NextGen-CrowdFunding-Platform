import React, { Component } from 'react';
import instanceFactory from '../ethereum/factory.js';
import { Card } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';

class CampaignIndex extends Component {

    //static is called by the class itself. Next requires this. 
    static async getInitialProps() {
        const campaigns = await instanceFactory.methods.getDeployedCampaigns().call();

        return { campaigns };
    }

    renderCmpaigns() {

        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true
            };
        });

        return <Card.Group items={items}/>
    }

    render() {
        return ( 
            <Layout>
            <div> 
                <h3>Open Campaigns</h3>

                <Link route="/campaigns/new">
                    <a> 
                        <Button floated="right" content="Create Campaign" icon="add circle" primary />
                    </a>
                </Link>
                { this.renderCmpaigns() } 
            </div>;
            </Layout>
        );
    }
}

export default CampaignIndex; //Next always expects an exported component. To render a webpage.