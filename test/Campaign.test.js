const assert = require('assert'); 
const ganache = require('ganache-cli'); // local ethereum testnet
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

// require in entire json file. I.e. contracts: ABI & ByteCode
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts; // declare variable to store all generated and available accounts from ganache
let factory; // instance of factory contract
let campaignAddress; // address of the deployed campaign contract
let campaign; // instance of campaign contract


beforeEach(async () => {
    //assign available accounts -> accounts variable
    accounts = await web3.eth.getAccounts();

    // creates instance of factory contract: create contract and deploy
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });
    
    //Using the factory instance, we make a call to createCampaign( minimumContribution ) and specifying the from and gas properties
    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    //Take the first element from response and assign to campaignAddress
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface), // pass in ABI interface from compiled contract
        campaignAddress
    );

});
//Tests to test the campaigns contract
describe('Campaigns', () => {

    //TC:0001 - Test the deployment of both, factory and campaign contracts
    it('deploys a factory and a campaign contract', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    //TC:0002 - Test that the user (manager) that creates the contract matches the actual address 
    it('Marks the caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.strictEqual(accounts[0], manager);
    });

    //TC:0003 - Validates that people can contribute money and marks them as an approver to influence where money is spent
    it('Allows people to contribute money and marks them as an approver', async () => {
        
        //Call the campaign function contribute() and send money with account 2
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1],
        });

        // calling the approvers function passing in the senders address. This address is passed into the hashing function which points to a bool value
        const isContributor = await campaign.methods.approvers(accounts[1]);
        assert.ok(isContributor);

    });

    //TC:0004 - Validates that a user cannot invest money that equates to less than minimum contribution of campaign.
    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '5',
                from: accounts[1]
            });
            assert(false); // if contribute success - assert false
        } catch (err) {
            assert(err); // if an error return from function, assert true
        }
    });

    //TC:0005 - Validate that a manager can create a request
    it('Allows manager to make a payment request', async () => {
        
        //Call createRequest as a manager to campaign contract
        await campaign.methods
        .createRequest('Hire engineering consultants', '100', accounts[1])
        .send({
            from: accounts[0],
            gas: '1000000'
        });

        // Call getRequests function within campaign contract to retrieve the first request object.
        const request = await campaign.methods.requests(0).call();

        //Assert that the description has been captured within contract
        assert.strictEqual('Hire engineering consultants',request.description);
    });

    //TC:0006 - Validates that a requests that has majority approvals, gets processed and funds sent to vendor
    it('Process requests', async () => {

        //Send money as contibution and be added to list of approvers.
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        //As the manager, create a payment request with args: request description, amount requested, vendor
        await campaign.methods
            .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({ from: accounts[0], gas: '1000000'});

        //As a valid approver (contributor), approve request at index 0 
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        //As the manager (founder), I want to finalize payment request
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        //Get the balance of the vendors' ethereum address
        let balance = await web3.eth.getBalance(accounts[1]);

        //Convert from Wei -> Ether
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);

        console.log(balance);

        //Check that the Vendors account is more than inital balance
        assert(balance > 104);
    });
});
