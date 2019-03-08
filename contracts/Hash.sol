pragma solidity ^0.4.25;
contract Hash {
  string ipfsHash;
 
  function setHash(string memory x) public {
    ipfsHash = x;
  }

  function getHash() public view returns (string memory x) {
    return ipfsHash;
  }
}