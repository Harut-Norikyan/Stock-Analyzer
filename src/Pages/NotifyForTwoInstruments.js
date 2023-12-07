import React, { useState } from "react";
import { Row, Col, Table } from "react-bootstrap";
import Api from "../Api";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { convertDateFormat, newPath } from "../helper";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../redux/actions/itemActions";
import { useTranslation } from "react-i18next";

function Components(props) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const data = useLoaderData();
	const [allTwoInstrumentsNotifier, setAllTwoInstrumentsNotifier] =
		useState(data);
	const [deletedItemId, setDeletedItemId] = useState(null);

	const deleteTwoInstrumentsNotifier = async () => {
		if (!deletedItemId) return false;
		dispatch(setIsLoading(true));
		Api.deleteTwoInstrumentsNotifier(deletedItemId)
			.then(response => {
				setAllTwoInstrumentsNotifier(
					allTwoInstrumentsNotifier.find(item => item.id !== deletedItemId),
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
					<h3 className="text-muted">{t("notifyForTwoInstrumentsTitle")}</h3>
				</div>
				<Link
					className="btn btn-primary btn-sm btn-lg px-3"
					to={newPath("/notify-for-two-instruments/form")}
					role="button">
					{t("createNotify")}
				</Link>
			</div>
			{deletedItemId ? (
				<Modal size="sm" show={true} centered>
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
							onClick={deleteTwoInstrumentsNotifier}>
							{t("yes")}
						</Button>
					</Modal.Footer>
				</Modal>
			) : null}
			<Row>
				<Col lg={12}>
					{allTwoInstrumentsNotifier && allTwoInstrumentsNotifier.length ? (
						<Table responsive className="table table-striped mb-0">
							<thead>
								<tr className="cursor-default">
									<th className="nowrap">#</th>
									<th className="nowrap">{t("companyName")} 1</th>
									<th className="nowrap">{t("conid")} 1</th>
									<th className="nowrap">{t("companyName")} 2</th>
									<th className="nowrap">{t("conid")} 2</th>
									<th className="nowrap">{t("startDate")} 1</th>
									<th className="nowrap">{t("startPrice")} 1</th>
									<th className="nowrap">{t("startDate")} 2</th>
									<th className="nowrap">{t("startPrice")} 1</th>
									<th className="nowrap">{t("ratio")}</th>
									<th className="nowrap">{t("actions")}</th>
								</tr>
							</thead>
							<tbody>
								{allTwoInstrumentsNotifier.map((item, index) => {
									return (
										<tr key={index} className="cursor-pointer">
											<td className="fw-500">
												<p className="word-break-break-word max-line-3 m-0">
													{index + 1}
												</p>
											</td>
											<td className="fw-500">
												<p className="word-break-break-word max-line-3 m-0">
													{item.name1}
												</p>
											</td>
											<td className="fw-500">
												<p className="word-break-break-word max-line-3 m-0">
													{item.conId1}
												</p>
											</td>
											<td className="fw-500">
												<p className="word-break-break-word max-line-3 m-0">
													{item.name2}
												</p>
											</td>
											<td className="fw-500">
												<p className="word-break-break-word max-line-3 m-0">
													{item.conId2}
												</p>
											</td>
											<td className="fw-500">
												<p className="word-break-break-word max-line-3 m-0">
													{convertDateFormat(item.startPriceDate1)}
												</p>
											</td>
											<td className="fw-500">
												<p className="word-break-break-word max-line-3 m-0">
													{item.startPrice1}
												</p>
											</td>
											<td className="fw-500">
												<p className="word-break-break-word max-line-3 m-0">
													{convertDateFormat(item.startPriceDate2)}
												</p>
											</td>
											<td className="fw-500">
												<p className="word-break-break-word max-line-3 m-0">
													{item.startPrice2}
												</p>
											</td>
											<td className="fw-500">
												<p className="word-break-break-word max-line-3 m-0">
													{item.ratio}
												</p>
											</td>
											<td className="fw-500">
												<div className="nowrap">
													<button
														type="button"
														className="btn btn-sm btn-outline-success me-1"
														onClick={() =>
															navigate(
																newPath(
																	`/notify-for-two-instruments/form/${item.id}`,
																),
															)
														}>
														{t("edit")}
													</button>
													<button
														type="button"
														className="btn btn-sm btn-outline-danger me-1"
														onClick={() => setDeletedItemId(item.id)}>
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
								<b>There is no notifiers yet</b>
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
		const response = await Api.getAllTwoInstrumentsNotifier();
		if (response && response.data) {
			return response.data;
		} else {
			return [];
		}
	} catch (error) {
		console.error(error);
	}
};
export const NotifyForTwoInstruments = Object.assign(Components, { loader });
