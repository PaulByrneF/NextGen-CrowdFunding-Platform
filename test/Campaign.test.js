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

describe('Campaigns', () => {
    it('deploys a factory and a campaign contract', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    })
})
