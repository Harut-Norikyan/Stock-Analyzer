import React, { useState } from "react";
import ReactSelectOption from "../Components/ReactSelectOption";
import { useDebounce } from "use-debounce";
import { useEffect } from "react";
import { Row, Col, Table, Button, Card } from "react-bootstrap";
import Api from "../Api";
import { useParams, useNavigate, useLoaderData, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../redux/actions/itemActions";
import { newPath, onNumberChange, onSelectOptionChange } from "../helper";
import { IoCloseSharp } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import Switch from "../Components/Switch";

export default function Components(props) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { isLoading } = useSelector(state => state.isLoading);

	const [searchFormFields, setSearchFormFields] = useState({
		secType: "",
		name: false,
		symbol: "",
	});
	const { secTypes, fields } = useLoaderData();

	const [analizeInstrumentFormFields, setAnalizeInstrumentFormFields] =
		useState(
			fields || {
				conId: null,
				name: "",
				changePercentage: "",
				deviationPercentage: "",
				direction: true,
			},
		);

	let { itemId } = useParams();
	const navigate = useNavigate();

	const [securities, setSecurities] = useState([]);
	const [data, setData] = useState(null);
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
					if (response && response.data) {
						setSecurities(response.data);
					} else {
						setSecurities([]);
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

	const onSubmit = async () => {
		if (
			analizeInstrumentFormFields.conId &&
			analizeInstrumentFormFields.name &&
			typeof analizeInstrumentFormFields.changePercentage === "number" &&
			typeof analizeInstrumentFormFields.deviationPercentage === "number"
		) {
			if (itemId) analizeInstrumentFormFields.id = +itemId;
			try {
				dispatch(setIsLoading(true));
				await (itemId
					? Api.updateOneInstrumentNotifier(analizeInstrumentFormFields)
					: Api.createOneInstrumentNotifier(analizeInstrumentFormFields));
				navigate(newPath("/notify-for-one-instrument"));
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
								{t("notifyForOneInstrumentFormSubTitle")}
							</h3>
						</div>
						<Link
							className="btn btn-primary btn-sm btn-lg px-3 mb-3"
							to={newPath("/notify-for-one-instrument")}
							role="button">
							{t("back")}
						</Link>
						{!itemId ? (
							<div>
								<div className="form-group mb-2">
									{secTypes && secTypes.length && (
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
									)}
								</div>

								<div className="form-check mt-3 mb-2">
									<input
										className="form-check-input"
										type="checkbox"
										id="flexCheckDefault"
										name="flexCheckDefault"
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
						) : null}

						{data && (
							<Row>
								<Col lg={12}>
									<Card className="card">
										<Card.Header className="d-flex justify-content-between gap-1 align-items-center">
											<h5>
												{t("companyName")} &rarr; {data?.companyName}
											</h5>
											<Button
												onClick={() => {
													setData(null);
													setAnalizeInstrumentFormFields({
														conId: null,
														name: "",
														changePercentage: "",
														deviationPercentage: "",
														direction: true,
													});
												}}
												variant="outline-dark">
												<IoCloseSharp />
											</Button>
										</Card.Header>
										<ul className="list-group not_rounded">
											<li className="list-group-item">
												{t("price")} &rarr; {data?.price}
											</li>
											<li className="list-group-item">
												{t("date")} &rarr; {data?.priceDate}
											</li>
											<li className="list-group-item">
												{t("conid")} &rarr; {data?.conId}
											</li>
										</ul>
									</Card>
								</Col>
							</Row>
						)}

						{securities && securities.length && !itemId && !data ? (
							<Table responsive striped bordered className=" mb-0">
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
																setData(res.data);
															} else {
																setData(item);
															}
														})
														.catch(err => {
															console.log(err);
														})
														.finally(() => dispatch(setIsLoading(false)));
													setAnalizeInstrumentFormFields(prevFields => ({
														...prevFields,
														conId: item.conId,
														name: item.companyName,
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
															name="conId"
															checked={
																analizeInstrumentFormFields.conId === item.conId
																	? true
																	: false
															}
															onChange={() => {
																setAnalizeInstrumentFormFields(prevFields => ({
																	...prevFields,
																	conId: item.conId,
																	name: item.companyName,
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
						) : null}

						{analizeInstrumentFormFields.conId || itemId ? (
							<div className="mt-3">
								<div className="mb-4">
									<div className="form-group mb-2">
										<label htmlFor="changePercentage" className="mb-1 fw-500">
											{t("changePercentage")}*
										</label>
										<input
											type="number"
											className="form-control"
											id="changePercentage"
											value={analizeInstrumentFormFields.changePercentage}
											onChange={event =>
												onNumberChange(
													event,
													setAnalizeInstrumentFormFields,
													"changePercentage",
													100,
												)
											}
										/>
									</div>
									<div className="form-group mb-2">
										<label
											htmlFor="deviationPercentage"
											className="mb-1 fw-500">
											{t("deviationPercentage")}*
										</label>
										<input
											type="number"
											className="form-control"
											id="deviationPercentage"
											value={analizeInstrumentFormFields.deviationPercentage}
											onChange={event =>
												onNumberChange(
													event,
													setAnalizeInstrumentFormFields,
													"deviationPercentage",
													100,
												)
											}
										/>
									</div>
									<div>
										<label className="mb-1 fw-500">{t("direction")}*</label>
										<Switch
											isOn={analizeInstrumentFormFields?.direction}
											handleToggle={() => {
												setAnalizeInstrumentFormFields(prev => ({
													...prev,
													direction: !prev.direction,
												}));
											}}
										/>
									</div>
								</div>
							</div>
						) : null}
						<div className="d-flex justify-content-end mt-3">
							<button
								type="button"
								className="btn btn-primary px-4"
								disabled={
									!analizeInstrumentFormFields.conId ||
									!analizeInstrumentFormFields.name ||
									typeof analizeInstrumentFormFields.changePercentage !==
										"number" ||
									typeof analizeInstrumentFormFields.deviationPercentage !==
										"number" ||
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
		let responseOneInstrumentNotifierById;
		if (itemId) {
			responseOneInstrumentNotifierById =
				await Api.getOneInstrumentNotifierById(+itemId);
		}
		return {
			secTypes: responseSecurityTypes.data || [],
			fields: responseOneInstrumentNotifierById?.data || null,
		};
	} catch (error) {
		console.error(error);
	}
};
export const NotifyForOneInstrumentForm = Object.assign(Components, { loader });
