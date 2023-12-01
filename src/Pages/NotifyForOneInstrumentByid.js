import React from "react";

import { Row, Col, Table, Button, Card } from "react-bootstrap";
import Api from "../Api";
import { useLoaderData, Link } from "react-router-dom";

import { convertDateFormat } from "../helper";

export default function Components(props) {
	const data = useLoaderData();
	return (
		<>
			<section style={{ marginTop: "80px", marginBottom: "80px" }}>
				<Row>
					<Col lg={12}>
						<div className="mb-3">
							<Link
								className="btn btn-primary btn-sm btn-lg px-3"
								to="/notify-for-one-instrument"
								role="button">
								Back
							</Link>
						</div>
						<Card className="card">
							<Card.Header className="d-flex justify-content-between gap-1 align-items-center">
								<h5>Compamy name &rarr; {data.name}</h5>
							</Card.Header>
							<ul className="list-group not_rounded">
								<li className="list-group-item">
									Contract Id &rarr; {data.conId}
								</li>
								<li className="list-group-item">
									Deviation Percentage &rarr; {data.deviationPercentage}
								</li>
								<li className="list-group-item">
									Change Percentage &rarr; {data.changePercentage}
								</li>
								<li className="list-group-item">
									Direction &rarr; {data.direction ? "Positive" : "Negative"}
								</li>
								<li className="list-group-item">
									Start price &rarr; {data.startPrice}
								</li>
								<li className="list-group-item">
									Start Price Date &rarr;{" "}
									{convertDateFormat(data.startPriceDate)}
								</li>
							</ul>
						</Card>
						<div className="mt-2">
							<b>One Instrument Notifications</b>
							{data.oneInstrumentNotifications &&
							data.oneInstrumentNotifications.length ? (
								<Table responsive className="table table-striped mt-2 mb-0">
									<thead>
										<tr className="cursor-default">
											<th className="nowrap">#</th>
											<th className="nowrap">Start Price</th>
											<th className="nowrap">DesiredC hange Price</th>
											<th className="nowrap">Desired Deviation Price</th>
											<th className="nowrap">Actual Change Price </th>
											<th className="nowrap">Actual Change Percentage</th>
											<th className="nowrap">Actual Deviation Price</th>
											<th className="nowrap">Actual Deviation Percentage </th>
											<th className="nowrap">Change Date </th>
											<th className="nowrap">Deviation Date</th>
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
										<b>There is no notifiers yet</b>
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
