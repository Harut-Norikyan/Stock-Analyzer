import React, { useState, useEffect } from "react";
import { Api } from "./Api";

export default function Form() {
	var isRequestInProcess = false;
	const [nextUrl, setNextUrl] = useState("");
	const [tickers, setTickers] = useState([]);
	const [ticker, setTicker] = useState("");
	const [percent, setPercent] = useState(1);
	const [startDate, setStartDate] = useState("");
	const [isInvalidSubmit, setIsInvalidSubmit] = useState(false);
	const [isShowNextButtonSpinner, setIsShowNextButtonSpinner] = useState("");
	const [isShowSaveButtonSpinner, setIsShowSaveButtonSpinner] = useState("");

	useEffect(() => {
		getTickers();
	}, []);

	const onNumberChange = (event, cb, maxValue = null) => {
		if (event.target.value.includes("e") || event.target.value.includes(".")) {
			return false;
		}
		if (
			event.target.value === "" ||
			(typeof +event.target.value === "number" &&
				+event.target.value > 0 &&
				+event.target.value <= maxValue)
		) {
			cb(event.target.value);
		}
	};

	const getToday = () => {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1; //January is 0!
		var yyyy = today.getFullYear();
		if (dd < 10) {
			dd = "0" + dd;
		}
		if (mm < 10) {
			mm = "0" + mm;
		}
		return (today = yyyy + "-" + mm + "-" + dd);
	};

	const onDateChange = (event, cb) => {
		cb(event.target.value);
	};

	const getTickers = bool => {
		if (isRequestInProcess) {
			return false;
		}
		isRequestInProcess = true;
		if (bool) {
			setIsShowNextButtonSpinner(true);
		}
		const form = {
			nextUrl,
		};
		Api.getTickers(form)
			.then(response => {
				if (response && response.data) {
					const data = { ...response.data };
					setTickers(data.results);
					setNextUrl(data.nextUrl);
				}
				setTicker("");
				setIsShowNextButtonSpinner(false);
				isRequestInProcess = false;
			})
			.catch(error => {
				console.error(error);
				setIsShowNextButtonSpinner(false);
				isRequestInProcess = false;
			});
	};

	const analizeForm = () => {
		if (!percent || !startDate) {
			setIsInvalidSubmit(true);
			return false;
		}
		setIsShowSaveButtonSpinner(true);
		const form = {
			percent,
			date: startDate,
			ticker,
		};
		Api.analizeForm(form)
			.then(response => {
				setIsShowSaveButtonSpinner(false);
			})
			.catch(error => {
				console.error(error);
				setIsShowSaveButtonSpinner(false);
			});
	};

	return (
		<div className="container my-5 p-2 border border-radius-5">
			<div className="row">
				<div className="col-12">
					<h2>Form</h2>
				</div>
				<div className="col-12">
					<hr />
				</div>
				{tickers && tickers.length
					? tickers.map((tickerItem, index) => {
							return (
								<div
									key={index}
									className="col-sm-12 col-md-6 col-lg-4 my-2 cursor-pointer"
									onClick={() => {
										setTicker(tickerItem.ticker);
									}}>
									<div
										className={`card w-100 ${
											ticker === tickerItem.ticker ? "active-ticker" : ""
										}`}>
										<div className="card-header">{tickerItem.ticker}</div>
										<ul className="list-group list-group-flush">
											<li className="list-group-item">{tickerItem.name}</li>
											<li className="list-group-item">{tickerItem.market}</li>
										</ul>
									</div>
								</div>
							);
					  })
					: null}
				<div className="col-12">
					<hr />
				</div>

				<div className="col-12">
					<div className="row">
						<div className="col-md-6">
							<div className="form-group">
								<label htmlFor="percent" className="cursor-pointer mb-1">
									Percent *
								</label>
								<input
									id="percent"
									type="number"
									value={percent}
									className={`form-control ${
										isInvalidSubmit && !percent ? "error-bordered" : ""
									}`}
									aria-describedby="emailHelp"
									placeholder="Percent"
									onChange={event => onNumberChange(event, setPercent, 100)}
								/>
								{/* <small id="emailHelp" className="form-text text-muted">
									Lorem Ipsum is simply dummy text of the printing and
									typesetting industry.
								</small> */}
							</div>
						</div>
						<div className="col-md-6">
							<div className="form-group">
								<label htmlFor="date" className="cursor-pointer mb-1">
									Date *
								</label>
								<input
									id="date"
									type="date"
									className={`form-control ${
										isInvalidSubmit && !startDate ? "error-bordered" : ""
									}`}
									aria-describedby="emailHelp"
									placeholder="Date"
									value={startDate}
									max={getToday()}
									onChange={event => onDateChange(event, setStartDate)}
								/>
								{/* <small id="emailHelp" className="form-text text-muted">
									Lorem Ipsum is simply dummy text of the printing and
									typesetting industry.
								</small> */}
							</div>
						</div>
					</div>
				</div>

				<div className="col-12">
					<hr />
				</div>

				<div className="col-12">
					<div className="d-flex justify-content-end mb-1">
						{ticker ? (
							<button
								type="button"
								className={`btn btn-success position-relative save-button mx-1 
                      ${
												isShowSaveButtonSpinner || isShowNextButtonSpinner
													? "disabled"
													: ""
											}
                    `}
								onClick={analizeForm}>
								{isShowSaveButtonSpinner ? (
									<span className="spin"></span>
								) : (
									"Done"
								)}
							</button>
						) : null}

						<button
							type="button"
							className={`btn btn-primary position-relative  next-button mx-1 
                ${
									isShowSaveButtonSpinner || isShowNextButtonSpinner
										? "disabled"
										: ""
								}
              `}
							onClick={() => getTickers(true)}>
							{isShowNextButtonSpinner ? (
								<span className="spin"></span>
							) : (
								"Next"
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
