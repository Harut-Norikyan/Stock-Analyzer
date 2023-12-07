import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useNavigation, useParams } from "react-router-dom";
import logo from "../assets/Logo.png";
import { Dropdown } from "react-bootstrap";
import { Ru, Uk } from "../assets";
import { newPath } from "../helper";
import { useTranslation } from "react-i18next";

export default function Header(props) {
	const { i18n } = useTranslation();
	const navigation = useNavigation();
	const { isLoading } = useSelector(state => state.isLoading);
	const elementRef = useRef(null);
	const navigate = useNavigate();
	const { lang } = useParams();
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
				style={{
					height: "55px",
				}}
				ref={elementRef}>
				<div className="container d-flex justify-content-between align-items-center text-white py-1 flex-wrap">
					<Link className="navbar-brand" to={`/${lang}`}>
						<img alt="/" style={{ height: 40 }} src={logo} />
					</Link>
					{/* <button
						className="navbar-toggler"
						type="button"
						data-toggle="collapse"
						data-target="#navbarsExampleDefault"
						aria-controls="navbarsExampleDefault"
						aria-expanded="false"
						aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button> */}
					<Dropdown>
						<Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
							{lang === "ru" ? (
								<Ru style={{ height: 20, width: 20 }} />
							) : (
								<Uk style={{ height: 20, width: 20 }} />
							)}
						</Dropdown.Toggle>

						<Dropdown.Menu style={{ minWidth: "100%" }}>
							{lang === "ru" ? (
								<Dropdown.Item
									onClick={() => {
										i18n.changeLanguage("en");
										navigate(newPath("", "en"));
									}}>
									<Uk style={{ height: 20, width: 20 }} />
								</Dropdown.Item>
							) : (
								<Dropdown.Item
									onClick={() => {
										i18n.changeLanguage("ru");
										navigate(newPath("", "ru"));
									}}>
									<Ru style={{ height: 20, width: 20 }} />
								</Dropdown.Item>
							)}
						</Dropdown.Menu>
					</Dropdown>
				</div>
			</nav>
			{(navigation.state !== "idle" || isLoading) && (
				<div className="loader-line" style={{ top: elementHeight }}></div>
			)}
		</>
	);
}
