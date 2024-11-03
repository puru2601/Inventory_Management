import React from "react";
import "../../components/dashboard/dashboard.css";

import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { Link, useNavigate, Outlet } from "react-router-dom";



const Dashboard = () => {
	const navigate = useNavigate()
	const logout = ()=>{
		signOut(auth).then(() => {
			localStorage.clear()
			navigate('/login')
		}).catch((error) => {
			console.log(error)
		})
	}
	return (
		<div className="dashboard_wrapper">
			<div className="dashboard_left">
				<div className="profile_info">
					<img src={localStorage.getItem("photoURL")} alt="" />

					<div>
						<p>{localStorage.getItem("cName")}</p>
						<button onClick={logout}><i className="fa-solid fa-power-off"></i>Logout</button>
					</div>
				</div>
        <hr />
        <div className="menu">
        <Link  to='/dashboard/Home' className="menu_link"><i className="fa-solid fa-house"></i>Home</Link>
        <Link to='/dashboard/inventory' className="menu_link"><i className="fa-solid fa-file-invoice"></i>Inventory</Link>
        <Link to='/dashboard/newEntries' className="menu_link"><i className="fa-solid fa-file-circle-plus"></i>New Entries</Link>
        <Link to='/dashboard/setting' className="menu_link"><i className="fa-solid fa-gear"></i>Settings</Link>
        </div>
			</div>
			<div className="main_container">
      <Outlet/>
      </div>
		</div>
	);
};

export default Dashboard;
