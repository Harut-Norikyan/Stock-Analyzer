import { Dowen, Up } from "../assets";

const Switch = ({
	isOn = true,
	handleToggle = () => {},
	colorOne = "rgb(12 131 34 / 71%)",
	colorTwo = "rgb(255 152 0 / 71%)",
}) => {
	return (
		<>
			<input
				checked={isOn}
				onChange={handleToggle}
				className="switch-checkbox"
				id={`switch`}
				type="checkbox"
			/>
			<label
				style={{ background: isOn ? colorOne : colorTwo }}
				className="switch-label"
				htmlFor={`switch`}>
				<span className={`switch-button`} />
				<div className="d-flex justify-content-between d-flex align-items-center w-100 p-2">
					<Up style={{ width: 19, height: 19 }} />
					<Dowen style={{ width: 19, height: 19 }} />
				</div>
			</label>
		</>
	);
};
export default Switch;
