import React, { Component } from 'react';
import { Form, Button, Input, Message} from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import instanceFactory from '../../ethereum/factory';
import Layout from '../../components/Layout';
import { Router } from '../../routes'; 
//Router object allows us to programmatically redirect users from one page to another inside of application.

class CampaignNew extends Component {

    //State object to store state custom properties
    state = {
        minimumContribution: '',
        errMsg: '',
        loading: false
    }

    onSubmit = async (event) => {

        //Prevent event default behaviour: reloading the page on submission
        event.preventDefault();
        
        //Start Spinner
        this.setState({ loading: true, errMsg: '' });

        //Handler to catch an error from response from createCampaign from factory smart contract
        try {
            //Start Spinner to indicate to user that transaction is in process: Network is authorising transaction
            //Success
            const accounts = await web3.eth.getAccounts();
            await instanceFactory.methods
            .createCampaign(this.state.minimumContribution)
            .send({ 
                from: accounts[0]
            });

            //Redirect user to campaignIndex page
            Router.pushRoute('/');

        } catch (err) {
            //Failed
            this.setState({ errMsg: err.message });
        }

        //Stop spinner when transaction complete
        this.setState({ loading: false });
        
    };

    render() {
        return (
            <Layout>
                <h3> Create a Campaign</h3>

                {/* Form to capture data for create campaign for factoryCampaign Contract function */}
                <Form onSubmit={this.onSubmit} error={!!this.state.errMsg}> {/* error{bool}, If true show error*/}
                    <Form.Field>
                        <label >Minimum Contribution</label>
                        <Input 
                        label="Wei" 
                        labelPosition="right"
                        value={this.state.minimumContribution}
                        onChange={event => 
                            this.setState({ minimumContribution: event.target.value })}
                        />
                    </Form.Field>
                    
                    {/* Message element from React Semantic UI - passing in state error message */}
                    <Message error header="Oops!" content={this.state.errMsg} />
                    <Button primary loading={this.state.loading} > Create! </Button>
                </Form>
            </Layout>
        );
    };
}

export default CampaignNew;