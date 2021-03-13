//Show details for a given Campaign

import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign'
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

class CampaignShow extends Component {

    //static is called by the class itself. Next requires this. 
    static async getInitialProps(props) {

        //returns instance of Campaign
        const campaign = Campaign(props.query.address); // call Campaign and pass in actual address of campaign
        
        //Calls getSummary on the campaign instance.
        //Returns: object{}
        // '0': '100', - minContribution
        // '1': '0', - balance
        // '2': '0', - requestsCount
        // '3': '0', - contibutorsCount
        // '4': '0xa53153f270C71E507...' - contibutorsCount
        const summary = await campaign.methods.getSummary().call();
        
        //Return individual properties of summary object returned from contract.
        return {
            campaignAddress: props.query.address,
            minContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
            
        };
    };

    renderCards() {

        const {
            balance,
            manager,
            minContribution,
            requestsCount,
            approversCount
        } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Ethereum Address of Manager',
                description: 'The manager created this campaign. The manager is responsible for creating payment requests that requests money from raised captital to pay for services/goods from a given vendor.',
                style: { overflowWrap: 'break-word' }
            },

            {
                header: minContribution,
                meta: 'Minimum Contribution (Wei)',
                description: 'You must contribute atleast this much wei to become an approver'
            },

            {
                header: requestsCount,
                meta: 'Number of payment requests from manager',
                description: 'A request is a ticket created by the manager to request funds from raised captial to pay for services/goods from a vendor for the business'
            },

            {
                header: approversCount,
                meta: 'Number of Approvers/Investors',
                description: 'Number of Investors who have already donated capital to the business. Therefore, have the ability to vote on requests'
            },

            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (Ether)',
                description: 'A request is a ticket created by the manager, to request funds of raised captial to pay for services/goods from a vendor for the business'
            }
        ];

        return <Card.Group items={items} />
    }

    render() {
        return (
        <Layout>
            <h3>CampaignShow Page</h3>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={10}>
                        {this.renderCards()}
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <ContributeForm campaignAddress={this.props.campaignAddress} /> 
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Link route={`/campaigns/${this.props.campaignAddress}/requests`}>
                            <a>
                                <Button primary>View Requests</Button>
                            </a>
                        </Link>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
        );
    };
}

export default CampaignShow;