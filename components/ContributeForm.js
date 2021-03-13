//Contribute Form Component for Campaign

import { Router } from '../routes';
import React, { Component } from 'react';
import {Button, Form, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

class ContributeForm extends Component {

    state = {
        value: '',
        errMsg: '',
        loadingFlag: false
    };

    onSubmit = async (event) => {
        event.preventDefault();

       
        //call campaign function passing in the target campaignAddress. Returns instance of target campaign.
        const campaign = Campaign(this.props.campaignAddress);
        
        //Display Loader when the transaction is being processed by network
        this.setState({ loadingFlag: true, errMsg: '' });

        try {

            //Try call the contribute function from the campaign contract using the metamask account and the amount specified from form.
            const accounts = await web3.eth.getAccounts();

            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei( this.state.value, 'ether')
            });

            //Refresh Page when the transaction if successfully completed
            Router.replaceRoute(`/campaigns/${this.props.campaignAddress}`);

        } catch (err) {
            //Failed
            this.setState({ errMsg: err.message });
        };

        //Stop spinner when transaction complete
        this.setState({ loadingFlag: false, value: '' });
    };

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errMsg}>
                <Form.Field>
                    <label>Amount ot Contribute</label>
                    <Input 
                        value={this.state.value}
                        onChange={event => this.setState({ value: event.target.value })}
                        label="ether"
                        labelPosition="right"
                    />
                </Form.Field>
                <Message error header='Oops!' content={this.state.errMsg} />
                <Button primary loading={this.state.loadingFlag}> Contribute! </Button>
            </Form>
        );
    }
}

export default ContributeForm;