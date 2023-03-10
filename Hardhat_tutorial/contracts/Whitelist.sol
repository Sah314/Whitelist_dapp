//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Whitelist {
    uint8 public maxWhitelistedAddresses;
    mapping (address=>bool) public whitelistedAddresses;
    uint8 public numAddressesWhitelisted=0;
    constructor(uint8 _maxWhitelistedAddresses){
        maxWhitelistedAddresses=_maxWhitelistedAddresses;
    }
    function addAddressToWhitelist() public {
        require(!whitelistedAddresses[msg.sender],"User is already whitelisted!!");
        require(numAddressesWhitelisted<maxWhitelistedAddresses,"Max limit reached!!");
        whitelistedAddresses[msg.sender]= true;
        numAddressesWhitelisted+=1;
    }
}