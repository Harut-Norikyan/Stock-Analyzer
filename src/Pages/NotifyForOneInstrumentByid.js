import React, { useMemo } from "react";

import { Row, Col, Table, Card } from "react-bootstrap";
import Api from "../Api";
import { useLoaderData, Link } from "react-router-dom";
import { convertDateFormat, newPath } from "../helper";
import { useTranslation } from "react-i18next";
import { DowenTable, UpTable } from "../assets";

export default function Components(props) {
	const { t } = useTranslation();
	const data = useLoaderData();

	const tableData = useMemo(() => {
		if (
			data.oneInstrumentNotifications &&
			data.oneInstrumentNotifications.length
		) {
			const a = data.oneInstrumentNotifications.reduce((acum, el) => {
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
		<>
			<section style={{ marginTop: "90px", marginBottom: "80px" }}>
				<Row>
					<Col lg={12}>
						<div className="mb-3">
							<div className="d-flex flex-wrap-reverse justify-content-between mb-2">
								<h3 className="text-muted">
									{t("notifyForOneInstrumentItem")}
								</h3>
							</div>
							<Link
								className="btn btn-primary btn-sm btn-lg px-3"
								to={newPath("/notify-for-one-instrument")}
								role="button">
								{t("back")}
							</Link>
						</div>
						<Card className="card">
							<Card.Header className="d-flex justify-content-between gap-1 align-items-center">
								<h5>
									{t("companyName")} &rarr; {data.name}
								</h5>
							</Card.Header>
							<ul className="list-group not_rounded">
								<li className="list-group-item">
									{t("conid")} &rarr; {data.conId}
								</li>
								<li className="list-group-item">
									<span
										dangerouslySetInnerHTML={{
											__html: t("deviationPercentage"),
										}}
									/>{" "}
									&rarr; {data.deviationPercentage}
								</li>
								<li className="list-group-item">
									<span
										dangerouslySetInnerHTML={{
											__html: t("changePercentage"),
										}}
									/>{" "}
									&rarr; {data.changePercentage}
								</li>
								<li className="list-group-item">
									{t("direction")} &rarr;
									{data.direction ? (
										<UpTable style={{ width: 20, height: 20 }} />
									) : (
										<DowenTable style={{ width: 20, height: 20 }} />
									)}
								</li>
								<li className="list-group-item">
									<span
										dangerouslySetInnerHTML={{
											__html: t("startPrice"),
										}}
									/>{" "}
									&rarr; {data.startPrice}
								</li>
								<li className="list-group-item">
									{t("startDate")} &rarr;{" "}
									{convertDateFormat(data.startPriceDate)}
								</li>
							</ul>
						</Card>
						<div className="mt-2">
							<b>{t("notifyForOneInstrumentItem")}</b>
							{data.oneInstrumentNotifications &&
							Object.keys(tableData).length ? (
								<Table responsive striped bordered className="mt-2 mb-0">
									<thead>
										<tr className="cursor-default">
											<th className="nowrap">#</th>
											{tableData["changeDate"].map((_, i) => (
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
																<b>{t(item)}</b>
															</p>
														</td>
														{tableData[item].map((element, i) => {
															return (
																<td key={i} className="fw-500">
																	<p className="word-break-break-word max-line-3 m-0">
																		{item === "deviationDate" ||
																		item === "changeDate"
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
		</>
	);
}

const loader = async ({ params: { id } }) => {
	try {
		const data = await Api.getOneInstrumentNotifierById(+id);
		return data.data;
	} catch (error) {
		console.error(error);
	}
};
export const NotifyForOneInstrumentByid = Object.assign(Components, { loader });
