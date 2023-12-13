import React, { useState } from "react";
import ReactSelectOption from "../Components/ReactSelectOption";
import { useDebounce } from "use-debounce";
import { useEffect } from "react";
import { Row, Col, Table, Card, Button } from "react-bootstrap";
import Api from "../Api";
import {
	convertDateFormat,
	newPath,
	onNumberChange,
	onSelectOptionChange,
} from "../helper";
import { Link, useLoaderData, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../redux/actions/itemActions";
import { IoCloseSharp } from "react-icons/io5";
import { Arrow } from "../assets";
import { useTranslation } from "react-i18next";

const barTypesRu = [
	{
		id: "1 Минута",
		name: "1min",
	},
	{
		id: "2 Минутаы",
		name: "2min",
	},
	{
		id: "3 Минутаы",
		name: "3min",
	},
	{
		id: "5 Минуты",
		name: "5min",
	},
	{
		id: "10 Минут",
		name: "10min",
	},
	{
		id: "15 Минут",
		name: "15min",
	},
	{
		id: "30 Минут",
		name: "30min",
	},
	{
		id: "1 Час",
		name: "1h",
	},
	{
		id: "2 Часа",
		name: "2h",
	},
	{
		id: "3 Часа",
		name: "3h",
	},
	{
		id: "4 Часа",
		name: "4h",
	},
	{
		id: "8 Часоов",
		name: "8h",
	},
	{
		id: "1 День",
		name: "1d",
	},
	{
		id: "1 Неделя",
		name: "1w",
	},
	{
		id: "1 Месяц",
		name: "1m",
	},
];

const barTypes = [
	{
		id: "1 Minute",
		name: "1min",
	},
	{
		id: "2 Minute",
		name: "2min",
	},
	{
		id: "3 Minute",
		name: "3min",
	},
	{
		id: "5 Minute",
		name: "5min",
	},
	{
		id: "10 Minute",
		name: "10min",
	},
	{
		id: "15 Minute",
		name: "15min",
	},
	{
		id: "30 Minute",
		name: "30min",
	},
	{
		id: "1 Hour",
		name: "1h",
	},
	{
		id: "2 Hour",
		name: "2h",
	},
	{
		id: "3 Hour",
		name: "3h",
	},
	{
		id: "4 Hour",
		name: "4h",
	},
	{
		id: "8 Hour",
		name: "8h",
	},
	{
		id: "1 Day",
		name: "1d",
	},
	{
		id: "1 Week",
		name: "1w",
	},
	{
		id: "1 Month",
		name: "1m",
	},
];

function Components(props) {
	const { t } = useTranslation();
	const { lang } = useParams();
	const dispatch = useDispatch();
	const { isLoading } = useSelector(state => state.isLoading);
	const [searchFormFields, setSearchFormFields] = useState({
		secType: "",
		name: false,
		symbol: "",
	});

	const [analizeInstrumentFormFields, setAnalizeInstrumentFormFields] =
		useState({
			conId1: null,
			conId2: null,
			startDate: "",
			endDate: "",
			bar: "",
			ratio: "",
		});

	const [securities, setSecurities] = useState([]);
	const [_securities, _setSecurities] = useState([]);
	const secTypes = useLoaderData();
	const [analysisResult, setAnalysisResult] = useState([]);
	const [firstData, setFirstdata] = useState(null);
	const [secondData, setSecondData] = useState(null);

	const [searchFormDebounced] = useDebounce(searchFormFields, 500);
	const [analizeInstrumentFormDebounced] = useDebounce(
		analizeInstrumentFormFields,
		500,
	);

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
	}, [searchFormDebounced, dispatch]);

	const analizeData = async () => {
		if (
			(analizeInstrumentFormDebounced.startDate ||
				analizeInstrumentFormDebounced.endDate) &&
			analizeInstrumentFormDebounced.bar &&
			typeof analizeInstrumentFormDebounced.ratio === "number"
		) {
			try {
				dispatch(setIsLoading(true));

				const response = await Api.twoInstrumentsAnalyzer(
					analizeInstrumentFormDebounced,
				);
				if (response && response.data) {
					setAnalysisResult(response.data);
				} else {
					setAnalysisResult([]);
				}
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
							<h3 className="text-muted">
								{t("twoInstrumentsAnalizersubTitle")}
							</h3>
						</div>
						<Link
							className="btn btn-primary btn-sm btn-lg mb-3 px-3"
							to={newPath(" ")}
							role="button">
							{t("back")}
						</Link>
						<div>
							<div className="form-group mb-2">
								{secTypes && secTypes.length ? (
									<div>
										<label className="mb-1 fw-500">
											{t("searchSecurityType")}*
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
						{firstData && (
							<Row className="mt-4">
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
						{securities && securities.length && !firstData ? (
							<div className="mt-4">
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
														setSearchFormFields(prevFields => ({
															...prevFields,
															// symbol: "",
														}));
														setAnalizeInstrumentFormFields(prevFields => ({
															...prevFields,
															conId1: item.conId,
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
							analizeInstrumentFormFields.conId2 && (
								<div className="d-flex justify-content-center w-100 my-2">
									<Button
										variant="light"
										onClick={() => {
											// debugger;
											const cloneFirstData = firstData;
											const cloneSecondData = secondData;
											const cloneSecurities = securities;
											const _cloneSecurities = _securities;
											console.log(
												cloneFirstData,
												"firstData",
												cloneSecondData,
												"secondData",
												cloneSecurities,
												_cloneSecurities,
											);
											setSecurities(_cloneSecurities);
											_setSecurities(cloneSecurities);
											setFirstdata(cloneSecondData);
											setSecondData(cloneFirstData);
											setAnalizeInstrumentFormFields(prev => ({
												...prev,
												conId2: prev.conId1,
												conId1: prev.conId2,
											}));
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
						{_securities && _securities.length && !secondData ? (
							<div className="mt-3">
								<h4>{t("twoInstrumentsAnalizerSecondInstrument")}*</h4>
								<Table responsive bordered striped className="border mb-0">
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
																onChange={() => {}}
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
									<div className="form-group mb-2">
										{barTypes && barTypes.length ? (
											<div>
												<label className="mb-1 fw-500">{t("chooseBar")}*</label>
												<ReactSelectOption
													value={analizeInstrumentFormFields.bar}
													isSearchable={true}
													selectedValue={(() => {
														let selectedItem;
														if (lang === "ru") {
															selectedItem = {
																...barTypesRu.find(
																	data =>
																		data.name ===
																		analizeInstrumentFormFields.bar,
																),
															};
														} else {
															selectedItem = {
																...barTypes.find(
																	data =>
																		data.name ===
																		analizeInstrumentFormFields.bar,
																),
															};
														}
														if (Object.keys(selectedItem).length) {
															selectedItem.label = selectedItem.id;
															selectedItem.value = selectedItem.name;
															return selectedItem;
														} else {
															return { value: null, label: t("choose") };
														}
													})()}
													items={
														lang === "ru"
															? barTypesRu.map(data => ({
																	...data,
																	label: data.id,
																	value: data.name,
															  }))
															: barTypes.map(data => ({
																	...data,
																	label: data.id,
																	value: data.name,
															  }))
													}
													onChange={item =>
														onSelectOptionChange(
															item,
															setAnalizeInstrumentFormFields,
															"bar",
														)
													}
												/>
											</div>
										) : null}
									</div>
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
						) : null}

						{analysisResult && analysisResult.length ? (
							<Table responsive striped bordered className="mb-0">
								<thead>
									<tr className="cursor-default">
										<th className="nowrap">#</th>
										<th className="nowrap">{t("date")}</th>
										<th className="nowrap">{t("price")} 1</th>
										<th className="nowrap">{t("price")} 2</th>
										<th className="nowrap">{t("computedRatio")}</th>
									</tr>
								</thead>
								<tbody>
									{analysisResult.map((item, index) => {
										return (
											<tr key={index}>
												<td>
													<p className="word-break-break-word max-line-3 m-0">
														{index + 1}
													</p>
												</td>
												<td>
													<p className="word-break-break-word max-line-3 m-0">
														{convertDateFormat(item.dateTime)}
													</p>
												</td>
												<td>
													<p className="word-break-break-word max-line-3 m-0">
														{item.price1}
													</p>
												</td>
												<td>
													<p className="word-break-break-word max-line-3 m-0">
														{item.price2}
													</p>
												</td>
												<td>
													<p className="word-break-break-word max-line-3 m-0">
														{item.computedRatio}
													</p>
												</td>
											</tr>
										);
									})}
								</tbody>
							</Table>
						) : null}
						<div className="d-flex justify-content-end mt-3">
							<button
								type="button"
								className="btn btn-primary px-4"
								disabled={
									!analizeInstrumentFormFields.conId2 ||
									!analizeInstrumentFormFields.conId2 ||
									!analizeInstrumentFormFields.startDate ||
									!analizeInstrumentFormFields.bar ||
									typeof analizeInstrumentFormDebounced.ratio !== "number" ||
									isLoading
								}
								onClick={analizeData}>
								{t("analize")}
							</button>
						</div>
					</Col>
				</Row>
			</section>
		</>
	);
}
const loader = async () => {
	try {
		const response = await Api.getSecurityTypes({
			secType: "",
			name: false,
			symbol: "",
		});
		if (response && response.data) {
			return response.data;
		} else {
			return [];
		}
	} catch (error) {
		console.error(error);
	}
};
export const TwoInstrumentsAnalizer = Object.assign(Components, { loader });
