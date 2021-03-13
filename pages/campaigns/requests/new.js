import React, { Component } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';
import Layout from '../../../components/Layout'

class RequestNew extends Component {
   
    state = {
        description: '',
        value: '',
        vendorAddress: '',
        loadingFlag: false,
        errMsg: ''
        };
    
    static async getInitialProps(props) {
        const { address } = props.query;
        console.log(address)
        return { address };
    }

    onSubmit = async (event) => {
        event.preventDefault();

        const campaign = await Campaign(this.props.address);
        const {description, value, vendorAddress} = this.state;

        this.setState({ loadingFlag: true, errMsg: '' });

        try {
            
            const accounts = await web3.eth.getAccounts();
            await campaign.methods
                .createRequest(description, web3.utils.toWei(value, 'ether'), vendorAddress)
                .send({ from: accounts[0] });

                Router.pushRoute(`/campaigns/${this.props.address}/requests`);
        } catch (err) {
            console.log(err);
            this.setState({ errMsg: err.message });
        }

        this.setState({ loadingFlag: false });
    }

    render() {
        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a> Back </a>
                </Link>
                <h3>Create a Payment Request</h3>
            <Form onSubmit={this.onSubmit} error={!!this.state.errMsg}>
                <Form.Field>
                    <label>Description</label>
                    <Input 
                        value={this.state.description}
                        onChange={event => 
                            this.setState({ description: event.target.value })}
                    />
                </Form.Field>

                <Form.Field>
                    <label>Value (Ether)</label>
                    <Input 
                        value={this.state.value}
                        onChange={event => 
                            this.setState({ value: event.target.value })}
                    />
                </Form.Field>

                <Form.Field>
                    <label>Vendor (Ethereum Address)</label>
                    <Input 
                        value={this.state.vendorAddress}
                        onChange={event => 
                            this.setState({ vendorAddress: event.target.value })}
                    />
                </Form.Field>
                <Message error header="Oops!" content={this.state.errMsg} />
                <Button primary loading={this.state.loadingFlag}>Create Request</Button>
            </Form>
            </Layout>
        );
    }
}

export default RequestNew;