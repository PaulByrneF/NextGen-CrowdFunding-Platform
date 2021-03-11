const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile.js');
const compileFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
    // mnemonic from MetaMask
    'idea sign clarify tape cargo chimney room stairs nothing giggle electric waste',

    //APIKEY from Infura.io which runs a ethereum node on the Rinkeby Network
    'https://rinkeby.infura.io/v3/b775911c6d024d2f98148e74f80eff86'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account:', accounts[0]);

    const result = await new web3.eth.Contract(
        JSON.parse(compileFactory.interface)
    )
        .deploy({ data: compileFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000'});

    console.log('Contract deployed to address', result.options.address);
}
deploy();