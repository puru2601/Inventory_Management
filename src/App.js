import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Dashboard from "./components/dashboard/Dashboard";
import Home from "./components/dashboard/Home";
import Inventory from "./components/dashboard/Inventory";
import NewEntries from "./components/dashboard/NewEntries";
import Setting from "./components/dashboard/Setting";
import InvoiceDetails from "./components/dashboard/InvoiceDetails";

function App() {
	const myRouter = createBrowserRouter([
		{ path: "", Component: Login },
		{ path: "/login", Component: Login },
		{ path: "/register", Component: Register },
		{
			path: "/dashboard",
			Component: Dashboard,
			children: [
        { path: "", Component: Home },
				{ path: "home", Component: Home },
				{ path: "inventory", Component: Inventory },
				{ path: "newEntries", Component: NewEntries },
				{ path: "setting", Component: Setting },
				{ path: "invoice-detail", Component: InvoiceDetails },

			],
		},
	]);

	return (
		<div>
			<RouterProvider router={myRouter}></RouterProvider>
		</div>
	);
}

export default App;
