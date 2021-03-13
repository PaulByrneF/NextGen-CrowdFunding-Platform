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

# Node Modules

npm init
npm install --save ganache-cli mocha 
1. ganache-cli - used to boot local ethereum testnet with a provider property
2. mocha - js testing library to test our contract
3. fs-extra  -
4. web3 - used to interact with solidity contract from javascript.

# Front-End Application

UI Requirements
--------

1. [HomePage] must contain logo
2. [Homepage] must contain search box, to search for campaigns.
3. [HomePage] must contain a list of all open campaigns. displaying the contracts address & more details button.
4. [HomePage] must contain a 'create campaign' button.

5. [CreateCampaignPage] - must display input box [minimumContribution]
6. [CreateCampaignPage] - must display button to create campaign via factoryCampaign contract.

7. [ViewCampaign] - Must display Campaign Balance
8. [ViewCampaign] - Must display Campaign Minimum Contribution.8. 
9. [ViewCampaign] - Must display Campaign Pending Requests.
10. [ViewCampaign] - Must display input box[contibution]
11. [ViewCampaign] - Must display button to contribute to campaign.
11. [ViewCampaign] - Must display button to view pending requests.

12. [PendingRequestsPage] - Must display a table with all pending requests
13. [PendingRequestsPage] - Table must display properties: Id, Description, Amount Requested, Approval count, button[Approve], button[reject]
14. [PendingRequestsPage] - Must display button to add requests.
15. [PendingRequestsPage] - Must show total number of requests.

16. [CreateRequestPage] - Must display input[description].
17. [CreateRequestPage] - Must display input[requested-funds].
18. [CreateRequestPage] - Must display input[vendorAddress].
19. [CreateRequestPage] - Must display button that creates request. (Only Manager of campaign can execute this).

# Application Routing

[R1] -> '/' | List of campaigns
[R2] -> 'campaings/new' | Form to make new campaign
[R3] -> 'campaigns/0x8f345gr..' | Campaign details for campaign at address '0x8f345gr'
[R4] -> 'campaigns/0x8f345gr../requests' | Requests for camapaign at address '0x8f345gr'
[R5] -> 'campaigns/0x8f345gr../requests/new' | Form


# Logic development steps for pages

Campaign List Page
-------------

1. Configure web3 with a provider from metamask. Ref: [ethereum/web3.js]
2. Tell web3 that a deployed copy of the 'campaignFactory' exits. Ref: [ethereum/factory.js]
3. Use Factory instance to retrieve a list of deployed campaigns.
4. Use React to show something about each campaign.


# Potential Technology Stacks

create-react-app
----------
 - Used for creating simple react applications. 
 - Drawbacks - (By default, doesn't inc. navigation, data loading, etc...). 

Next.js
---------

 - Next.js is a framework Wraps up React + associated tools into one package.
 - Lots of fancy features included out of the box. Builds functionality around react. Features include:

    - Routing.
    - Server Side rendering.
    - Hot module reload. (Update code inside application easily - developer experience.)

 - Makes it really, really easy to use React to make a multi-page application.
 - Resources: https://nextjs.org/

- Next.js looks at react components within pages directory and creates webpages which users are directed to via routing.

 # Next Set Up

 install dependencies:

 - npm install --save next@4.1.4 react react-dom
 - To run project, create script within package.json and add alias for dev. Then run npm run dev.

 # Additional Notes

 - [Window-Not-Defined-Error] - This is caused as Next cannot access the window when rendering the html doc from server.

 Process of Next.js
 ----------------
 1. Our Code -> Next Server
 2. Next Server renders static HTML doc and serves to client browser. Thus, window undefined
 3. HTML Doc is parsed and displayed on within browser.
 4. Our code executes and updates page.

 Note: We need to access Ethereum Network from server before code served to client. I.e. execute requests to network re Contracts.

 Additionally, accomodates users who do not use MetaMask.
 

# getInitialProps

- Lifecycle method developed exclusively for Next. 
- When Next boots up, it will loom at the Component.
- It will execute the getInitialProps function before the rendering Component
- It will retrieve the intial data and input into the Component and then Next will render the HTML Doc.
- Then served to the clients browser.

# Semantic UI React

- React Component Kit - Library with bunch of pre created components. Come with styling already placed on them.

Install -> npm install --save semantic-ui-react -> Elements
Install -> npm install --save semantic-ui-css

URL: https://react.semantic-ui.com/modules/checkbox/

# Next.js - Does not support dynamic routing

- Next.js does not support dynamic routing. I.e. a variables within the URI. e.g. [/campaigns/{variable}/requests].
- Helper module: next-routes: dynamic routing helpers.

npm install next-routes --save 

- [server.js] - Boot up next app, tells it to use routes.js.

- [routes.js] - Used to define custom routes with tokens inside the URI. I.e. [/campaigns/{variable}/requests].

- [routes.js] - Export routing helpers that allow components to naviagte users around application.

- Other routes will be handled via the default routing system included in next.js





