import React, { useState } from "react";
import { db } from '../../firebase';
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const NewEntries = () => {
	const [to, setTo] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [qty, setQty] = useState(1);
	const [isLoading, setLoading] = useState(false);
	const [product, setProduct] = useState([]);
	
	const navigation = useNavigate();

	const addProduct = () => {
		const numericPrice = parseFloat(price);
		const numericQty = parseInt(qty, 10);
		if (!isNaN(numericPrice) && !isNaN(numericQty) && numericQty > 0) {
			setProduct([...product, { id: product.length, name, price: numericPrice, qty: numericQty }]);
			setName("");
			setPrice("");
			setQty(1);
		} else {
			alert("Please enter valid price and quantity.");
		}
	};

	const saveData = async () => {
		setLoading(true);
		const total = product.reduce((acc, item) => acc + (item.price * item.qty), 0);
		const data = await addDoc(collection(db, 'invoices'), {
			to,
			phone,
			address,
			product,
			total,
			uid: localStorage.getItem('uid'),
			date: Timestamp.fromDate(new Date())
		});
		console.log(data);
		navigation('/dashboard/inventory');
		setLoading(false);
	};

	const totalCost = product.reduce((acc, item) => acc + (item.price * item.qty), 0);

	return (
		<div>
			<div className="header_row">
				<p className="new_entrie_heading">New Entry</p>
				<button onClick={saveData} className="add_btn" type="button">
					{isLoading && <i style={{ fontSize: 15 }} className="fas fa-spinner fa-pulse"></i>}
					<i className="fa-solid fa-floppy-disk"></i> Save
				</button>
			</div>
			<form className="new_entrie_form">
				<div className="first_row">
					<input onChange={(e) => setTo(e.target.value)} placeholder="To" value={to} />
					<input onChange={(e) => setPhone(e.target.value)} placeholder="Phone" value={phone} />
					<input onChange={(e) => setAddress(e.target.value)} placeholder="Address" value={address} />
				</div>

				<div className="first_row">
					<input onChange={(e) => setName(e.target.value)} placeholder="Product Name" value={name} />
					<input type="number" onChange={(e) => setPrice(e.target.value)} placeholder="Price" value={price} />
					<input type="number" onChange={(e) => setQty(e.target.value)} placeholder="Quantity" value={qty} />
				</div>
				<button onClick={addProduct} className="add_btn" type="button">
					<i className="fa-solid fa-cart-plus"></i> Add Product
				</button>
			</form>

			{product.length > 0 && (
				<div className="product_wrapper">
					<div className="product_list">
						<p>S No.</p>
						<p>Product Name</p>
						<p>Price</p>
						<p>Quantity</p>
						<p>Total Price</p>
					</div>
					{product.map((data, index) => (
						<div className="product_list" key={index}>
							<p>{index + 1}</p>
							<p>{data.name}</p>
							<p>Rs.{data.price.toFixed(2)}</p>
							<p>{data.qty}</p>
							<p>Rs.{(data.qty * data.price).toFixed(2)}</p>
						</div>
					))}
					<div className="total_wrapper">
						<p>Total: Rs.{totalCost.toFixed(2)}</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default NewEntries;
