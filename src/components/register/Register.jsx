import React, { useRef, useState } from "react";
import "../login/login.css";
import { Link, useNavigate } from "react-router-dom";
import { auth, storage, db } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
	const fileInputRef = useRef(null);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [file, setFile] = useState(null);
	const [displayName, setDisplayName] = useState("");
	const [imageUrl, setImageUrl] = useState(null)
	const [isLoading, setLoading] = useState(null)

	const navigate = useNavigate();

	const onSelectFile = (e)=>{
		setFile(e.target.files[0])
		setImageUrl(URL.createObjectURL(e.target.files[0]))
	}

	const submitHandler = (e) => {
		e.preventDefault();
		setLoading(true)
		console.log(email, password);

		createUserWithEmailAndPassword(auth, email, password)
			.then((newUser) => {
				console.log(newUser);
				const date = new Date().getTime();
				const storageRef = ref(storage, `${displayName + date}`);
				uploadBytesResumable(storageRef, file).then((res) => {
					console.log(res);
					getDownloadURL(storageRef).then((downloadedUrl) => {
						console.log(downloadedUrl);
						updateProfile(newUser.user, {
							displayName: displayName,
							photoURL: downloadedUrl,
						});
						setDoc(doc(db, "users", newUser.user.uid), {
							uid: newUser.user.uid,
							displayName: displayName,
							email: email,
							photoURL: downloadedUrl,
						});
						navigate("/dashboard");
						setLoading(false)
						localStorage.setItem("cName", displayName);
						localStorage.setItem("photoURL", downloadedUrl);
						localStorage.setItem("email", newUser.user.email);
					});
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div className="login_wrapper">
			<div className="login_container">
				<div className="login_boxes login_left"></div>
				<div className="login_boxes login_right">
					<h2 className="login_heading ">Create New Account</h2>
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
						<input required
							onChange={(e) => {
								setDisplayName(e.target.value);
							}}
							className="login_input"
							type="text"
							placeholder=" company name"
						/>
						<input required
							onChange={
								(e)=>{onSelectFile(e)}
							}
							style={{ display: "none" }}
							className="login_input"
							type="file"
							ref={fileInputRef}
						/>
						<input required
							className="login_input"
							type="button"
							value="Select Your Logo"
							onClick={() => {
								fileInputRef.current.click();
							}}
						/>

						{imageUrl != null &&<img className="image_preview" src={imageUrl} alt="Preview" />}

						<button className="login_input submit_btn" type="submit">{isLoading &&     <i className ="fas fa-spinner fa-pulse"></i>
						}Submit</button>
					</form>
					<Link to="/login" className="register_link">
						Already have an account? Login
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Register;
