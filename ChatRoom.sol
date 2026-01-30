// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ChatRoom {
    struct Message {
        address sender;
        string message;
        uint256 timestamp;
    }

    Message[] public messages;

    function sendMessage(string calldata message) external {
        require(bytes(message).length > 0, "Empty message");
        require(bytes(message).length <= 280, "Message too long");
        messages.push(Message(msg.sender, message, block.timestamp));
    }

    function getMessages() external view returns (Message[] memory) {
        return messages;
    }
}
