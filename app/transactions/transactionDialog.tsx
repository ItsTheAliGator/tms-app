// The dialog used for creating and updating transactions. Seperated from the main component for better readability.

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";
import { Nullable } from "primereact/ts-helpers";
import { Transaction } from "../types/transaction";

/**
 * Props for the TransactionDialog component.
 */
interface TransactionDialogProps {
	/**
	 * Determines whether the transaction dialog is visible or not.
	 */
	transactionDialog: boolean;

	/**
	 * Callback function to hide the transaction dialog.
	 */
	hideDialog: () => void;

	/**
	 * The transaction object.
	 */
	transaction: Transaction;

	/**
	 * Callback function to handle input change events.
	 * @param e - The change event object.
	 * @param name - The name of the input field.
	 */
	onInputChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;

	/**
	 * Callback function to handle date change events.
	 * @param date - The new date value.
	 */
	onDateChange: (date: Nullable<Date>) => void;

	/**
	 * Callback function to handle input number change events.
	 * @param e - The change event object.
	 * @param name - The name of the input number field.
	 */
	onInputNumberChange: (e: InputNumberValueChangeEvent, name: string) => void;

	/**
	 * Callback function to save the transaction.
	 */
	saveTransaction: () => void;

	/**
	 * Determines whether the transaction has been submitted or not.
	 */
	submitted: boolean;
}

const TransactionDialog: React.FC<TransactionDialogProps> = ({ transactionDialog, hideDialog, transaction, onInputChange, onDateChange, onInputNumberChange, saveTransaction, submitted }) => {
	const transactionDialogFooter = (
		<React.Fragment>
			<Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
			<Button label="Save" icon="pi pi-check" onClick={saveTransaction} />
		</React.Fragment>
	);

	return (
		<Dialog visible={transactionDialog} style={{ width: "32rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} header="Transaction Details" modal className="p-fluid" footer={transactionDialogFooter} onHide={hideDialog}>
			<div className="field">
				<label htmlFor="title" className="font-bold">
					Title
				</label>
				<InputText id="title" value={transaction.title} onChange={(e) => onInputChange(e, "title")} required autoFocus />
			</div>
			<div className="field">
				<label htmlFor="date" className="font-bold">
					Date
				</label>
				<Calendar id="date" value={new Date(transaction.date)} onChange={(e) => onDateChange(e.value)} required />
			</div>
			<div className="field">
				<label htmlFor="description" className="font-bold">
					Description
				</label>
				<InputText id="description" value={transaction.description} onChange={(e) => onInputChange(e, "description")} required />
			</div>
			<div className="field">
				<label htmlFor="total_amount" className="font-bold">
					Total Amount
				</label>
				<InputNumber id="total_amount" value={transaction.total_amount} onValueChange={(e) => onInputNumberChange(e, "total_amount")} mode="currency" currency="EUR" locale="nl-NL" required />
			</div>
		</Dialog>
	);
};

export default TransactionDialog;
