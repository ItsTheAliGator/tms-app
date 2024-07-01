"use client";

import { useState, useEffect, useRef } from "react";
import { Transaction } from "../types/transaction";
import { getTransactions, createTransaction, deleteTransactions, updateTransaction } from "./actions";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import React from "react";
import { InputNumberValueChangeEvent } from "primereact/inputnumber";
import { Nullable } from "primereact/ts-helpers";
import { formatCurrency, formatDate } from "./utils";
import TransactionDialog from "./transactionDialog";
import ConfirmationDialog from "./confirmationDialog";

// Define the initial empty transaction
const emptyTransaction: Transaction = {
	id: undefined,
	title: "",
	date: new Date().toLocaleString(),
	description: "",
	total_amount: 0,
};

export default function TransactionsTable() {
	const [transactions, setTransactions] = useState<Transaction[]>([]); // Creating a state to store the transactions
	const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]); // Creating a state to store the selected transactions
	const [globalFilter, setGlobalFilter] = useState<string>(""); // Creating a state to store the global filter
	const toast = useRef<Toast>(null); // Creating a ref to the toast component
	const dt = useRef<DataTable<Transaction[]>>(null); // Creating a ref to the datatable component
	const [deleteTransactionsDialog, setDeleteTransactionsDialog] = useState<boolean>(false); // Creating a state to store the delete transactions dialog visibility
	const [deleteTransactionDialog, setDeleteTransactionDialog] = useState<boolean>(false); // Creating a state to store the delete transactions dialog visibility
	const [transactionDialog, setTransactionDialog] = useState<boolean>(false); // Creating a state to store the transaction dialog visibility
	const [transaction, setTransaction] = useState<Transaction>(emptyTransaction); // Creating a state to store the transaction
	const [submitted, setSubmitted] = useState<boolean>(false); // Creating a state to store the submitted status

	useEffect(() => {
		getTransactions().then((data) => setTransactions(data));
	}, []);

	// Open the transaction dialog with an empty transaction object.
	const openNew = () => {
		setTransaction(emptyTransaction);
		setSubmitted(false);
		setTransactionDialog(true);
	};

	// Hide the transaction dialog.
	const hideDialog = () => {
		setSubmitted(false);
		setTransactionDialog(false);
	};

	// Handle the input text change event in the transaction dialog and set the value in the transaction object.
	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
		const val = e.target.value;
		setTransaction({ ...transaction, [name]: val });
	};

	// Handle the input number change event in the transaction dialog and set the value in the transaction object.
	const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
		const val = e.value ?? 0;
		setTransaction({ ...transaction, [name]: val });
	};

	// Handle the date change event transaction dialog and set the date in the transaction object.
	const onDateChange = (date: Nullable<Date>) => {
		if (date) {
			setTransaction({ ...transaction, date: date.toISOString() });
		}
	};

	// Save the transaction. If the transaction has an ID, update it. Otherwise, create a new transaction.
	const saveTransaction = async () => {
		setSubmitted(true);
		if (transaction.title.trim()) {
			let _transactions = [...transactions];
			if (transaction.id) {
				const index = _transactions.findIndex((t) => t.id === transaction.id);
				_transactions[index] = transaction;
				const updatedTransaction = await updateTransaction(transaction);
				if (updatedTransaction.updated) {
					toast.current?.show({ severity: "success", summary: "Successful", detail: "Transaction updated", life: 3000 });
				} else {
					toast.current?.show({ severity: "error", summary: "Error", detail: "Transaction could not be updated", life: 3000 });
				}
			} else {
				const newTransaction = await createTransaction(transaction);
				if (newTransaction.created) {
					_transactions.push(newTransaction.transaction);
					toast.current?.show({ severity: "success", summary: "Successful", detail: "Transaction created", life: 3000 });
				} else {
					toast.current?.show({ severity: "error", summary: "Error", detail: "Transaction could not be created", life: 3000 });
				}
			}
			setTransactions(_transactions);
			setTransactionDialog(false);
			setTransaction(emptyTransaction);
		}
	};

	// The function to edit a transaction. It sets the transaction object and opens the transaction dialog.
	const editTransaction = (transaction: Transaction) => {
		setTransaction({ ...transaction });
		setTransactionDialog(true);
	};

	// The function to confirm the deletion of a transaction. It sets the transaction object and opens the delete transaction dialog.
	const confirmDeleteTransaction = (transaction: Transaction) => {
		setTransaction(transaction);
		setDeleteTransactionDialog(true);
	};

	// The function to delete a transaction. It deletes the transaction and updates the transactions state.
	const deleteSelectedTransactions = async () => {
		let _transactions = transactions.filter((val) => !selectedTransactions.includes(val));
		const result = await deleteTransactions(selectedTransactions);

		if (result.deleted) {
			setTransactions(_transactions);
			setSelectedTransactions([]);
			setDeleteTransactionsDialog(false);
			toast.current?.show({ severity: "success", summary: "Successful", detail: "Transactions Deleted", life: 3000 });
		} else {
			toast.current?.show({ severity: "error", summary: "Error", detail: "Transactions could not be deleted", life: 3000 });
		}
	};

	// The header of the datatable component.
	const header = (
		<div className="flex flex-wrap gap-2 align-items-center justify-content-between">
			<h4 className="m-0">Manage Transactions</h4>
			<span className="p-input-icon-left">
				<i className="pi pi-search" />
				<InputText type="search" placeholder="Search..." onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} />
			</span>
		</div>
	);

	// The left toolbar of the datatable component.
	const leftToolbarTemplate = () => (
		<div className="flex flex-wrap gap-2">
			<Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
			<Button label="Delete" icon="pi pi-trash" severity="danger" onClick={() => setDeleteTransactionsDialog(true)} disabled={!selectedTransactions.length} />
		</div>
	);

	// The right toolbar of the datatable component.
	const rightToolbarTemplate = () => <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={() => dt.current?.exportCSV()} />;

	// The action body template used to display the action buttons for each transaction as the last column.
	const actionBodyTemplate = (rowData: Transaction) => (
		<React.Fragment>
			<Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editTransaction(rowData)} />
			<Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteTransaction(rowData)} />
		</React.Fragment>
	);

	// The total amount body template of the total amount column in the datatable component. It is used to render the total amount in the currency format.
	const totalAmountBodyTemplate = (transaction: Transaction) => {
		if (typeof transaction?.total_amount === "number") {
			return formatCurrency(transaction?.total_amount);
		}
		return 0;
	};

	// The date body template of the date column the datatable component. It is used to render the date in the date format.
	const dateBodyTemplate = (transaction: Transaction) => {
		if (typeof transaction?.date === "string") {
			return formatDate(new Date(transaction?.date));
		} else {
			return "";
		}
	};

	return (
		<div>
			<Toast ref={toast} />
			<div className="card">
				<Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

				<DataTable
					ref={dt}
					value={transactions}
					selection={selectedTransactions}
					onSelectionChange={(e) => {
						if (Array.isArray(e.value)) {
							setSelectedTransactions(e.value);
						}
					}}
					dataKey="id"
					paginator
					rows={10}
					rowsPerPageOptions={[5, 10, 25]}
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} transactions"
					globalFilter={globalFilter}
					header={header}
					selectionMode="multiple">
					<Column selectionMode="multiple" exportable={false}></Column>
					<Column field="id" header="ID" sortable style={{ minWidth: "12rem" }}></Column>
					<Column field="title" header="Title" sortable style={{ minWidth: "16rem" }}></Column>
					<Column field="date" header="Date" body={dateBodyTemplate} sortable style={{ minWidth: "16rem" }}></Column>
					<Column field="description" header="Description" sortable style={{ minWidth: "16rem" }}></Column>
					<Column field="total_amount" header="Total Amount" body={totalAmountBodyTemplate} sortable style={{ minWidth: "16rem" }}></Column>
					<Column body={actionBodyTemplate} exportable={false} style={{ minWidth: "12rem" }}></Column>
				</DataTable>
			</div>

			<ConfirmationDialog visible={deleteTransactionsDialog} header="Confirm" message="Are you sure you want to delete the selected transactions?" onHide={() => setDeleteTransactionsDialog(false)} onConfirm={deleteSelectedTransactions} />

			<ConfirmationDialog
				visible={deleteTransactionDialog}
				header="Confirm"
				message={`Are you sure you want to delete the transaction with ID: ${transaction.id}?`}
				onHide={() => setDeleteTransactionDialog(false)}
				onConfirm={deleteSelectedTransactions}
			/>

			<TransactionDialog
				transactionDialog={transactionDialog}
				hideDialog={hideDialog}
				transaction={transaction}
				onInputChange={onInputChange}
				onDateChange={onDateChange}
				onInputNumberChange={onInputNumberChange}
				saveTransaction={saveTransaction}
				submitted={submitted}
			/>
		</div>
	);
}
