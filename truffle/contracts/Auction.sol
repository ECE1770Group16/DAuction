// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Auction {
    event Log(uint amount, uint gas);

    receive() external payable {
        emit Log(msg.value, gasleft());
    }

    struct Item {
        uint id;
        string name;
        string content;
        uint status;
        uint price;
        address owner;
        address bidder;
    }

    constructor() {
        // addItem("item1", "This is the first item", 0, 0);
        // addItem("item2", "This is the second item", 0, 0);
        // addItem("item3", "This is the third item", 0, 0);
        // addItem("item4", "This is the item in status 1", 5, 1);
        // addItem("item5", "This is teh item in status 2", 10, 2);
    }

    uint public idCount;
    mapping(uint => Item) public itemMap;

    function addItem(
        string memory name,
        string memory content,
        uint price,
        uint status
    ) public returns (uint) {
        itemMap[idCount] = Item(
            idCount,
            name,
            content,
            status,
            price,
            msg.sender,
            msg.sender
        );
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

    function bid(uint price, uint id) public payable returns (uint) {
        itemMap[id].price = price;
        itemMap[id].bidder = msg.sender;
        return msg.value;
    }
}
