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
		<section style={{ marginTop: "90px", marginBottom: "80px" }}>
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
					<div className="d-flex flex-column gap-2">
						<h4>{t("twoInstrumentsAnalizerFirstInstrument")}</h4>
						<Card className="card">
							<Card.Header className="d-flex justify-content-between gap-1 align-items-center">
								<h5 className="">
									{t("companyName")} &rarr; {data.name1}
								</h5>
							</Card.Header>
							<ul className="list-group not_rounded">
								<li className="list-group-item">
									{t("price")} &rarr; {data.startPrice1}
								</li>
								<li className="list-group-item">
									{t("startDate")} &rarr; {data.startPriceDate1}
								</li>
								<li className="list-group-item">
									{t("conid")} &rarr; {data.conId1}
								</li>
								<li className="list-group-item">
									{t("ratio")} &rarr; {data.ratio}
								</li>
							</ul>
						</Card>
						<h4>{t("twoInstrumentsAnalizerSecondInstrument")}</h4>
						<Card>
							<Card.Header className="d-flex justify-content-between gap-1 align-items-center">
								<h5 className="">
									{t("companyName")} &rarr; {data.name2}
								</h5>
							</Card.Header>
							<ul className="list-group not_rounded">
								<li className="list-group-item">
									{t("price")} &rarr; {data.startPrice2}
								</li>
								<li className="list-group-item">
									{t("startDate")} &rarr; {data.startPriceDate2}
								</li>
								<li className="list-group-item">
									{t("conid")} &rarr; {data.conId2}
								</li>
								<li className="list-group-item">
									{t("ratio")} &rarr; {data.ratio}
								</li>
							</ul>
						</Card>
					</div>
				</Col>
			</Row>
		</section>
	);
}
const loader = async ({ params: { id } }) => {
	try {
		const data = await Api.getTwoInstrumentNotifierById(+id);
		return data.data;
	} catch (error) {
		console.error(error);
	}
};
export const NotifyForTwoInstrumentById = Object.assign(Components, { loader });
