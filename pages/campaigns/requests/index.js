import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Campaign from '../../../ethereum/campaign'
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {

    static async getInitialProps(props) {
        const { address } = props.query;
        console.log(address)

        //get instance of campaign
        const campaign = Campaign(address);

        //get total number of requests from campaign
        const requestCount = await campaign.methods.getRequestsCount().call();

        //Get total investors/contibutors to the given campaign contract instance
        const approversCount = await campaign.methods.approversCount().call();

        //Iterate from 0 -> requestsCount
        const requests = await Promise.all(
            Array(parseInt(requestCount)) //Array with length of requestCount. parseInt on returned string from call
                .fill() //create empty index
                .map((element, index ) => { 
                return campaign.methods.requests(index).call(); // return Individual request
            })
        );

        console.log(requests);
        return { address, requests, requestCount, approversCount};
    }

    rendorRows() {
        return this.props.requests.map((request, index ) => {
            return (
                <RequestRow
                    key={index}
                    id={index}
                    request={request}
                    address={this.props.address}
                    approversCount={this.props.approversCount}
            />
            );
        });
    };

    render() {

        const { Header, Row, HeaderCell, Body } = Table;
        return (
            <Layout>
                <h3>Requests</h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary floated="right" style={{marginBottom: 10 }}>Add Request</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Vendor</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.rendorRows()}
                    </Body>
                </Table>
                <div>Found {this.props.requestCount} requests. </div>
            </Layout>
        );
    };
}

export default RequestIndex;