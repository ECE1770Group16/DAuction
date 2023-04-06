import React, { useEffect, useRef, useState } from "react";
import useEth from "../contexts/EthContext/useEth";
import Web3 from "web3";

function AuctionList() {
  const {
    state: { contract, accounts },
  } = useEth();
  const [itemArr, setItemArr] = useState([]);
  const [price, setPrice] = useState(0);
  const [id, setId] = useState(0);
  const isInitialMount = useRef(true);

  const getAll = async () => {
    const result = await contract.methods.getAll().call({ from: accounts[0] });
    setItemArr(result);
    console.log(result);
    // console.log(contract);
    // console.log(window.ethereum.request);
  };

  const bid = async () => {
    const newId = parseInt(id);
    const newPrice = parseInt(price);
    const deposit = (newPrice / 5).toString();
    await contract.methods
      .bid(newPrice, newId)
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
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
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
      </div>
    </>
  );
}

export default AuctionList;
