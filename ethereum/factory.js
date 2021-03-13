import web3 from './web3'; //Import instance of web3 from ethereum/web3
import CampaignFactory from './build/CampaignFactory.json'; //Access ABI interface of compaignFactory

//Access to the deployed instance of CampaignFactory instance
const contractInstance =  new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x90E5B174Bb7ca57Cc83A7Bc19448016Ec5Fff84A'
);

//Export instance of contract
export default contractInstance;