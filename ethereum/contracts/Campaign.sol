pragma solidity ^0.4.25;

contract CampaignFactory {
    
    address[] public deployedCampaigns;
    
    // minContribution to be injected into capmaign constructer function
    function createCampaign(uint minContribution) public {
        
        //Instruct this contract to deploy new instance of Campaign with actual managers address
        // returns the address of newly created contract instance.
        address newCampaign = new Campaign(minContribution, msg.sender); 
        
        //Add new campaign address to array
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    
    // Request struct definition: new type
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint approvalCount;
    }
    
    // Initialise & Declare global variables
    Request[] public requests;
    address public manager;
    uint public minContribution;
    mapping(address => bool) public approvers; 
    uint public approversCount;
    
    
    // Define the constructor function for the contract: sets manager of campaign, sets minimumContribution for investors
   constructor (uint minimumContribution, address creator) public {
        manager = creator;
        minContribution = minimumContribution;
    }
    
    //Modifier used to validate that the sender is the manager; injects the function after validation.
    modifier restricted() {
        require(manager == msg.sender);
        _;
    }
    
    //Define function to allow investors to contribute to campagin
    //Note payable property as there will be incoming tarnsactions with money(ether)
    function contribute() public payable {
        
        // Ensure investors donate more than the minimum requirement
        require( msg.value > minContribution);
        
        //Adds sender address as the value with a value of 'true'
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    //Define 
    function createRequest(string description, uint value, address recipient) public restricted{

        // Create a new instance of Request called newRequest, populating properties
        //memory tells solidity that we only want to store a temporary copy of Request in memory as oposed to storage.
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
            //do not have to initialise a reference type within a struct
        });
        
        requests.push(newRequest);
    }
    
    function approveRequest (uint index) public payable {
        // create local variable that points to actual request struct within storage. 
        Request storage request = requests[index];
        
        //pass the sender address as key within mapping lookup. If true, continue. If false, exit.
        require(approvers[msg.sender]);
        
        //Validate that the requesting user has not voted on the given request by passing address into map as a key. If true: exit, If false: continue
        require(!request.approvals[msg.sender]);
        
        //Updates the users approval to true for given request. Stops user from voting twice.
        request.approvals[msg.sender] = true;
        
        //increment approval count 
        request.approvalCount++;
    }
    
    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index];
        require(!request.complete);
        
        //Check that more than 50% of investors endorse the request
        require(request.approvalCount > approversCount / 2);
        
        
        //address of vendor we want to transfer funds to
        request.recipient.transfer(request.value);
        //Set the request to completed (true)
        request.complete = true;
    }

    //gets the summary of details for campaign
    function getSummary() public view returns (
        uint, uint, uint, uint, address
        ) {
        return (
            minContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    //function getRequestsCount returns the total number of requests
    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

}