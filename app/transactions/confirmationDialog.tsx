// The dialog used for confirming actions. Seperated from the main component for better readability.

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

/**
 * Props for the ConfirmDialog component.
 */
interface ConfirmationDialogProps {
	/**
	 * Determines whether the dialog is visible or not.
	 */
	visible: boolean;

	/**
	 * The header text of the dialog.
	 */
	header: string;

	/**
	 * The message text of the dialog.
	 */
	message: string;

	/**
	 * Callback function to be called when the dialog is hidden.
	 */
	onHide: () => void;

	/**
	 * Callback function to be called when the confirm button is clicked.
	 */
	onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmationDialogProps> = ({ visible, header, message, onHide, onConfirm }) => {
	const footer = (
		<React.Fragment>
			<Button label="No" icon="pi pi-times" outlined onClick={onHide} />
			<Button label="Yes" icon="pi pi-check" severity="danger" onClick={onConfirm} />
		</React.Fragment>
	);

	return (
		<Dialog visible={visible} style={{ width: "32rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} header={header} modal footer={footer} onHide={onHide}>
			<div className="confirmation-content">
				<i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
				<span>{message}</span>
			</div>
		</Dialog>
	);
};

export default ConfirmDialog;
