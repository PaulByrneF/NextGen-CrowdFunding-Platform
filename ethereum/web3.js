import Web3 from 'web3'; 

let web3;
// Clause handles case of code being executed in browser and metamask is available.
//typeof operator : to see if variable is defined
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    // Connect to metamask
    window.ethereum.request({ method: 'eth_requestAccounts' });

    //create new instance of Web3 and pass the injected web3 from metamask and it's respective provider to Rinkeby testnet specified in MetaMask tool
    // hijack injected web3 instance from metamask and pass provider into web3 v1.0.3
    web3 = new Web3(Web3.givenProvider);
} else {
    //We are on the server *OR* the user is not running metamask
    //Passing in the Infura API Key to communicate with the Infura Ethereum Node 
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/b775911c6d024d2f98148e74f80eff86'
    );

    web3 = new Web3(provider);
}

//Export instance
export default web3;