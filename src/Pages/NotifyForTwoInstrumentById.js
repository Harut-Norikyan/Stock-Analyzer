import React, { useMemo, useState } from "react";
import { Row, Col, Table, Card } from "react-bootstrap";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Api from "../Api";
import { convertDateFormat, newPath } from "../helper";

function Components(props) {
	const { t } = useTranslation();
	const data = useLoaderData();
	const tableData = useMemo(() => {
		if (
			data.twoInstrumentsNotifications &&
			data.twoInstrumentsNotifications.length
		) {
			const a = data.twoInstrumentsNotifications.reduce((acum, el) => {
				Object.keys(el).forEach(item => {
					if (acum.hasOwnProperty(item)) {
						acum = {
							...acum,
							[item]: [...acum[item], el[item]],
						};
					} else {
						acum = {
							...acum,
							[item]: [el[item]],
						};
					}
				});
				return acum;
			}, {});
			return a;
		}
		return {};
	}, [data]);

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
					<div className="mt-2">
						<b>{t("notifyForOneInstrumentItem")}</b>
						{data.twoInstrumentsNotifications &&
						Object.keys(tableData).length ? (
							<Table responsive striped bordered className="mt-2 mb-0">
								<thead>
									<tr className="cursor-default">
										<th className="nowrap">#</th>
										{tableData["dateTime"].map((_, i) => (
											<th key={i} className="nowrap">
												{i + 1}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{Object.keys(tableData).map((item, index) => {
										return (
											<React.Fragment key={index}>
												<tr key={index}>
													<td className="fw-500">
														<p className="word-break-break-word max-line-3 m-0">
															<b>{item === "dateTime" ? t("date") : t(item)}</b>
														</p>
													</td>
													{tableData[item].map((element, i) => {
														return (
															<td key={i} className="fw-500">
																<p className="word-break-break-word max-line-3 m-0">
																	{item === "dateTime"
																		? convertDateFormat(element, true)
																		: element}
																</p>
															</td>
														);
													})}
												</tr>
											</React.Fragment>
										);
									})}
								</tbody>
							</Table>
						) : (
							<div className="text-center mt-3">
								<p>
									<b>{t("notNotIfy")}</b>
								</p>
							</div>
						)}
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
