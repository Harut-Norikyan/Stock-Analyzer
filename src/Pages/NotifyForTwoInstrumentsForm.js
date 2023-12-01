import React, { useState } from "react";
import ReactSelectOption from "../Components/ReactSelectOption";
import { useDebounce } from "use-debounce";
import { useEffect } from "react";
import { Row, Col, Table } from "react-bootstrap";
import Api from "../Api";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../redux/actions/itemActions";
import { onNumberChange, onSelectOptionChange } from "../helper";

function Components(props) {
	const dispatch = useDispatch();
	const { isLoading } = useSelector(state => state.isLoading);
	const { secTypes, fields } = useLoaderData();
	const [searchFormFields, setSearchFormFields] = useState({
		secType: "",
		name: false,
		symbol: "",
	});
	const [analizeInstrumentFormFields, setAnalizeInstrumentFormFields] =
		useState(
			fields || {
				conId1: null,
				conId2: null,
				name1: "",
				name2: "",
				ratio: "",
			},
		);

	let { itemId } = useParams();
	const navigate = useNavigate();

	const [securities, setSecurities] = useState([]);
	const [_securities, _setSecurities] = useState([]);
	const [searchFormDebounced] = useDebounce(searchFormFields, 500);

	useEffect(() => {
		const fetchData = async () => {
			if (
				searchFormDebounced.secType.trim().length &&
				searchFormDebounced.symbol.trim().length
			) {
				try {
					dispatch(setIsLoading(true));
					const response = await Api.getSecurities(searchFormDebounced);
					if (!analizeInstrumentFormFields.conId1) {
						if (response && response.data) {
							setSecurities(response.data);
						} else {
							setSecurities([]);
						}
					} else {
						if (response && response.data) {
							_setSecurities(response.data);
						} else {
							_setSecurities([]);
						}
					}
					dispatch(setIsLoading(false));
				} catch (error) {
					console.error(error);
					dispatch(setIsLoading(false));
				}
			}
		};
		fetchData();
	}, [searchFormDebounced, dispatch, analizeInstrumentFormFields.conId1]);

	const onSubmit = async () => {
		if (
			analizeInstrumentFormFields.conId1 &&
			analizeInstrumentFormFields.conId2 &&
			analizeInstrumentFormFields.name1 &&
			analizeInstrumentFormFields.name2 &&
			typeof analizeInstrumentFormFields.ratio === "number"
		) {
			if (itemId) analizeInstrumentFormFields.id = +itemId;
			try {
				dispatch(setIsLoading(true));

				await (itemId
					? Api.updateTwoInstrumentsNotifier(analizeInstrumentFormFields)
					: Api.createTwoInstrumentsNotifier(analizeInstrumentFormFields));
				navigate("/notify-for-two-instruments");
				dispatch(setIsLoading(false));
			} catch (error) {
				console.error(error);
				dispatch(setIsLoading(false));
			}
		}
	};

	return (
		<>
			<section style={{ marginTop: "80px", marginBottom: "80px" }}>
				<Row>
					<Col lg={12}>
						<div className="d-flex flex-wrap-reverse justify-content-between">
							<h3>Search Instrument</h3>
							<h3 className="text-muted">(Notify for two instruments form)</h3>
						</div>
						{!itemId ? (
							<div>
								<div className="form-group mb-2">
									{secTypes && secTypes.length ? (
										<div>
											<label className="mb-1 fw-500">
												Choose Security Type*
											</label>
											<ReactSelectOption
												value={searchFormFields.secType}
												isSearchable={true}
												items={secTypes.map(data => ({
													label: data,
													value: data,
												}))}
												onChange={item =>
													onSelectOptionChange(
														item,
														setSearchFormFields,
														"secType",
													)
												}
											/>
										</div>
									) : null}
								</div>
								<div className="form-check mt-3 mb-2">
									<input
										className="form-check-input"
										type="checkbox"
										id="flexCheckDefault"
										checked={searchFormFields.name}
										onChange={event => {
											setSearchFormFields(values => ({
												...values,
												name: event.target.checked,
												symbol: "",
											}));
										}}
									/>
									<label
										className="form-check-label cursor-pointer fw-500"
										htmlFor="flexCheckDefault">
										Search by Compamy Name
									</label>
								</div>
								<div className="form-group mb-2">
									{!searchFormFields.name ? (
										<div className="form-group">
											<label htmlFor="symbol" className="mb-1 fw-500">
												Symbol*
											</label>
											<input
												type="text"
												className="form-control"
												id="symbol"
												value={searchFormFields.symbol}
												onChange={event => {
													setSearchFormFields(values => ({
														...values,
														symbol: event.target.value,
													}));
												}}
											/>
										</div>
									) : (
										<div className="form-group">
											<label htmlFor="companyName" className="mb-1 fw-500">
												Company Name*
											</label>
											<input
												type="text"
												className="form-control"
												id="companyName"
												value={searchFormFields.symbol}
												onChange={event => {
													setSearchFormFields(values => ({
														...values,
														symbol: event.target.value,
													}));
												}}
											/>
										</div>
									)}
								</div>
							</div>
						) : null}
						{securities && securities.length && !itemId ? (
							<div className="mt-3">
								<h4>First instrument*</h4>
								<Table
									responsive
									className="table table-striped mb-0 border rounded">
									<thead>
										<tr className="cursor-default">
											<th className="nowrap">#</th>
											<th className="nowrap">Company Name</th>
											<th className="nowrap">Symbol</th>
											<th className="nowrap">Market</th>
											<th className="nowrap">Conid</th>
											<th className="nowrap">Choose</th>
										</tr>
									</thead>
									<tbody>
										{securities.map((item, index) => {
											return (
												<tr
													key={index}
													className="cursor-pointer"
													onClick={() => {
														setAnalizeInstrumentFormFields(prevFields => ({
															...prevFields,
															conId1: item.conId,
															name1: item.companyName,
														}));
														setSearchFormFields(prevFields => ({
															...prevFields,
															symbol: "",
														}));
													}}>
													<td className="fw-500 w-25">
														<p className="word-break-break-word max-line-3 m-0">
															{index + 1}
														</p>
													</td>
													<td className="fw-500 w-25">
														<p className="word-break-break-word max-line-3 m-0">
															{item.companyName}
														</p>
													</td>
													<td className="fw-500 w-20">
														<p className="word-break-break-word max-line-3 m-0">
															{item.symbol}
														</p>
													</td>
													<td className="fw-500 w-25">
														<p className="word-break-break-word max-line-3 m-0">
															{item.market}
														</p>
													</td>
													<td className="fw-500 w-20">
														<p className="word-break-break-word max-line-3 m-0">
															{item.conId}
														</p>
													</td>
													<td className="fw-500 w-10">
														<div className="form-check">
															<input
																className="form-check-input"
																type="radio"
																name="conId1"
																checked={
																	analizeInstrumentFormFields.conId1 ===
																	item.conId
																		? true
																		: false
																}
																onChange={() => {
																	setAnalizeInstrumentFormFields(
																		prevFields => ({
																			...prevFields,
																			conId1: item.conId,
																			name1: item.companyName,
																		}),
																	);
																	setSearchFormFields(prevFields => ({
																		...prevFields,
																		symbol: "",
																	}));
																}}
															/>
														</div>
													</td>
												</tr>
											);
										})}
									</tbody>
								</Table>
							</div>
						) : null}
						{_securities && _securities.length && !itemId ? (
							<div className="mt-3">
								<h4>Second instrument*</h4>
								<Table responsive className="table table-striped border mb-0">
									<thead>
										<tr className="cursor-default">
											<th className="nowrap">#</th>
											<th className="nowrap">Company Name</th>
											<th className="nowrap">Symbol</th>
											<th className="nowrap">Market</th>
											<th className="nowrap">Conid</th>
											<th className="nowrap">Choose</th>
										</tr>
									</thead>
									<tbody>
										{_securities.map((item, index) => {
											return (
												<tr
													key={index}
													className="cursor-pointer"
													onClick={() => {
														setAnalizeInstrumentFormFields(prevFields => ({
															...prevFields,
															conId2: item.conId,
															name2: item.companyName,
														}));
														setSearchFormFields(prevFields => ({
															...prevFields,
															symbol: "",
														}));
													}}>
													<td className="fw-500 w-25">
														<p className="word-break-break-word max-line-3 m-0">
															{index + 1}
														</p>
													</td>
													<td className="fw-500 w-25">
														<p className="word-break-break-word max-line-3 m-0">
															{item.companyName}
														</p>
													</td>
													<td className="fw-500 w-20">
														<p className="word-break-break-word max-line-3 m-0">
															{item.symbol}
														</p>
													</td>
													<td className="fw-500 w-25">
														<p className="word-break-break-word max-line-3 m-0">
															{item.market}
														</p>
													</td>
													<td className="fw-500 w-20">
														<p className="word-break-break-word max-line-3 m-0">
															{item.conId}
														</p>
													</td>
													<td className="fw-500 w-10">
														<div className="form-check">
															<input
																className="form-check-input"
																type="radio"
																name="conId2"
																checked={
																	analizeInstrumentFormFields.conId2 ===
																	item.conId
																		? true
																		: false
																}
																onChange={() => {
																	setAnalizeInstrumentFormFields(
																		prevFields => ({
																			...prevFields,
																			conId2: item.conId,
																			name2: item.companyName,
																		}),
																	);
																	setSearchFormFields(prevFields => ({
																		...prevFields,
																		symbol: "",
																	}));
																}}
															/>
														</div>
													</td>
												</tr>
											);
										})}
									</tbody>
								</Table>
							</div>
						) : null}

						{analizeInstrumentFormFields.conId1 &&
						analizeInstrumentFormFields.conId2 ? (
							<>
								<hr />
								<div className="mb-4">
									{!itemId ? (
										<Row>
											<Col md={6}>
												<div className="form-group mb-2">
													<label htmlFor="startDate" className="mb-1 fw-500">
														Start Date
													</label>
													<input
														type="date"
														className="form-control"
														id="startDate"
														value={analizeInstrumentFormFields.startDate}
														onChange={event => {
															setAnalizeInstrumentFormFields(values => ({
																...values,
																startDate: event.target.value,
															}));
														}}
													/>
												</div>
											</Col>
											<Col md={6}>
												<div className="form-group mb-2">
													<label htmlFor="endDate" className="mb-1 fw-500">
														End Date
													</label>
													<input
														type="date"
														className="form-control"
														id="endDate"
														value={analizeInstrumentFormFields.endDate}
														onChange={event => {
															setAnalizeInstrumentFormFields(values => ({
																...values,
																endDate: event.target.value,
															}));
														}}
													/>
												</div>
											</Col>
										</Row>
									) : null}
									<div className="form-group mb-2">
										<label htmlFor="ratio" className="mb-1 fw-500">
											Ratio*
										</label>
										<input
											type="number"
											className="form-control"
											id="ratio"
											value={analizeInstrumentFormFields.ratio}
											onChange={event =>
												onNumberChange(
													event,
													setAnalizeInstrumentFormFields,
													"ratio",
												)
											}
										/>
									</div>
								</div>
							</>
						) : null}

						<div className="d-flex justify-content-end mt-3">
							<button
								type="button"
								className="btn btn-primary px-4"
								disabled={
									!analizeInstrumentFormFields.conId1 ||
									!analizeInstrumentFormFields.conId2 ||
									!analizeInstrumentFormFields.name1 ||
									!analizeInstrumentFormFields.name2 ||
									typeof analizeInstrumentFormFields.ratio !== "number" ||
									isLoading
								}
								onClick={onSubmit}>
								{itemId ? "Update" : "Create"}
							</button>
						</div>
					</Col>
				</Row>
			</section>
		</>
	);
}
const loader = async ({ params: { itemId } }) => {
	try {
		const responseSecurityTypes = await Api.getSecurityTypes({
			secType: "",
			name: false,
			symbol: "",
		});
		let responseTwoInstrumentNotifierById;
		if (itemId) {
			responseTwoInstrumentNotifierById =
				await Api.getTwoInstrumentNotifierById(+itemId);
		}
		const data = {
			secTypes: responseSecurityTypes.data || [],
			fields: responseTwoInstrumentNotifierById?.data || null,
		};
		return data;
	} catch (error) {
		console.error(error);
	}
};

export const NotifyForTwoInstrumentsForm = Object.assign(Components, {
	loader,
});
