import React from "react";

import { Row, Col, Table, Card } from "react-bootstrap";
import Api from "../Api";
import { useLoaderData, Link } from "react-router-dom";
import { convertDateFormat, newPath } from "../helper";
import { useTranslation } from "react-i18next";
import { DowenTable, UpTable } from "../assets";

export default function Components(props) {
	const { t } = useTranslation();
	const data = useLoaderData();
	return (
		<>
			<section style={{ marginTop: "80px", marginBottom: "80px" }}>
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
									{t("deviationPercentage")} &rarr; {data.deviationPercentage}
								</li>
								<li className="list-group-item">
									{t("changePercentage")} &rarr; {data.changePercentage}
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
									{t("startPrice")} &rarr; {data.startPrice}
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
							data.oneInstrumentNotifications.length ? (
								<Table responsive className="table table-striped mt-2 mb-0">
									<thead>
										<tr className="cursor-default">
											<th className="nowrap">#</th>
											<th className="nowrap">{t("startPrice")}</th>
											<th className="nowrap">{t("desiredChangePrice")}</th>
											<th className="nowrap">{t("desiredDeviationPrice")}</th>
											<th className="nowrap">{t("actualChangePrice")}</th>
											<th className="nowrap">{t("actualChangePercentage")}</th>
											<th className="nowrap">{t("actualDeviationPrice")}</th>
											<th className="nowrap">
												{t("actualDeviationPercentage")}
											</th>
											<th className="nowrap">{t("changeDate")}</th>
											<th className="nowrap">{t("deviationDate")}</th>
										</tr>
									</thead>
									<tbody>
										{data.oneInstrumentNotifications.map((item, index) => {
											return (
												<React.Fragment key={index}>
													<tr key={index}>
														<td className="fw-500">
															<p className="word-break-break-word max-line-3 m-0">
																{index + 1}
															</p>
														</td>
														<td className="fw-500">
															<p className="word-break-break-word max-line-3 m-0">
																{item.startPrice}
															</p>
														</td>
														<td className="fw-500">
															<p className="word-break-break-word max-line-3 m-0">
																{item.desiredChangePrice}
															</p>
														</td>
														<td className="fw-500">
															<p className="word-break-break-word max-line-3 m-0">
																{item.desiredDeviationPrice}
															</p>
														</td>
														<td className="fw-500">
															<p className="word-break-break-word max-line-3 m-0">
																{item.actualChangePrice}
															</p>
														</td>
														<td className="fw-500">
															<p className="word-break-break-word max-line-3 m-0">
																{item.actualChangePercentage}
															</p>
														</td>
														<td className="fw-500">
															<p className="word-break-break-word max-line-3 m-0">
																{item.actualDeviationPrice}
															</p>
														</td>
														<td className="fw-500">
															<p className="word-break-break-word max-line-3 m-0">
																{convertDateFormat(item.changeDate)}
															</p>
														</td>
														<td className="fw-500">
															<p className="word-break-break-word max-line-3 m-0">
																{convertDateFormat(item.DeviationDate)}
															</p>
														</td>
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
