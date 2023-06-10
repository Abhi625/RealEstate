//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

interface IERC721 {
    function transferFrom(address _from, address _to, uint256 _id) external;
}

contract Escrow {

         address public nftAddress;
         uint256 public nftID;
         uint256 public purchasePrice;
         uint256 public escrowAmount;
         address payable public seller;
         address payable public buyer;
         address public inspector;
         address public lender;

         modifier onlyBuyer() {
            require(msg.sender == buyer, "only buyer can call this function");
            _;
        }

        modifier onlyInspector() {
            require(msg.sender == inspector, "only inspector can call this function");
            _;
        }

        bool public inspectionPassed= false;
        mapping(address => bool) public approval;

        receive() external payable {}

        constructor(address _nftAddress, uint256 _nftID, uint256 _purchasePrice, uint256 _escrowAmount, address payable _seller, address payable _buyer, address _inspector, address _lender) {
            nftAddress= _nftAddress;
            nftID= _nftID;
            purchasePrice= _purchasePrice;
            escrowAmount= _escrowAmount;
            buyer= _buyer;
            seller= _seller;
            inspector= _inspector;
            lender= _lender;
        }

        function depositEarnest() public payable onlyBuyer() {
          require(msg.value >= escrowAmount);  
          
        }

        function updateInspectionStatus( bool _passed) public onlyInspector {
            inspectionPassed= _passed;
        }

        

        function approveSale() public {
            approval[msg.sender]= true;
        }

        function getBalance() public view returns (uint) {
            return address(this).balance;
        }

    function finalizeSale() public {
        //Transfer ownership of property
        require(inspectionPassed, "must pass inspection");
        require(approval[buyer], 'must be approved by buyer');
        require(approval[seller], 'must be approved by sender');
        require(approval[lender], 'must be approved by lender');
        require(address(this).balance >= purchasePrice, 'must have enough funds');
        
        (bool success, )= payable(seller).call{value: address(this).balance}("");
        require(success);
        IERC721(nftAddress).transferFrom(seller, buyer, nftID);
        
        }
    
}