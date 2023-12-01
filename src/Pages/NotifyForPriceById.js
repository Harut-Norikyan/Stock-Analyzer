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
								to="/notify-for-price"
								role="button">
								Back
							</Link>
						</div>
						<Card className="card">
							<Card.Header className="d-flex justify-content-between gap-1 align-items-center">
								<h5>Compamy name &rarr; {data.name}</h5>
							</Card.Header>
							<ul className="list-group not_rounded">
								<li className="list-group-item">Price &rarr; {data.price}</li>
								<li className="list-group-item">
									Desired price &rarr; {data.desiredPrice}
								</li>
								<li className="list-group-item">
									Desired percent &rarr; {data.desiredPercent}
								</li>
								<li className="list-group-item">
									Undesired price &rarr; {data.undesiredPrice}
								</li>
								<li className="list-group-item">
									Undesired percent &rarr; {data.undesiredPercent}
								</li>
								<li className="list-group-item">
									Date &rarr; {data.priceDate}
								</li>
								<li className="list-group-item">Id &rarr; {data.conId}</li>
							</ul>
						</Card>
						<div className="mt-2">
							<b>Price Change Notifications</b>
							{data.priceChangeNotifications &&
							data.priceChangeNotifications.length ? (
								<Table responsive className="table table-striped mt-2 mb-0">
									<thead>
										<tr className="cursor-default">
											<th className="nowrap">#</th>
											<th className="nowrap">Actual Change Price</th>
											<th className="nowrap">Actual Change Percent</th>
											<th className="nowrap">Change Date</th>
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
		const data = await Api.getPriceChangeNotifierID(+id);
		return data.data;
	} catch (error) {
		console.error(error);
	}
};
export const NotifyForPriceById = Object.assign(Components, { loader });
