import React from "react";

import { Row, Col, Table, Card } from "react-bootstrap";
import Api from "../Api";
import { useLoaderData, Link } from "react-router-dom";

import { convertDateFormat, newPath } from "../helper";
import { useTranslation } from "react-i18next";

export default function Components(props) {
	const data = useLoaderData();
	const { t } = useTranslation();
	return (
		<>
			<section style={{ marginTop: "90px", marginBottom: "80px" }}>
				<Row>
					<Col lg={12}>
						<div className="mb-3">
							<div className="d-flex flex-wrap-reverse justify-content-between mb-2">
								<h3 className="text-muted">{t("priceChangeNotifier")}</h3>
							</div>
							<Link
								className="btn btn-primary btn-sm btn-lg px-3"
								to={newPath("/notify-for-price")}
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
								<li className="list-group-item">Price &rarr; {data.price}</li>
								<li className="list-group-item">
									{t("desiredPrice")} &rarr; {data.desiredPrice}
								</li>
								<li className="list-group-item">
									{t("desiredPercentage")} &rarr; {data.desiredPercent}
								</li>
								<li className="list-group-item">
									{t("undesiredPrice")} &rarr; {data.undesiredPrice}
								</li>
								<li className="list-group-item">
									{t("undesiredPercentage")} &rarr; {data.undesiredPercent}
								</li>
								<li className="list-group-item">
									{t("date")} &rarr; {data.priceDate}
								</li>
								<li className="list-group-item">
									{t("conid")} &rarr; {data.conId}
								</li>
							</ul>
						</Card>
						<div className="mt-2">
							<b>{t("priceChangeNotifications")}</b>
							{data.priceChangeNotifications &&
							data.priceChangeNotifications.length ? (
								<Table responsive striped bordered className=" mt-2 mb-0">
									<thead>
										<tr className="cursor-default">
											<th className="nowrap">#</th>
											<th className="nowrap">{t("actualChangePrice")}</th>
											<th className="nowrap">{t("actualChangePercentage")}</th>
											<th className="nowrap">{t("changeDate")}</th>
										</tr>
									</thead>
									<tbody>
										{data.priceChangeNotifications.map((item, index) => {
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
																{item.actualChangePrice}
															</p>
														</td>
														<td className="fw-500">
															<p className="word-break-break-word max-line-3 m-0">
																{item.actualChangePercent}
															</p>
														</td>
														<td className="fw-500">
															<p className="word-break-break-word max-line-3 m-0">
																{convertDateFormat(item.ChangeDate)}
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
		const data = await Api.getPriceChangeNotifierID(+id);
		return data.data;
	} catch (error) {
		console.error(error);
	}
};
export const NotifyForPriceById = Object.assign(Components, { loader });
