// import { confirmAlert } from 'react-confirm-alert';
// import warningSvg from "../assets/icons/warning.svg";
// import {
// 	Button,
// 	Modal,
// 	ModalBody,
// 	ModalFooter,
// 	ModalHeader,
// } from "react-bootstrap";
import { toast } from "react-toastify";

const getAlertType = (type, cb, error) => {
	if (!type) {
		cb.error(error);
	}
	switch (type) {
		case "info":
			return cb.info(error, { position: toast.POSITION.TOP_RIGHT });
		case "success":
			return cb.success(error, { position: toast.POSITION.TOP_RIGHT });
		case "warning":
			return cb.warning(error, { position: toast.POSITION.TOP_RIGHT });
		case "error":
			return cb.error(error, { position: toast.POSITION.TOP_RIGHT });
		default:
			break;
	}
};

export default class AlertService {
	static checkMessageType = respcode => {
		switch (respcode) {
			case 0:
				return "success";
			case 1:
				return "error";
			case 2:
				return "warning";
			case 3:
				return "info";
			default:
				return "error";
		}
	};

	static alert = (type, error) => {
		const respMessage =
			typeof error === "object" ? error.message || error.respmess : error;
		if (!respMessage) {
			return false;
		}
		getAlertType(type, toast, respMessage);
	};
	// static alertConfirm = (title, message, yes, no) => {
	// 	return new Promise((resolve, reject) => {
	// 		confirmAlert({
	// 			customUI: ({ onClose, closeOnEscape }) => {
	// 				return (
	// 					<Modal
	// 						show={true}
	// 						centered
	// 						onHide={() => {
	// 							onClose();
	// 							reject();
	// 						}}
	// 						keyboard={false}
	// 						className="aaaaaaaaaa">
	// 						<ModalHeader>
	// 							<h3>{title}</h3>
	// 						</ModalHeader>
	// 						{message ? <ModalBody>{message}</ModalBody> : null}
	// 						<ModalFooter>
	// 							<Button
	// 								variant="outline-secondary"
	// 								onClick={() => {
	// 									onClose();
	// 								}}>
	// 								No
	// 							</Button>
	// 							<Button
	// 								onClick={() => {
	// 									onClose();
	// 									resolve(true);
	// 								}}>
	// 								Yes
	// 							</Button>
	// 						</ModalFooter>
	// 					</Modal>
	// 				);
	// 			},
	// 		});
	// 	});
	// };
}
