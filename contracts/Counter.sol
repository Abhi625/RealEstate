//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract Counter {
    string public name;
    uint256 public count;

    constructor(string memory _name, uint256 _Initialcount)
    {
        name= _name;
        count= _Initialcount;
    } 

    function increment() public returns (uint256 newCount)
    {
        count++;
        return count;
    }

    function decrement() public returns (uint256 newCount)
    {
        count--;
        return count;
    }

    function getCount() public view returns (uint256)
    {
        return count;
    }
    
    function setName(string memory _newName) public returns (string memory newName)
    {
        name= _newName;
        return name;
    }

    function getName() public view returns (string memory)
    {
        return name;
    }

}