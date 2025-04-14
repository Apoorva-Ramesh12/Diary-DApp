// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Diary {
    struct Entry {
        uint timestamp;
        string content;
    }

    mapping(address => Entry[]) public userEntries;

    event EntryAdded(address indexed user, uint timestamp, string content);

    function addEntry(string memory _content) public {
        require(bytes(_content).length > 0, "Entry content cannot be empty.");
        userEntries[msg.sender].push(Entry(block.timestamp, _content));
        emit EntryAdded(msg.sender, block.timestamp, _content);
    }
    function getMyEntries() public view returns (Entry[] memory) {
        return userEntries[msg.sender];
    }
}