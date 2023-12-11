import moment from "moment";

export const convertDateFormat = (dateStr, divisionOfWords = false) => {
	if (!dateStr) return "";
	const inputMoment = moment(dateStr);
	if (!inputMoment.isValid()) {
		return "Invalid Date";
	}
	if (divisionOfWords) {
		const deyFormat = inputMoment.format("DD.MM.YYYY");
		const hourFormat = inputMoment.format("HH:mm");
		return (
			<>
				<span style={{ display: "block" }}>{deyFormat}</span>
				<span>{hourFormat}</span>
			</>
		);
	}
	const formattedDate = inputMoment.format("DD.MM.YYYY HH:mm");
	return formattedDate;
};
export const onNumberChange = (event, cb, name, maxValue = Infinity) => {
	if (
		event.target.value.includes("e") ||
		event.target.value.includes("-") ||
		event.target.value === "0"
	) {
		cb(prevFields => ({
			...prevFields,
			[name]: "",
		}));
		return false;
	}
	if (
		event.target.value === "" ||
		(typeof +event.target.value === "number" &&
			Number(event.target.value) &&
			+event.target.value <= maxValue)
	) {
		cb(prevFields => ({
			...prevFields,
			[name]: event.target.value ? +event.target.value : "",
		}));
		return false;
	}
};
export const onSelectOptionChange = (item, cb, name) => {
	cb(values => ({
		...values,
		[name]: item.value,
	}));
};

export function newPath(path = "", lang) {
	if (lang) {
		const newPath = window.location.href.split("/").splice(4).join("/");
		localStorage.setItem("i18nextLng", lang);
		return `/${lang}/${newPath}`;
	}
	if (!path) {
		return (
			localStorage.getItem("i18nextLng") || process.env.REACT_APP_DEFAULT_LANG
		);
	}
	return `/${
		localStorage.getItem("i18nextLng") || process.env.REACT_APP_DEFAULT_LANG
	}${path}`;
}
