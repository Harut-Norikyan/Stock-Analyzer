import React, { useState, useEffect } from "react";
import Header from "./Components/Header";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { setIsLoading } from "./redux/actions/itemActions";
import { useTranslation, Trans } from "react-i18next";
import Api from "./Api";
import Footer from "./Components/Footer";

const languages = ["ru", "en"];
export default function App() {
	const { t, i18n } = useTranslation();
	const dispatch = useDispatch();
	const [isShowWaitingModal, setIsShowWaitingModal] = useState(false);
	const navigate = useNavigate();
	const { lang } = useParams();
	const defaultLeng = "ru";
	const { pathname } = useLocation();
	useEffect(() => {
		const language = localStorage.getItem("i18nextLng");
		if (!language) {
			i18n.changeLanguage(defaultLeng);
			const path = pathname.split("/").slice(2).join("/");

			// localStorage.setItem("i18nextLng", defaultLeng);
			navigate(`/${defaultLeng}/${path}`);
		}
	}, [navigate]);
	useEffect(() => {
		if (!languages.includes(lang)) {
			const language = localStorage.getItem("i18nextLng");
			const path = pathname.split("/").slice(2).join("/");

			i18n.changeLanguage(language);
			navigate(`/${defaultLeng}/${path}`);
		}
	}, [lang]);
	useEffect(() => {
		checkUserAuth();
	}, []);

	const checkUserAuth = async () => {
		try {
			setIsShowWaitingModal(true);
			dispatch(setIsLoading(true));
			const response = await Api.checkUserIsAuth();
			if (typeof response.data === "boolean" || !response.data) {
				if (!response.data)
					window.open(
						"https://auth.stockanalyzer.online",
						"",
						`width=${500},height=${700}`,
					);
				else {
					setIsShowWaitingModal(false);
				}
			}
		} catch (error) {
			console.error(error);
		} finally {
			dispatch(setIsLoading(false));
		}
	};
	return (
		<div className="d-flex flex-column justify-content-between gap-4">
			<div className="container-xxl h-full ">
				<Modal show={isShowWaitingModal} centered>
					<Modal.Header closeButton={false}>
						<Modal.Title>Please wait</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div>
							<b className="d-block text-center">
								We are checking your authentication
							</b>
						</div>
						<div className="d-flex justify-content-center my-4">
							<div className="spinner-border text-primary" role="status" />
						</div>
					</Modal.Body>
					<Modal.Footer>
						<button
							className="btn btn-primary px-4"
							onClick={() => window.location.reload()}>
							Reload this page
						</button>
					</Modal.Footer>
				</Modal>
				<Header />
				<Outlet />
			</div>
			<Footer />
		</div>
	);
}
