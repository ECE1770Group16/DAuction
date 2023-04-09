import React, { useEffect, useState } from "react";
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
  const [endId, setEndId] = useState(0);
  const [paymentId, setPaymentId] = useState(0);

  // const isInitialMount = useRef(true);

  const etherToWei = (value) => {
    return Web3.utils.toHex(Web3.utils.toWei(value, "ether"));
  };

  const weiToEther = (value) => {
    return Web3.utils.fromWei(value, "ether");
  };

  const getAll = async () => {
    const result = await contract.methods.getAll().call({ from: accounts[0] });
    setItemArr(result);
    console.log(result);
    // console.log(contract);
    // console.log(window.ethereum.request);
  };

  const bid = async (event) => {
    event.preventDefault();
    const priceBidWei = etherToWei(priceBid);
    if (itemArr[id]["status"] === "0") {
      if (priceBidWei > parseInt(itemArr[id]["price"])) {
        const deposit = (priceBidWei / 5).toString();
        await contract.methods
          .bid(id)
          .send({
            from: accounts[0],
            value: deposit,
          })
          .then((receipt) => {
            console.log("Transaction receipt:", receipt);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        alert("Bidding must be higher than current price");
      }
    } else {
      alert("You can only bid on active auctions");
    }
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

  const addItem = async (event) => {
    event.preventDefault();
    console.log("add item triggered");
    await contract.methods
      .addItem(name, content, etherToWei(priceStart.toString()), 0)
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

  const end = async (event) => {
    event.preventDefault();
    if (itemArr[endId]["status"] === "0") {
      if (itemArr[endId]["owner"] === accounts[0]) {
        await contract.methods
          .end(endId)
          .send({
            from: accounts[0],
          })
          .then((receipt) => {
            console.log("Transaction receipt:", receipt);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        alert("Only the owner can end the auction");
      }
    } else {
      alert("Only active auctions can be ended");
    }
  };

  const payment = async (event) => {
    event.preventDefault();
    if (itemArr[paymentId]["status"] === "1") {
      if (itemArr[paymentId]["bidder"] === accounts[0]) {
        await contract.methods
          .payment(paymentId)
          .send({
            from: accounts[0],
            value: parseInt(itemArr[paymentId]["price"] * 0.8).toString(),
          })
          .then((receipt) => {
            console.log("Transaction receipt:", receipt);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        alert("Only the last bidder can pay the final payment");
      }
    } else {
      alert("Only auctions awaiting final payment can be paid");
    }
  };

  useEffect(() => {
    // if (isInitialMount.current) {
    //   isInitialMount.current = false;
    // } else {
    //   getAll();
    //   const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
    //   web3.eth.getBalance(contract._address).then((result) => {
    //     // console.log(contract._address)
    //     console.log(result);
    //   });
    // }
    if (contract != null) {
      getAll();
      const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
      web3.eth.getBalance(contract._address).then((result) => {
        // console.log(contract._address)
        console.log(result);
      });
    }
  }, [contract, accounts]);

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
              <th>owner</th>
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
                    <td>
                      {item.owner
                        .slice(0, 5)
                        .concat("...", item.owner.slice(-4))}
                    </td>
                    <td>
                      {item.bidder
                        .slice(0, 5)
                        .concat("...", item.bidder.slice(-4))}
                    </td>
                    <td>{weiToEther(item.price).concat(" ETH")}</td>
                  </tr>
                ))}
          </tbody>
        </table>

        <form onSubmit={bid} className="mb-3">
          <div className="row">
            <div className="col">
              <input
                type="number"
                className="form-control"
                placeholder="Auction ID"
                onChange={(e) => {
                  setId(e.target.value);
                }}
              />
            </div>
            <div className="col">
              <input
                className="form-control"
                placeholder="Bid Price"
                onChange={(e) => {
                  setPriceBid(e.target.value);
                }}
              />
            </div>
            <div className="col">
              <input type="submit" className="btn btn-primary" value="BID" />
            </div>
          </div>
        </form>

        <form onSubmit={end}>
          <div className="row">
            <div className="col">
              <input
                type="number"
                className="form-control"
                placeholder="Auction ID"
                onChange={(e) => {
                  setEndId(e.target.value);
                }}
              />
            </div>
            <div className="col">
              <input type="submit" className="btn btn-primary" value="END" />
            </div>
          </div>
        </form>

        <hr />
        <h3 className="p-3 text-center">Auctions awaiting final payment</h3>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>content</th>
              <th>owner</th>
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
                    <td>
                      {item.owner
                        .slice(0, 5)
                        .concat("...", item.owner.slice(-4))}
                    </td>
                    <td>
                      {item.bidder
                        .slice(0, 5)
                        .concat("...", item.bidder.slice(-4))}
                    </td>
                    <td>{weiToEther(item.price).concat(" ETH")}</td>
                  </tr>
                ))}
          </tbody>
        </table>
        <form onSubmit={payment}>
          <div className="row">
            <div className="col">
              <input
                type="number"
                className="form-control"
                placeholder="Auction ID"
                onChange={(e) => {
                  setPaymentId(e.target.value);
                }}
              />
            </div>
            <div className="col">
              <input type="submit" className="btn btn-primary" value="PAY" />
            </div>
          </div>
        </form>
        <hr />
        <h3 className="p-3 text-center">Closed Auctions</h3>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>content</th>
              <th>owner</th>
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
                    <td>
                      {item.owner
                        .slice(0, 5)
                        .concat("...", item.owner.slice(-4))}
                    </td>
                    <td>
                      {item.bidder
                        .slice(0, 5)
                        .concat("...", item.bidder.slice(-4))}
                    </td>
                    <td>{weiToEther(item.price).concat(" ETH")}</td>
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
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Starting price of the new item"
              onChange={(e) => {
                setPriceStart(e.target.value);
              }}
            />
          </div>
          <input type="submit" className="btn btn-primary" value="CREATE" />
        </form>
      </div>
    </>
  );
}

export default AuctionList;
