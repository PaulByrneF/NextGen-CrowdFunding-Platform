const path = require('path'); 
const fs = require('fs-extra'); // fs-extra module, filesystem gives access to local machine with helpers
const solc = require('solc'); //solidity compiler

const buildPath = path.resolve(__dirname, 'build'); // reference to folder
fs.removeSync(buildPath); // removes folder and child elements

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol'); // reference to contract
const source = fs.readFileSync(campaignPath, 'utf-8'); // readContents of campaign.sol
const output = solc.compile(source, 1).contracts; // pass sourcecode into solidity compiler. assign contracts property to output.

fs.ensureDirSync(buildPath); // check if exists. Creates dir is false.

// for each contract. create a contractName.json file within build directory
for( let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json' ),
        output[contract]
    );
}
