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
        address payable owner;
        address payable bidder;
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
            payable(msg.sender),
            payable(msg.sender)
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

    function sendEther(address payable _to, uint amount) external payable {
        _to.transfer(amount);
    }

    function bid(uint id) public payable returns (uint) {
        this.sendEther(itemMap[id].bidder, itemMap[id].price / 5);
        itemMap[id].price = msg.value * 5;
        itemMap[id].bidder = payable(msg.sender);
        return msg.value;
    }

    function end(uint id) public returns (uint) {
        itemMap[id].status = 1;
        return id;
    }

    function payment(uint id) public payable returns (uint) {
        this.sendEther(itemMap[id].owner, itemMap[id].price);
        itemMap[id].owner = payable(msg.sender);
        itemMap[id].status = 2;
        return msg.value;
    }
}
