import Chart from "chart.js/auto";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import {
	collection,
	getDocs,
	query,
	where,
} from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

const Home = () => {
	const [total, setTotal] = useState(0);
	const [invoices, setInvoices] = useState([]);
	// const [totalInvoice, setTotalInvoice] = useState(2451);
	const [totalMonthCollection, setTotalMonthCollection] = useState(0);
	const chartRef = useRef(null);
	const chartInstance = useRef(null);

	useEffect(() => {
		getData();

		return () => {
			// Cleanup the chart instance on unmount
			if (chartInstance.current) {
				chartInstance.current.destroy();
			}
		};
	}, []);

	const getData = async () => {
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
		getOverAllTotal(data);
		getMonthsTotal(data);
		monthWiseCollection(data);
	};

	const getOverAllTotal = (invoiceList) => {
		let total = 0;
	
		invoiceList.forEach((data) => {
			// Ensure that data.total is a valid number
			const invoiceTotal = parseFloat(data.total);
			if (!isNaN(invoiceTotal)) {
				total += invoiceTotal;
			}
		});
	
		setTotal(total);
	};
	
	const getMonthsTotal = (invoiceList) => {
		let mt = 0;
		invoiceList.forEach((data) => {
			// console.log(data)
			if (
				new Date(data.date.seconds * 1000).getMonth() === new Date().getMonth()
			) {
				mt += data.total;
			}
		});
		setTotalMonthCollection(mt);
	};

	const monthWiseCollection = (data) => {
		const chartData = {
			January: 0,
			February: 0,
			March: 0,
			April: 0,
			May: 0,
			June: 0,
			July: 0,
			August: 0,
			September: 0,
			October: 0,
			November: 0,
			December: 0,
		};
		data.forEach((d) => {
			if (
				new Date(d.date.seconds * 1000).getFullYear() ===
				new Date().getFullYear()
			) {
				// console.log("current year data", d)
				// console.log(new Date(d.date.seconds * 1000).toLocaleDateString('default', {month:'long'}))
				chartData[
					new Date(d.date.seconds * 1000).toLocaleDateString("default", {
						month: "long",
					})
				] += d.total;
			}
		});
		// console.log(chartData)
		createChart(chartData);
	};

	const createChart = (chartData) => {
		const ctx = chartRef.current.getContext("2d");

		// Destroy existing chart if it exists
		if (chartInstance.current) {
			chartInstance.current.destroy();
		}

		chartInstance.current = new Chart(ctx, {
			type: "bar",
			data: {
				labels: Object.keys(chartData),
				datasets: [
					{
						label: "# of Votes",
						data: Object.values(chartData),
						borderWidth: 1,
						backgroundColor: "rgba(21, 98, 221,)",
						borderColor: "rgba(75, 192, 192, 1)",
					},
				],
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
					},
				},
			},
		});
	};

	return (
		<div>
			<div className="home_first_row">
				<div className="home_box box_1">
					<h1 className="box_header">Rs. {total}</h1>
					<p className="box_title">Overall</p>
				</div>
				<div className="home_box box_2">
					<h1 className="box_header">{invoices.length}</h1>
					<p className="box_title">Invoices</p>
				</div>
				<div className="home_box box_3">
					<h1 className="box_header">{totalMonthCollection}</h1>
					<p className="box_title">This Month</p>
				</div>
			</div>

			<div className="home_second_row">
				<div className="chart_box">
					<canvas ref={chartRef}></canvas>
				</div>
				<div className="recent_invoice_list">
					<h1>recent invoice list</h1>
					<div>
						<p>Name</p>
						<p>Date</p>
						<p>Total</p>
					</div>

					{invoices.slice(0, 6).map((data) => (
						<div>
							<p>{data.to}</p>
							<p>{new Date(data.date.seconds * 1000).toLocaleDateString()}</p>
							<p>{data.total}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Home;
