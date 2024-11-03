import React, { useState } from "react";
import "../login/login.css";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setLoading] = useState(null)


	const navigate = useNavigate();

	const submitHandler = (e) => {
		e.preventDefault();
		setLoading(true)
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const user = userCredential.user;
				localStorage.setItem('cName' , user.displayName)
				localStorage.setItem('photoURL' , user.photoURL)
				localStorage.setItem("email", user.email);
				localStorage.setItem('uid', user.uid)
				setLoading(false)
				navigate("/dashboard");
			})
			.catch((error) => {
				console.log(error)
				setLoading(false)
			});
	};

	return (
		<div className="login_wrapper">
			<div className="login_container">
				<div className="login_boxes login_left"></div>
				<div className="login_boxes login_right">
					<h2 className="login_heading ">Login</h2>
					<form onSubmit={submitHandler}>
						<input required
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							className="login_input"
							type="text"
							placeholder="Email"
						/>
						<input required
							onChange={(e) => {
								setPassword(e.target.value);
							}}
							className="login_input"
							type="password"
							placeholder="password"
						/>
						<button className="login_input submit_btn" type="submit">{isLoading &&     <i className="fas fa-spinner fa-pulse"></i>
						}Submit</button>
					</form>
					<Link to="/register" className="register_link">
						Don't have an account? Register
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
