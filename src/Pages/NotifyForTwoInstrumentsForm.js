import React, { useState } from "react";
import ReactSelectOption from "../Components/ReactSelectOption";
import { useDebounce } from "use-debounce";
import { useEffect } from "react";
import { Row, Col, Table, Card, Button } from "react-bootstrap";
import Api from "../Api";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../redux/actions/itemActions";
import { newPath, onNumberChange, onSelectOptionChange } from "../helper";
import { IoCloseSharp } from "react-icons/io5";
import { Arrow } from "../assets";
import { useTranslation } from "react-i18next";

function Components(props) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { isLoading } = useSelector(state => state.isLoading);
	const { secTypes, fields } = useLoaderData();
	const [firstData, setFirstdata] = useState(null);
	const [secondData, setSecondData] = useState(null);
	const [pricesAndRatios, setPricesAndRatios] = useState(null);
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
		if (firstData && secondData) {
			const data = {
				contract1: {
					companyName: firstData.companyName || "",
					conId: firstData.conId || "",
					price: firstData.price || "",
					priceDate: firstData.priceDate || "",
				},
				contract2: {
					companyName: secondData.companyName || "",
					conId: secondData.conId || "",
					price: secondData.price || "",
					priceDate: secondData.priceDate || "",
				},
			};
			getContractsWithLastPricesAndRatios(data);
		}
	}, [firstData, secondData]);

	const getContractsWithLastPricesAndRatios = data => {
		if (!data || data.contract1.price || data.contract2.price) return;
		dispatch(setIsLoading(true));
		Api.GetContractsWithLastPricesAndRatios(data)
			.then(response => {
				if (response && response.data) {
					setPricesAndRatios(response.data);
				} else {
					setSecurities(null);
				}
			})
			.catch(error => {
				console.error(error.message || error.respmess || error);
			})
			.finally(() => {
				dispatch(setIsLoading(true));
			});
	};

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
				navigate(newPath("/notify-for-two-instruments"));
				dispatch(setIsLoading(false));
			} catch (error) {
				console.error(error);
				dispatch(setIsLoading(false));
			}
		}
	};

	return (
		<>
			<section style={{ marginTop: "90px", marginBottom: "80px" }}>
				<Row>
					<Col lg={12}>
						<div className="d-flex flex-wrap-reverse justify-content-between">
							<h3>{t("searchInstrument")}</h3>
							<h3 className="text-muted">{t("notifyForTwoInstrumentsForm")}</h3>
						</div>
						<Link
							className="btn btn-primary btn-sm btn-lg px-3 mb-3"
							to={newPath("/notify-for-two-instruments")}
							role="button">
							{t("back")}
						</Link>
						{!itemId ? (
							<div>
								<div className="form-group mb-2">
									{secTypes && secTypes.length ? (
										<div>
											<label className="mb-1 fw-500">
												{t("searchSecurityType")}
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
										{t("searchByCompamyName")}
									</label>
								</div>
								<div className="form-group mb-2">
									<div className="form-group">
										<label htmlFor="symbol" className="mb-1 fw-500">
											{!searchFormFields.name ? t("symbol") : t("companyName")}*
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
								</div>
							</div>
						) : null}
						{firstData && (
							<Row>
								<h4>{t("twoInstrumentsAnalizerFirstInstrument")}*</h4>
								<Col lg={12}>
									<Card className="card">
										<Card.Header className="d-flex justify-content-between gap-1 align-items-center">
											<h5>
												{t("companyName")} &rarr; {firstData?.companyName}
											</h5>
											<Button
												onClick={() => {
													setFirstdata(null);
													setAnalizeInstrumentFormFields(prev => ({
														...prev,
														conId1: null,
														name1: "",
													}));
												}}
												variant="outline-dark">
												<IoCloseSharp />
											</Button>
										</Card.Header>
										<ul className="list-group not_rounded">
											<li className="list-group-item">
												{t("price")} &rarr; {firstData?.price}
											</li>
											<li className="list-group-item">
												{t("date")} &rarr; {firstData?.priceDate}
											</li>
											<li className="list-group-item">
												{t("conid")} &rarr; {firstData?.conId}
											</li>
										</ul>
									</Card>
								</Col>
							</Row>
						)}
						{securities && securities.length && !firstData && !itemId ? (
							<div className="mt-3">
								<h4>{t("twoInstrumentsAnalizerFirstInstrument")}*</h4>
								<Table
									responsive
									striped
									bordered
									className=" mb-0 border rounded">
									<thead>
										<tr className="cursor-default">
											<th className="nowrap">#</th>
											<th className="nowrap">{t("companyName")}</th>
											<th className="nowrap">{t("symbol")}</th>
											<th className="nowrap">{t("market")}</th>
											<th className="nowrap">{t("conid")}</th>
											<th className="nowrap">{t("choose")}</th>
										</tr>
									</thead>
									<tbody>
										{securities.map((item, index) => {
											return (
												<tr
													key={index}
													className="cursor-pointer"
													onClick={async () => {
														dispatch(setIsLoading(true));
														const data = {
															conId: item.conId,
															companyName: item.companyName,
														};
														await Api.getContractWithPrice(data)
															.then(res => {
																if (res?.data && res.status === 200) {
																	setFirstdata(res.data);
																} else {
																	setFirstdata(item);
																}
															})
															.catch(err => {
																console.log(err);
															})
															.finally(() => {
																dispatch(setIsLoading(false));
															});
														setAnalizeInstrumentFormFields(prevFields => ({
															...prevFields,
															conId1: item.conId,
															name1: item.companyName,
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
							analizeInstrumentFormFields.conId2 &&
							!itemId && (
								<div className="d-flex justify-content-center w-100 my-2">
									<Button
										variant="light"
										onClick={() => {
											const cloneFirstData = firstData;
											const cloneSecondData = secondData;
											const cloneSecurities = securities;
											const _cloneSecurities = _securities;
											setSecurities(_cloneSecurities);
											_setSecurities(cloneSecurities);
											setFirstdata(cloneSecondData);
											setSecondData(cloneFirstData);
											setAnalizeInstrumentFormFields(prev => ({
												...prev,
												conId2: prev.conId1,
												name2: prev.name1,
												conId1: prev.conId2,
												name1: prev.name2,
											}));
											const data = {
												contract1: {
													companyName: secondData.companyName || "",
													conId: secondData.conId || "",
													price: secondData.price || "",
													priceDate: secondData.priceDate || "",
												},
												contract2: {
													companyName: firstData.companyName || "",
													conId: firstData.conId || "",
													price: firstData.price || "",
													priceDate: firstData.priceDate || "",
												},
											};
											getContractsWithLastPricesAndRatios(data);
										}}>
										<Arrow style={{ width: 40, height: 40 }} />
									</Button>
								</div>
							)}
						{secondData && (
							<Row>
								<h4>{t("twoInstrumentsAnalizerSecondInstrument")}*</h4>
								<Col lg={12}>
									<Card className="card">
										<Card.Header className="d-flex justify-content-between gap-1 align-items-center">
											<h5>
												{t("companyName")} &rarr; {secondData?.companyName}
											</h5>
											<Button
												onClick={() => {
													setSecondData(null);
													setAnalizeInstrumentFormFields(prev => ({
														...prev,
														conId2: null,
														name2: "",
													}));
												}}
												variant="outline-dark">
												<IoCloseSharp />
											</Button>
										</Card.Header>
										<ul className="list-group not_rounded">
											<li className="list-group-item">
												{t("price")} &rarr; {secondData?.price}
											</li>
											<li className="list-group-item">
												{t("date")} &rarr; {secondData?.priceDate}
											</li>
											<li className="list-group-item">
												{t("conid")} &rarr; {secondData?.conId}
											</li>
										</ul>
									</Card>
								</Col>
							</Row>
						)}
						{pricesAndRatios && pricesAndRatios.computedRatio && (
							<h5>
								{"Computed Ratio"} &rarr; {pricesAndRatios.computedRatio}
							</h5>
						)}
						{_securities && _securities.length && !secondData && !itemId ? (
							<div className="mt-3">
								<h4>{t("twoInstrumentsAnalizerSecondInstrument")}*</h4>
								<Table responsive striped bordered className=" border mb-0">
									<thead>
										<tr className="cursor-default">
											<th className="nowrap">#</th>
											<th className="nowrap">{t("companyName")}</th>
											<th className="nowrap">{t("symbol")}</th>
											<th className="nowrap">{t("market")}</th>
											<th className="nowrap">{t("conid")}</th>
											<th className="nowrap">{t("choose")}</th>
										</tr>
									</thead>
									<tbody>
										{_securities.map((item, index) => {
											return (
												<tr
													key={index}
													className="cursor-pointer"
													onClick={async () => {
														dispatch(setIsLoading(true));
														const data = {
															conId: item.conId,
															companyName: item.companyName,
														};
														await Api.getContractWithPrice(data)
															.then(res => {
																if (res?.data && res.status === 200) {
																	setSecondData(res.data);
																} else {
																	setSecondData(item);
																}
															})
															.catch(err => {
																console.log(err);
															})
															.finally(() => dispatch(setIsLoading(false)));
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

						<>
							<hr />
							<div className="mb-4">
								{/* {!itemId ? (
									<Row>
										<Col md={6}>
											<div className="form-group mb-2">
												<label htmlFor="startDate" className="mb-1 fw-500">
													{t("startDate")}
												</label>
												<input
													type="date"
													pattern="\d{2}\.\d{2}\.\d{4}"
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
													{t("endDate")}
												</label>
												<input
													type="date"
													pattern="\d{2}\.\d{2}\.\d{4}"
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
								) : null} */}
								<div className="form-group mb-2">
									<label htmlFor="ratio" className="mb-1 fw-500">
										{t("ratio")}*
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
								{itemId ? t("update") : t("create")}
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
