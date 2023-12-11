import React from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import OneInstrumentAnalyze from "../assets/OneInstrumentAnalyze.png";
import OneInstrumentNotification from "../assets/OneInstrumentNotification.png";
import PriceChangeNotification from "../assets/PriceChangeNotification.png";
import TwoInstrumentAnalyzes from "../assets/TwoInstrumentAnalyzes.png";
import TwoInstrumentNotification from "../assets/TwoInstrumentNotification.png";
import { newPath } from "../helper";
import { useTranslation } from "react-i18next";

export default function Home(props) {
	const { t } = useTranslation();
	return (
		<div>
			<main role="main pb-4">
				<Row style={{ paddingTop: 80 }}>
					<Col lg={6} className="h-100 my-2">
						<div
							className=" w-100 rounded p-2"
							style={{
								backgroundImage: `url(${OneInstrumentAnalyze})`,
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "center",
								height: "400px",
							}}>
							<div className="container-xxl d-flex flex-column justify-content-end align-items-center h-100">
								<Link
									style={{
										backgroundColor: " rgba(203, 202, 203, 0.50)",
										fontWeight: 800,
									}}
									className="btn btn-outline-dark btn-lg m-1"
									to={newPath("/one-instrument-analizer")}
									role="button">
									{t("oneInstrumentAnalizerLink")}
								</Link>
							</div>
						</div>
					</Col>
					<Col lg={6} className="h-100 my-2">
						<div
							className=" w-100 rounded p-2"
							style={{
								backgroundImage: `url(${TwoInstrumentAnalyzes})`,
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								height: "400px",
							}}>
							<div className="container-xxl d-flex flex-column justify-content-end align-items-center h-100">
								<Link
									style={{
										backgroundColor: " rgba(203, 202, 203, 0.50)",
										fontWeight: 800,
									}}
									className="btn btn-outline-dark btn-lg m-1"
									to={newPath("/two-instruments-analizer")}
									role="button">
									{t("twoInstrumentsAnalizerLink")}
								</Link>
							</div>
						</div>
					</Col>
					<Col lg={6} className="h-100 my-2">
						<div
							className=" w-100 rounded p-2"
							style={{
								backgroundImage: `url(${OneInstrumentNotification})`,
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								height: "400px",
							}}>
							<div className="container-xxl d-flex flex-column justify-content-end align-items-center h-100">
								<Link
									style={{
										backgroundColor: " rgba(203, 202, 203, 0.50)",
										fontWeight: 800,
									}}
									className="btn btn-outline-dark btn-lg m-1"
									to={newPath("/notify-for-one-instrument")}
									role="button">
									{t("notifyForOneInstrumentLink")}
								</Link>
							</div>
						</div>
					</Col>
					<Col lg={6} className="h-100 my-2">
						<div
							className=" w-100 rounded p-2"
							style={{
								backgroundImage: `url(${TwoInstrumentNotification})`,
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								height: "400px",
							}}>
							<div className="container-xxl d-flex flex-column justify-content-end align-items-center h-100">
								<Link
									style={{
										backgroundColor: " rgba(203, 202, 203, 0.50)",
										fontWeight: 800,
									}}
									className="btn btn-outline-dark btn-lg m-1"
									to={newPath("/notify-for-two-instruments")}
									role="button">
									{t("notifyForTwoInstrumentsLink")}
								</Link>
							</div>
						</div>
					</Col>
					<Col lg={6} className="h-100 my-2">
						<div
							className=" w-100 rounded p-2"
							style={{
								backgroundImage: `url(${PriceChangeNotification})`,
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								height: "400px",
							}}>
							<div className="container-xxl d-flex flex-column justify-content-end align-items-center h-100">
								<Link
									style={{
										backgroundColor: " rgba(203, 202, 203, 0.50)",
										fontWeight: 800,
									}}
									className="btn btn-outline-dark bgcolor btn-lg m-1"
									to={newPath("/notify-for-price")}
									role="button">
									{t("notifyForPriceLink")}
								</Link>
								{/* <Link
										className="btn btn-primary btn-lg m-1"
										to="/two-instruments-analizer"
										role="button">
										Two Instruments Analizer »
									</Link> */}
							</div>
						</div>
					</Col>
				</Row>
			</main>
		</div>
	);
}
