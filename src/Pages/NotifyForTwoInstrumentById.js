import React, { useState } from "react";
import { Row, Col, Table, Card } from "react-bootstrap";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Api from "../Api";
import { newPath } from "../helper";

function Components(props) {
	const { t } = useTranslation();
	const data = useLoaderData();

	return (
		<section style={{ marginTop: "80px", marginBottom: "80px" }}>
			<Row>
				<Col lg={12}>
					<div className="mb-3">
						<div className="d-flex flex-wrap-reverse justify-content-between  mb-2">
							<h3 className="text-muted">{t("priceChangeNotifier")}</h3>
						</div>
						<Link
							className="btn btn-primary btn-sm btn-lg px-3"
							to={newPath("/notify-for-two-instruments")}
							role="button">
							{t("back")}
						</Link>
					</div>
					<Card className="card">
						<Card.Header className="d-flex justify-content-between gap-1 align-items-center">
							<h5 className="">
								{t("firstCompanyName")} &rarr; {data.name1}
							</h5>
							{/* <h5>
								{" "}
								{t("companyName")} &rarr; {data.name2}
							</h5> */}
						</Card.Header>
						<ul className="list-group not_rounded">
							<li className="list-group-item">
								{t("price")} &rarr; {data.startPrice1}
							</li>
							{/* <li className="list-group-item">
								{t("desiredPrice")} &rarr; {data.desiredPrice}
							</li>
							<li className="list-group-item">
								{t("desiredPercentage")} &rarr; {data.desiredPercent}
							</li>
							<li className="list-group-item">
								{t("undesiredPrice")} &rarr; {data.undesiredPrice}
							</li> */}
							{/* <li className="list-group-item">
								{t("undesiredPercentage")} &rarr; {data.undesiredPercent}
							</li> */}
							<li className="list-group-item">
								{t("startDate")} &rarr; {data.startPriceDate1}
							</li>
							<li className="list-group-item">
								{t("conid")} &rarr; {data.conId1}
							</li>
						</ul>
						<Card.Header className="d-flex justify-content-between gap-1 align-items-center">
							<h5 className="">
								{t("secondSompanyName")} &rarr; {data.name2}
							</h5>
						</Card.Header>
						<ul className="list-group not_rounded">
							<li className="list-group-item">
								{t("price")} &rarr; {data.startPrice2}
							</li>
							{/* <li className="list-group-item">
								{t("desiredPrice")} &rarr; {data.desiredPrice}
							</li>
							<li className="list-group-item">
								{t("desiredPercentage")} &rarr; {data.desiredPercent}
							</li>
							<li className="list-group-item">
								{t("undesiredPrice")} &rarr; {data.undesiredPrice}
							</li> */}
							{/* <li className="list-group-item">
								{t("undesiredPercentage")} &rarr; {data.undesiredPercent}
							</li> */}
							<li className="list-group-item">
								{t("startDate")} &rarr; {data.startPriceDate2}
							</li>
							<li className="list-group-item">
								{t("conid")} &rarr; {data.conId2}
							</li>
							<li className="list-group-item">
								<b>
									{t("ratio")} &rarr; {data.ratio}
								</b>
							</li>
						</ul>
						<ul className="list-group not_rounded"></ul>
					</Card>
				</Col>
			</Row>
		</section>
	);
}
const loader = async ({ params: { id } }) => {
	debugger;
	try {
		const data = await Api.getTwoInstrumentNotifierById(+id);
		return data.data;
	} catch (error) {
		console.error(error);
	}
};
export const NotifyForTwoInstrumentById = Object.assign(Components, { loader });
