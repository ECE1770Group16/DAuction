// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Auction {
    struct Item {
        uint id;
        string name;
        string content;
        uint status;
        uint price;
        address owner;
        address bidder;
    }

    constructor () {
        addItem("item1", "This is the first item", 0);
        addItem("item2", "This is the second item", 0);
        addItem("item3", "This is the third item", 0);
    }

    uint public idCount;
    mapping(uint => Item) public itemMap;

    function addItem(string memory name, string memory content, uint price) public returns (uint) {
        itemMap[idCount] = Item(idCount, name, content, 1, price, 0x777A97E3dA0583ABEdd43e7C8f1Dc547d0129B63, 0x777A97E3dA0583ABEdd43e7C8f1Dc547d0129B63);
        ++idCount;
        return idCount;
    }

    function getAll() public view returns (Item[] memory) {
        Item[] memory itemArr = new Item[](idCount);
        for (uint i = 0; i < idCount; i++) {
            itemArr[i] = itemMap[i];
        }
        return itemArr;
    }
}