import React, { useState } from "react";
import { Row, Col, Table } from "react-bootstrap";
import Api from "../Api";
import { Link, useNavigate, useLoaderData } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { convertDateFormat, newPath } from "../helper";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../redux/actions/itemActions";

export default function Components(props) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const data = useLoaderData();
	const [allOneInstrumentNotifiers, setAllOneInstrumentNotifiers] =
		useState(data);
	const [deletedItemId, setDeletedItemId] = useState(null);
	const deleteOneInstrumentsNotifier = async () => {
		if (!deletedItemId) return false;
		dispatch(setIsLoading(true));
		Api.deletePriceChangeNotifier(deletedItemId)
			.then(response => {
				setAllOneInstrumentNotifiers(
					allOneInstrumentNotifiers.find(item => item.id !== deletedItemId),
				);
				dispatch(setIsLoading(false));
				setDeletedItemId(null);
			})
			.catch(error => {
				console.error(error);
				dispatch(setIsLoading(false));
				setDeletedItemId(null);
			});
	};

	return (
		<section style={{ marginTop: "90px", marginBottom: "80px" }}>
			<div className="mb-3">
				<Link
					className="btn btn-primary btn-sm btn-lg px-3"
					to={newPath("/notify-for-price/form")}
					role="button">
					Create notify
				</Link>
			</div>
			{deletedItemId ? (
				<Modal size="sm" show={true} centered>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter">
							Are you sure ?
						</Modal.Title>
					</Modal.Header>
					<Modal.Footer>
						<Button
							variant="secondary"
							className="px-3"
							onClick={() => setDeletedItemId(false)}>
							No
						</Button>
						<Button
							variant="primary"
							className="px-3"
							onClick={deleteOneInstrumentsNotifier}>
							Yes
						</Button>
					</Modal.Footer>
				</Modal>
			) : null}
			<Row>
				<Col lg={12}>
					{allOneInstrumentNotifiers && allOneInstrumentNotifiers.length ? (
						<Table responsive className="table table-striped mb-0">
							<thead>
								<tr className="cursor-default">
									<th className="nowrap">#</th>
									<th className="nowrap">Company Name</th>
									<th className="nowrap">Contract Id</th>
									<th className="nowrap">Desired Percentage</th>
									<th className="nowrap">Desired Price</th>
									<th className="nowrap">Undesired Percentage</th>
									<th className="nowrap">Undesired Price</th>
									<th className="nowrap">Direction</th>
									<th className="nowrap">Price</th>
									<th className="nowrap">Price Date</th>
									<th className="nowrap">Actions</th>
								</tr>
							</thead>
							<tbody>
								{allOneInstrumentNotifiers.map((item, index) => {
									return (
										<React.Fragment key={index}>
											<tr
												key={index}
												className="cursor-pointer"
												onClick={async () => {
													navigate(newPath(`/notify-for-price/${item.id}`));
												}}>
												<td className="fw-500">
													<p className="word-break-break-word max-line-3 m-0">
														{index + 1}
													</p>
												</td>
												<td className="fw-500">
													<p className="word-break-break-word max-line-3 m-0">
														{item.name}
													</p>
												</td>
												<td className="fw-500">
													<p className="word-break-break-word max-line-3 m-0">
														{item.conId}
													</p>
												</td>
												<td className="fw-500">
													<p className="word-break-break-word max-line-3 m-0">
														{item.desiredPercent}
													</p>
												</td>
												<td className="fw-500">
													<p className="word-break-break-word max-line-3 m-0">
														{item.desiredPrice}
													</p>
												</td>
												<td className="fw-500">
													<p className="word-break-break-word max-line-3 m-0">
														{item.undesiredPercent}
													</p>
												</td>
												<td className="fw-500">
													<p className="word-break-break-word max-line-3 m-0">
														{item.undesiredPrice}
													</p>
												</td>
												<td className="fw-500">
													<p className="word-break-break-word max-line-3 m-0">
														{item.direction ? "Positive" : "Negative"}
													</p>
												</td>
												<td className="fw-500">
													<p className="word-break-break-word max-line-3 m-0">
														{item.price}
													</p>
												</td>
												<td className="fw-500">
													<p className="word-break-break-word max-line-3 m-0">
														{convertDateFormat(item.priceDate)}
													</p>
												</td>
												<td className="fw-500">
													<div className="nowrap">
														<button
															type="button"
															className="btn btn-sm btn-outline-success me-1"
															onClick={e => {
																e.stopPropagation();
																navigate(
																	newPath(`/notify-for-price/form/${item.id}`),
																);
															}}>
															Edit
														</button>
														<button
															type="button"
															className="btn btn-sm btn-outline-danger me-1"
															onClick={e => {
																e.stopPropagation();
																setDeletedItemId(item.id);
															}}>
															Delete
														</button>
													</div>
												</td>
											</tr>
										</React.Fragment>
									);
								})}
							</tbody>
						</Table>
					) : (
						<div className="text-center">
							<p>
								<b>There is no notifiers yet</b>
							</p>
						</div>
					)}
				</Col>
			</Row>
		</section>
	);
}

const loader = async ({ params: { itemId } }) => {
	try {
		const responseSecurityTypes = await Api.getAllPriceChangeNotifiers();
		return responseSecurityTypes.data || [];
	} catch (error) {
		console.error(error);
	}
};
export const NotifyForPrice = Object.assign(Components, { loader });
