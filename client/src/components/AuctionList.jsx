import React, { useEffect, useRef, useState } from "react";
import useEth from "../contexts/EthContext/useEth";
import Web3 from "web3";

function AuctionList() {
  const {
    state: { contract, accounts },
  } = useEth();
  const [itemArr, setItemArr] = useState([]);
  const [priceBid, setPriceBid] = useState(0);
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [priceStart, setPriceStart] = useState(0);
  const isInitialMount = useRef(true);

  const getAll = async () => {
    const result = await contract.methods.getAll().call({ from: accounts[0] });
    setItemArr(result);
    console.log(result);
    // console.log(contract);
    // console.log(window.ethereum.request);
  };

  const bid = async () => {
    // const newId = parseInt(id);
    // const newPrice = parseInt(price);
    const deposit = (priceBid / 5).toString();
    await contract.methods
      .bid(priceBid, id)
      .send({
        from: accounts[0],
        value: Web3.utils.toHex(Web3.utils.toWei(deposit, "ether")),
      })
      .then((receipt) => {
        console.log("Transaction receipt:", receipt);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    // await window.ethereum.request({
    // 	method: 'eth_sendTransaction',
    // 	params: [
    // 		{
    // 			from: accounts[0],
    // 			to: "0xEa998fB4fa1F361f7aB6eF7506C495bF1C2BF380",
    // 			value: "0xDE0B6B3A7640000"
    // 		},
    // 	],
    // }).then((txHash) => console.log(txHash)).catch((error) => console.error(error));
    // Web3.eth.sendTransaction({from: accounts[0],to: "0xEa998fB4fa1F361f7aB6eF7506C495bF1C2BF380", value: Web3.utils.toWei("1", "ether")})
  };

  const addItem = async () => {
    await contract.methods
      .addItem(name, content, priceStart, 0)
      .send({
        from: accounts[0],
      })
      .then((receipt) => {
        console.log("Transaction receipt:", receipt);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      getAll();
      const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
      web3.eth.getBalance(contract._address).then((result) => {
        // console.log(contract._address)
        console.log(result);
      });
    }
  }, [accounts]);

  return (
    <>
      <div className="container">
        <h3 className="p-3 text-center">Active Auctions</h3>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>content</th>
              <th>bidder</th>
              <th>price</th>
            </tr>
          </thead>
          <tbody>
            {itemArr &&
              itemArr
                .filter((item) => item.status === "0")
                .map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.content}</td>
                    <td>{item.bidder}</td>
                    <td>{item.price}</td>
                  </tr>
                ))}
          </tbody>
        </table>

        <form onSubmit={bid}>
          <div className="row">
            <div className="col">
              <input
                type="number"
                className="form-control"
                placeholder="Please input the id"
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                }}
              />
            </div>
            <div className="col">
              <input
                type="number"
                className="form-control"
                placeholder="Please input the price you want to bid"
                value={priceBid}
                onChange={(e) => {
                  setPriceBid(e.target.value);
                }}
              />
            </div>
            <div className="col">
              <input type="submit" className="btn btn-primary" />
            </div>
          </div>
        </form>
        <hr />
        <h3 className="p-3 text-center">Auctions wait for final payment</h3>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>content</th>
              <th>bidder</th>
              <th>price</th>
            </tr>
          </thead>
          <tbody>
            {itemArr &&
              itemArr
                .filter((item) => item.status === "1")
                .map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.content}</td>
                    <td>{item.bidder}</td>
                    <td>{item.price}</td>
                  </tr>
                ))}
          </tbody>
        </table>
        <hr />
        <h3 className="p-3 text-center">Closed Auctions</h3>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>content</th>
              <th>bidder</th>
              <th>price</th>
            </tr>
          </thead>
          <tbody>
            {itemArr &&
              itemArr
                .filter((item) => item.status === "2")
                .map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.content}</td>
                    <td>{item.bidder}</td>
                    <td>{item.price}</td>
                  </tr>
                ))}
          </tbody>
        </table>
        <hr />
        <h3 className="p-3 text-center">Create Auction</h3>
        <form onSubmit={addItem}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Name of the new item"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Content of the new item"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Please input the price you want to bid"
              value={priceStart}
              onChange={(e) => {
                setPriceStart(e.target.value);
              }}
            />
          </div>
          <input type="submit" className="btn btn-primary" />
        </form>
      </div>
    </>
  );
}

export default AuctionList;
