import React, { useState } from "react";
import ReactSelectOption from "../Components/ReactSelectOption";
import { useDebounce } from "use-debounce";
import { useEffect } from "react";
import { Row, Col, Table } from "react-bootstrap";
import Api from "../Api";
import {
	convertDateFormat,
	onNumberChange,
	onSelectOptionChange,
} from "../helper";
import { useLoaderData } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../redux/actions/itemActions";

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
			<section style={{ marginTop: "80px", marginBottom: "80px" }}>
				<Row>
					<Col lg={12}>
						<div className="d-flex flex-wrap-reverse justify-content-between">
							<h3>Search Instrument</h3>
							<h3 className="text-muted">(Two Instrument Analizer)</h3>
						</div>
						<div>
							<div className="form-group mb-2">
								{secTypes && secTypes.length ? (
									<div>
										<label className="mb-1 fw-500">Choose Security Type*</label>
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

						{securities && securities.length ? (
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
						{_securities && _securities.length ? (
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
									<div className="form-group mb-2">
										{barTypes && barTypes.length ? (
											<div>
												<label className="mb-1 fw-500">Choose Bar*</label>
												<ReactSelectOption
													value={analizeInstrumentFormFields.bar}
													isSearchable={true}
													selectedValue={(() => {
														const selectedItem = {
															...barTypes.find(
																data =>
																	data.name === analizeInstrumentFormFields.bar,
															),
														};
														if (Object.keys(selectedItem).length) {
															selectedItem.label = selectedItem.id;
															selectedItem.value = selectedItem.name;
															return selectedItem;
														} else {
															return { value: null, label: "Choose" };
														}
													})()}
													items={barTypes.map(data => ({
														...data,
														label: data.id,
														value: data.name,
													}))}
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

						{analysisResult && analysisResult.length ? (
							<Table responsive className="table table-striped mb-0">
								<thead>
									<tr className="cursor-default">
										<th className="nowrap">#</th>
										<th className="nowrap">Date</th>
										<th className="nowrap">Price 1</th>
										<th className="nowrap">Price 2</th>
										<th className="nowrap">Computed Ratio</th>
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
								Analize
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
