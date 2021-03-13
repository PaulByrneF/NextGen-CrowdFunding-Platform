// Get instance of a given campaign
import web3 from './web3';
import CampaignFactory from './build/Campaign.json'; //get ABI interface of campaign

//function called with address. Creates and returns instance of campaignFactory contract
export default (address) => {
    return new web3.eth.Contract(JSON.parse(CampaignFactory.interface), 
    address); //address passed in as argument.
};