import React, { useEffect, useRef, useState } from 'react'
import useEth from "../contexts/EthContext/useEth";

function AuctionList() {
	const { state: { contract, accounts } } = useEth();
	const [itemArr, setItemArr] = useState([]);
	const [price, setPrice] = useState(0);
	const [id, setId] = useState(0)
	const isInitialMount = useRef(true);

	const getAll = async () => {
		const result = await contract.methods.getAll().call({ from: accounts[0] });
		setItemArr(result);
		console.log(result);
		console.log(accounts);
	};

	const bid = async () => {
		const newId = parseInt(id);
		const newPrice = parseInt(price)
		await contract.methods.bid(newPrice, newId).send({ from: accounts[0] });
	};

	useEffect(() => {
		if (isInitialMount.current) {
		   isInitialMount.current = false;
		} else {
			getAll();
		}
	},[accounts]);


	return (
		<>
		<div className="container">
            <h3 className="p-3 text-center">Current Auctions</h3>
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
                    {itemArr && itemArr.map(item =>
                        <tr key={item.id}>
							<td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.content}</td>
							<td>{item.bidder}</td>
                            <td>{item.price}</td>
                        </tr>
                    )}
                </tbody>
            </table>
			<form onSubmit={bid}>
				<input type="number" value={id} onChange={(e) => {setId(e.target.value)}} />
				<input type="number" value={price} onChange={(e) => {setPrice(e.target.value)}}/>
				<input type="submit"/>
			</form>
        </div>
		</>
  	)
}

export default AuctionList;
