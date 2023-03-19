import React, { useEffect, useRef, useState } from 'react'
import useEth from "../contexts/EthContext/useEth";

function AuctionList() {
	const { state: { contract, accounts } } = useEth();
	const [itemArr, setItemArr] = useState([])
	const isInitialMount = useRef(true);
	const getAll = async () => {
		const value = await contract.methods.getAll().call({ from: accounts[0] });
		console.log(value)
	};
	useEffect(() => {
		if (isInitialMount.current) {
		   isInitialMount.current = false;
		} else {
			getAll()
		}
	});


	return (
		<>
		<button onClick={getAll}>Get all item with status 0</button>
		</>
  	)
}

export default AuctionList;
