import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import Clock from "./Clock";

function Footer() {
	const { i18n } = useTranslation();
	const navigate = useNavigate();
	const { lang } = useParams();
	return (
		<footer className="footer d-flex justify-content-between align-items-center">
			<div className="container-xxl d-flex justify-content-between align-items-center text-white py-1 flex-wrap">
				<Clock />
			</div>
		</footer>
	);
}

export default Footer;
