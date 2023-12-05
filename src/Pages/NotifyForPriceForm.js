import React, { useState } from "react";
import ReactSelectOption from "../Components/ReactSelectOption";
import { useDebounce } from "use-debounce";
import { useEffect } from "react";
import { Row, Col, Table, Button, Card } from "react-bootstrap";
import Api from "../Api";
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../redux/actions/itemActions";
import { newPath, onNumberChange, onSelectOptionChange } from "../helper";
import { IoCloseSharp } from "react-icons/io5";

const directions = [
	{
		id: "Positive",
		name: true,
	},
	{
		id: "Negative",
		name: false,
	},
];

export default function Components(props) {
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
				conId: "",
				name: "",
				desiredPercent: "",
				undesiredPercent: "",
				direction: false,
				price: "",
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
			typeof analizeInstrumentFormFields.desiredPercent === "number" &&
			typeof analizeInstrumentFormFields.undesiredPercent === "number"
		) {
			if (itemId) analizeInstrumentFormFields.id = +itemId;
			try {
				dispatch(setIsLoading(true));
				await (itemId
					? Api.updatePriceChangeNotifier(analizeInstrumentFormFields)
					: Api.createPriceChangeNotifier(analizeInstrumentFormFields));
				navigate(newPath("/notify-for-price"));
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
							<h3 className="text-muted">(Notify for one price form)</h3>
						</div>
						{!itemId ? (
							<div>
								<div className="form-group mb-2">
									{secTypes && secTypes.length && (
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
						{!!itemId && !!fields && (
							<Row>
								<Col lg={12}>
									<Card className="card">
										<Card.Header className="d-flex justify-content-between gap-1 align-items-center">
											<h5>Compamy name &rarr; {fields?.name}</h5>
										</Card.Header>
										<ul className="list-group not_rounded">
											<li className="list-group-item">
												Price &rarr; {fields?.price}
											</li>
											<li className="list-group-item">
												Desired price &rarr; {fields?.desiredPrice}
											</li>
											<li className="list-group-item">
												Desired percent &rarr; {fields?.desiredPercent}
											</li>
											<li className="list-group-item">
												Undesired price &rarr; {fields?.undesiredPrice}
											</li>
											<li className="list-group-item">
												Undesired percent &rarr; {fields?.undesiredPercent}
											</li>
											<li className="list-group-item">
												Date &rarr; {fields?.priceDate}
											</li>
											<li className="list-group-item">
												Id &rarr; {fields?.conId}
											</li>
										</ul>
									</Card>
								</Col>
							</Row>
						)}

						{data && (
							<Row>
								<Col lg={12}>
									<Card className="card">
										<Card.Header className="d-flex justify-content-between gap-1 align-items-center">
											<h5>Compamy name &rarr; {data?.companyName}</h5>
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
												Price &rarr; {data?.price}
											</li>
											<li className="list-group-item">
												Date &rarr; {data?.priceDate}
											</li>
											<li className="list-group-item">
												Id &rarr; {data?.conId}
											</li>
										</ul>
									</Card>
								</Col>
							</Row>
						)}

						{securities && securities.length && !itemId && !data ? (
							<Table responsive className="table table-striped mb-0">
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
											Desired Percentage*
										</label>
										<input
											type="number"
											className="form-control"
											id="changePercentage"
											value={analizeInstrumentFormFields.desiredPercent}
											onChange={event =>
												onNumberChange(
													event,
													setAnalizeInstrumentFormFields,
													"desiredPercent",
													100,
												)
											}
										/>
									</div>
									<div className="form-group mb-2">
										<label
											htmlFor="deviationPercentage"
											className="mb-1 fw-500">
											Undesired Percentage*
										</label>
										<input
											type="number"
											className="form-control"
											id="deviationPercentage"
											value={analizeInstrumentFormFields.undesiredPercent}
											onChange={event =>
												onNumberChange(
													event,
													setAnalizeInstrumentFormFields,
													"undesiredPercent",
													100,
												)
											}
										/>
									</div>
									<div className="form-group mb-2">
										<label
											htmlFor="deviationPercentage"
											className="mb-1 fw-500">
											Price
										</label>
										<input
											type="number"
											className="form-control"
											id="deviationPercentage"
											value={analizeInstrumentFormFields.price}
											onChange={event =>
												onNumberChange(
													event,
													setAnalizeInstrumentFormFields,
													"price",
												)
											}
										/>
									</div>
									<div className="form-group mb-2">
										<label
											htmlFor="deviationPercentage"
											className="mb-1 fw-500">
											Direction
										</label>
										<div className="custom-control custom-checkbox">
											<input
												type="checkbox"
												className="custom-control-input mr-2"
												id="customCheck1"
												checked={
													analizeInstrumentFormFields.direction ? true : false
												}
												onChange={e => {
													setAnalizeInstrumentFormFields(prev => ({
														...prev,
														direction: e.target.checked,
													}));
												}}
											/>
											<label
												className="custom-control-label"
												htmlFor="customCheck1">
												Positive
											</label>
										</div>
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
									typeof analizeInstrumentFormFields.desiredPercent !==
										"number" ||
									typeof analizeInstrumentFormFields.undesiredPercent !==
										"number" ||
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
		let responseOneInstrumentNotifierById;
		if (itemId) {
			responseOneInstrumentNotifierById = await Api.getPriceChangeNotifierID(
				+itemId,
			);
		}
		return {
			secTypes: responseSecurityTypes.data || [],
			fields: responseOneInstrumentNotifierById?.data || null,
		};
	} catch (error) {
		console.error(error);
	}
};
export const NotifyForPriceForm = Object.assign(Components, { loader });
