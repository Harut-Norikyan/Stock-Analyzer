import React, { useState } from "react";
import { Row, Col, Table } from "react-bootstrap";
import Api from "../Api";
import { Link, useNavigate, useLoaderData } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { convertDateFormat, newPath } from "../helper";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../redux/actions/itemActions";
import { useTranslation } from "react-i18next";
import { DowenTable, UpTable } from "../assets";

export default function Components(props) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const data = useLoaderData();
	const [allOneInstrumentNotifiers, setAllOneInstrumentNotifiers] =
		useState(data);
	const [deletedItemId, setDeletedItemId] = useState(null);
	const deleteOneInstrumentsNotifier = async () => {
		if (!deletedItemId) return false;
		dispatch(setIsLoading(true));
		Api.deleteOneInstrumentsNotifier(deletedItemId)
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
				<div className="d-flex flex-wrap-reverse justify-content-between mb-2">
					<h3 className="text-muted">{t("notifyForOneInstrumentTitle")}</h3>
				</div>
				<div className="d-flex gap-3  mb-3">
					<Link
						className="btn btn-primary btn-sm btn-lg px-3"
						to={newPath(" ")}
						role="button">
						{t("back")}
					</Link>
					<Link
						// style={{ height: "100%" }}
						className="btn btn-primary btn-sm btn-lg px-3"
						to={newPath("/notify-for-one-instrument/form")}
						role="button">
						{t("createNotify")}
					</Link>
				</div>
			</div>
			{deletedItemId ? (
				<Modal
					size="sm"
					show={true}
					onHide={() => {
						setDeletedItemId(false);
					}}
					centered>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter">
							{t("title")}
						</Modal.Title>
					</Modal.Header>
					<Modal.Footer>
						<Button
							variant="secondary"
							className="px-3"
							onClick={() => setDeletedItemId(false)}>
							{t("no")}
						</Button>
						<Button
							variant="primary"
							className="px-3"
							onClick={deleteOneInstrumentsNotifier}>
							{t("yes")}
						</Button>
					</Modal.Footer>
				</Modal>
			) : null}
			<Row>
				<Col lg={12}>
					{allOneInstrumentNotifiers && allOneInstrumentNotifiers.length ? (
						<Table responsive striped bordered className="mb-0">
							<thead>
								<tr className="cursor-default">
									<th className="nowrap">#</th>
									<th className="nowrap">{t("companyName")}</th>
									<th className="nowrap">{t("conid")}</th>
									<th
										className="nowrap"
										dangerouslySetInnerHTML={{
											__html: t("startPrice"),
										}}></th>
									<th
										className="nowrap"
										dangerouslySetInnerHTML={{
											__html: t("changePercentage"),
										}}
									/>
									<th
										className="nowrap"
										dangerouslySetInnerHTML={{
											__html: t("deviationPercentage"),
										}}></th>
									<th className="nowrap">{t("direction")}</th>
									<th className="nowrap">{t("startDate")}</th>
									<th className="nowrap">{t("actions")}</th>
								</tr>
							</thead>
							<tbody>
								{allOneInstrumentNotifiers.map((item, index) => {
									return (
										<tr
											key={index}
											className="cursor-pointer"
											onClick={() => {
												navigate(
													newPath(`/notify-for-one-instrument/${item.id}`),
												);
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
													{item.startPrice}
												</p>
											</td>
											<td className="fw-500">
												<p className="word-break-break-word max-line-3 m-0">
													{item.changePercentage}
												</p>
											</td>
											<td className="fw-500">
												<p className="word-break-break-word max-line-3 m-0">
													{item.deviationPercentage}
												</p>
											</td>

											<td className="fw-500">
												<p className="word-break-break-word max-line-3 m-0 d-flex justify-content-around button_container">
													{item.direction ? (
														<UpTable style={{ width: 20, height: 20 }} />
													) : (
														<DowenTable style={{ width: 20, height: 20 }} />
													)}
												</p>
											</td>

											<td className="fw-500">
												<p className="word-break-break-word max-line-3 m-0">
													{convertDateFormat(item.startPriceDate)}
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
																newPath(
																	`/notify-for-one-instrument/form/${item.id}`,
																),
															);
														}}>
														{t("edit")}
													</button>
													<button
														type="button"
														className="btn btn-sm btn-outline-danger me-1"
														onClick={e => {
															e.stopPropagation();
															setDeletedItemId(item.id);
														}}>
														{t("delete")}
													</button>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</Table>
					) : (
						<div className="text-center">
							<p>
								<b>{t("notNotIfy")}</b>
							</p>
						</div>
					)}
				</Col>
			</Row>
		</section>
	);
}
const loader = async () => {
	try {
		const response = await Api.getAllOneInstrumentNotifiers();
		if (response && response.data) {
			return response.data;
		} else {
			return [];
		}
	} catch (error) {
		console.error(error);
	}
};
export const NotifyForOneInstrument = Object.assign(Components, { loader });
