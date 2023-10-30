import moment from "moment";

export const convertDateFormat = (dateStr) => {
  const inputMoment = moment(dateStr);
  if (!inputMoment.isValid()) {
    return "Invalid Date";
  }
  const formattedDate = inputMoment.format("DD.MM.YYYY HH:mm");
  return formattedDate;
};
export const onNumberChange = (event, cb, name, maxValue = Infinity) => {
  if (
    event.target.value.includes("e") ||
    event.target.value.includes(".") ||
    event.target.value.includes("-") ||
    event.target.value === "0"
  ) {
    cb((prevFields) => ({
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
    cb((prevFields) => ({
      ...prevFields,
      [name]: event.target.value ? +event.target.value : "",
    }));
    return false;
  }
};
export const onSelectOptionChange = (item, cb, name) => {
  cb((values) => ({
    ...values,
    [name]: item.value,
  }));
};
