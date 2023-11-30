import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigation } from "react-router-dom";
import logo from "../assets/Logo.png";

export default function (props) {
	const navigation = useNavigation();
	const { isLoading } = useSelector(state => state.isLoading);
	const elementRef = useRef(null);
	const [elementHeight, setElementHeight] = useState(0);

	useEffect(() => {
		const getElementHeight = () => {
			if (elementRef.current) {
				const height = elementRef.current.offsetHeight;
				setElementHeight(height);
			}
		};
		getElementHeight();
		window.addEventListener("resize", getElementHeight);
		return () => {
			window.removeEventListener("resize", getElementHeight);
		};
	}, []);

	return (
		<>
			<nav
				className="navbar navbar-expand-md navbar-dark fixed-top bg-dark px-3"
				ref={elementRef}>
				<Link className="navbar-brand" to="/">
					<img alt="/" style={{ height: 40 }} src={logo} />
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-toggle="collapse"
					data-target="#navbarsExampleDefault"
					aria-controls="navbarsExampleDefault"
					aria-expanded="false"
					aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>

				{/* <div className="collapse navbar-collapse" id="navbarsExampleDefault">
          <ul className="navbar-nav me-auto">
            <li className="nav-item active">
              <Link className="nav-link" to="/stock-analize">Stock Analize</Link>
            </li>
          </ul>
        </div> */}
			</nav>
			{(navigation.state !== "idle" || isLoading) && (
				<div className="loader-line" style={{ top: elementHeight }}></div>
			)}
		</>
	);
}
