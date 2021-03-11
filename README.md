# Next Generation Crowd Funding Platform - Ethereum

Overview
----------------

A next generation crowdfunding platform, connecting investors across the globe to invest in professionally pitched projects. The investors can invest generate capital by funding the project with ether. The ether get pooled together into a compnay fund. If management wish to buy goods or services, they will have to request funds from the investment pool. The investors can then vote on each request to ensure the funds are being used for business purposes.

Problem Domain
----------------
Typically, Investotrs who invest in crowdfunding projects do not retain any control over how the capital can be used and more importantly, who can tap into the that capital. This leaves crowdfunding platfroms prone to fraud scandals, where the founder can send this capital into his/her personal bank account.

# Campaign Contract Design

Variables
-----------

- manager | type <address> | address of the person who manages the campaign
- minimumContribution | type <uint> | Min donation required to be considered as a contributer  or "approver"
- approvers | type <mapping> | list of addresses for every contributing donator
- requests | type <requests[]> | list of requests the manager has created

    Request <struct> properties
    - description | type <string> | description of why request being sent
    - value | type <uint> | the amount request for goods/services that is to be sent to vendor
    - recipient | type <address> | the vendor address, which the money will be sent to
    - complete | type <bool> | True if request has processed (money sent).
    - approvals | type <mapping> | Track who has voted.
    - approvalCount | type <uint> | track number of approvals.

- approversCount | Reduce fee for searching 'iterating' over array of addresses, instead increments the approversCount. 

Note: Mapping being used for efficient search. (Constant Time) vs Array (Linear Time). LookUp Process: User provides key -> hashing function -> index -> value
Functions
------------

- Compaign | Constructor function that sets the managers and minContribution on contract creation
- contribute | Called when someone wants to donate money (ether) to the campaign and become a 'approver'
- createRequest | Called only by manager to create new 'spending request'
- approveRequest | Called by each contributor to approve a request
- finalizeRequest | after a request has gotten sufficient approvals, the manager can call this function to send ether to the vendor.

# CampaignFactory Design

Variables

- deployedCampaigns | type <address[]> | Addresses of all deployed compaign contract instances.

Functions

- createCampaign| Deploys a new instance of Campaign and stores the resulting addresses
- getDeployedCampaigns | Returns a list of all deployed campaign contract addresses

Note: Solidity built in getter only retrieves 1 element. Reason we build custom function 'getDeployedCampaigns'


# Deployment Strategy

Overview
-------
Users can deploy their own instance of the contract on the ethereum network. Each contract instance is completely independent from eachother. Each contract address would be returned to the application to display the corresponding data and public functions. 

Problem Domains
--------

1. Solution: 1

- User clicks 'create campaign'
- We send user the contracts source code to the client (users browser).
- User uses web3 + metamask to deploy the new contract to ethereum network.
- User then sends the new contracts address to us. For us to control.
- We then take that address and publish publicly on site for the world to see and interact with. I.e. invest and become contributors.

1. Problem 

As we send the contracts source code back to the users browser, the user can maliciously modify the source code to erase restrictions and policies. Thus, allowing them to send themselves all of the funds. Then deploying the contract to mimic genuine campaigns. Conclusion: Do not trust/allow users to deploy an instance of the campaign contract directly.

2. Solution: 2

- User clicks 'create campaign'
- We deploy new instance of contract 'campaign', retrieve the contracts address.
- We publish the new campaign on the application.

2. Problem

We would have to pay for the deployment of new 'campaign contracts'. Users can keep creating contracts, while we inccur all the costs. 

3. Solution : Optimal

- Create a 'factory contract'. This contract has a function to deploy a new instance of 'campaign contract' to the ethereum network.
- User clicks create 'compaign'
- We instruct web3/metamask to show user a transaction that invokes 'Campaign Factory'
- User pays deployment costs. Factory deploys a new instance of the 'campaign contract'.
- We tell 'Campaign factory' to give us a list of all deployed campaign instances.

Conclusion

This is the best deployment strategy as we do not provide the campaigns source code to the end user which makes us prone to malicious attacks. Additionally, we are charging the user deployment fees and therefore, not incurring any costs.

# additional Notes

In solidity, Storage and Memory are references two completely different topics.

Storage, Memory -> Sometimes reference where contract stores data -> Sometimes references how solidity variables store values.

Data Holding places
----------------
Storage | Holds data between function calls | Similar to computers Hard Drive
Memory | Temporary place to store data | Similar to computers RAM 

Structs
----------------
- When creating a new instance of struct, we have to specify when we want to create a reference to a copy of the struct stored in memory (temp copy) or we can point to the actual struct within storage.
- Have to initialise value types
- Do not have to initialise reference type


