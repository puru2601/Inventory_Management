import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
	const [invoices, setInvoices] = useState([]);
	const [isLoading, setLoading] = useState(null);

	const navigate = useNavigate();
	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		setLoading(true)
		const q = query(
			collection(db, "invoices"),
			where("uid", "==", localStorage.getItem("uid"))
		);
		const querySnapshot = await getDocs(q);
		const data = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		// console.log(data);
		setInvoices(data);
		setLoading(false)
	};

	const deleteInvoice = async (id) => {
		const isSure = window.confirm("are you sure want to delete");
		if (isSure) {
			try {
				await deleteDoc(doc(db, "invoices", id));
				getData();
			} catch {
				window.alert("something went wrong");
			}
		}
	};

	return (
		<div>
			{isLoading ? 
				<div
					style={{
						display: "flex",
						height: "100vh",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<i style={{ fontSize: 30 }} className="fas fa-spinner fa-pulse"></i>
				</div>
			 : 
			 <div>
			 {
				invoices.map((data) => (
					<div className="box" key={data.id}>
						<p>{data.to}</p>
						<p>{new Date(data.date.seconds * 1000).toLocaleDateString()}</p>
						<p>Rs. {data.total}</p>
						<button
							onClick={() => {
								deleteInvoice(data.id);
							}}
							className="delete_btn"
						>
							<i className="fa-solid fa-trash"></i>Delete
						</button>
						<button
							onClick={() => {
								navigate("/dashboard/invoice-detail", { state: data });
							}}
							className="delete_btn view_btn"
						>
							<i className="fa-solid fa-eye"></i>View
						</button>
					</div>
				))
			}
			{invoices.length < 1 && 
				<div className="empty_invoice_wrapper">
				 <p>sorry! you have no invoices till now....</p>
				 <button onClick={()=>{navigate('/dashboard/newEntries')}}>Create New Invoice</button>
				</div>
			}

				</div>
			}
		</div>
	);
};

export default Inventory;
