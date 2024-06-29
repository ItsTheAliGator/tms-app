"use client";

// This is a Supabase with Next.js SSR project in typescript. I need to use the functions in the actions.ts file to get and display all transactions from the database.
// Also I need to use the functions to Create a single transactions, delete a single or multiple transactions and update a single transaction. The type are auto generated from the database schema.
// Also I want to use prime react components to display the transactions in a table.

import { useState, useEffect, useRef } from "react"; // Import useState and useEffect
import { Transaction } from "../types/transaction";
import { getTransactions, createTransaction, deleteTransactions, updateTransaction } from "./actions";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import React from "react";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";

let emptyTransaction: Transaction = {
	id: 0,
	title: "",
	date: Date.now().toString(),
	description: "",
	total_amount: 0,
};

export default function Transactions() {
	const [transactions, setTransactions] = useState<Transaction[]>([]); // Create a state to store the transactions
	const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]); // Create a state to store the selected transactions
	const [globalFilter, setGlobalFilter] = useState<string>(""); // Create a state to store the global filter
	const toast = useRef<Toast>(null); // Create a ref to the toast component
	const dt = useRef<DataTable<Transaction[]>>(null); // Create a ref to the datatable component
	const [deleteTransactionsDialog, setDeleteTransactionsDialog] = useState<boolean>(false); // Create a state to store the delete transactions dialog visibility
	const [transactionDialog, setTransactionDialog] = useState<boolean>(false); // Create a state to store the transaction dialog visibility
	const [transaction, setTransaction] = useState<Transaction>(emptyTransaction); // Create a state to store the transaction
	const [submitted, setSubmitted] = useState<boolean>(false); // Create a state to store the submitted status

	useEffect(() => {
		getTransactions().then((data) => setTransactions(data)); // Fetch the transactions and set the state
	}, []); // Run the effect only once

	const hideDeleteTransactionsDialog = () => {
		setDeleteTransactionsDialog(false);
	};

	const exportCSV = () => {
		dt.current?.exportCSV();
	};

	const confirmDeleteSelected = () => {
		setDeleteTransactionsDialog(true);
	};

	const deleteSelectedTransactions = async () => {
		let _transactions = transactions.filter((val) => !selectedTransactions.includes(val));
		const deletedTransactions = await deleteTransactions(selectedTransactions);

		if (!deletedTransactions.deleted) {
			toast.current?.show({ severity: "error", summary: "Error", detail: "Transactions could not be deleted", life: 3000 });
			return;
		} else {
			setTransactions(_transactions);
			setDeleteTransactionsDialog(false);
			setSelectedTransactions([]);
			toast.current?.show({ severity: "success", summary: "Successful", detail: "Transactions Deleted", life: 3000 });
		}
	};

	const openNew = () => {
		setTransaction(emptyTransaction);
		setSubmitted(false);
		setTransactionDialog(true);
	};

	const hideDialog = () => {
		setSubmitted(false);
		setTransactionDialog(false);
	};

    const deleteTransaction = async () => {
        let _transactions = transactions.filter((val) => val.id !== transaction.id);
        const deletedTransaction = await deleteTransactions([transaction]);

        if (!deletedTransaction.deleted) {
            toast.current?.show({ severity: "error", summary: "Error", detail: "Transaction could not be deleted", life: 3000 });
            return;
        } else {
            setTransactions(_transactions);
            setDeleteTransactionsDialog(false);
            setTransaction(emptyTransaction);
            toast.current?.show({ severity: "success", summary: "Successful", detail: "Transaction Deleted", life: 3000 });
        }
    }

	const findIndexById = (id: number) => {
		return transactions.findIndex((transaction) => transaction.id === id);
	};

    const editTransaction = (transaction: Transaction) => {
        setTransaction({ ...transaction });
        setTransactionDialog(true);
    }

	const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
		const val = e.value ?? 0;
		let _transaction = { ...transaction };

		// @ts-ignore
		_transaction[name] = val;

		setTransaction(_transaction);
	};


    const actionBodyTemplate = (rowData: Transaction) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editTransaction(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteTransaction(rowData)} />
            </React.Fragment>
        );
    }

    const confirmDeleteTransaction = (transaction: Transaction) => {
        setTransaction(transaction);
        setDeleteTransactionsDialog(true);
    }

    const hideDeleteTransactionDialog = () => {
        setDeleteTransactionsDialog(false);
    }


	const saveTransaction = async () => {
		setSubmitted(true);
		if (transaction.title?.trim()) {
			let _transactions = [...transactions];
			let _transaction = { ...transaction };
			if (transaction.id) {
				const index = findIndexById(transaction.id);

				_transactions[index] = _transaction;
				const updatedTransaction = await updateTransaction(_transaction);
				if (updatedTransaction) {
					toast.current?.show({ severity: "success", summary: "Successful", detail: "Transaction updated", life: 3000 });
				} else {
					toast.current?.show({ severity: "error", summary: "Error", detail: "Transaction could not be updated", life: 3000 });
				}
				toast.current?.show({ severity: "success", summary: "Successful", detail: "Transaction updated", life: 3000 });
			} else {
				const newTempTransaction = await createTransaction(_transaction);
				if (newTempTransaction) {
					_transactions.push(newTempTransaction);
					toast.current?.show({ severity: "success", summary: "Successful", detail: "New transaction added", life: 3000 });
				} else {
					toast.current?.show({ severity: "error", summary: "Error", detail: "Transaction could not be added", life: 3000 });
				}
			}
			setTransactionDialog(false);
			setTransactions(_transactions);
			setTransaction(emptyTransaction);
		}
	};

	const header = (
		<div className="flex flex-wrap gap-2 align-items-center justify-content-between">
			<h4 className="m-0">Manage Transactions</h4>
			<IconField iconPosition="left">
				<InputIcon className="pi pi-search" />
				<InputText
					type="search"
					placeholder="Search..."
					onInput={(e) => {
						const target = e.target as HTMLInputElement;
						setGlobalFilter(target.value);
					}}
				/>
			</IconField>
		</div>
	);

	const leftToolbarTemplate = () => {
		return (
			<div className="flex flex-wrap gap-2">
				<Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedTransactions || !selectedTransactions.length} />
				<Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
			</div>
		);
	};

	const rightToolbarTemplate = () => {
		return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
	};

    
	const transactionDialogFooter = (
        <React.Fragment>
			<Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
			<Button label="Save" icon="pi pi-check" onClick={saveTransaction} />
		</React.Fragment>
	);
    
    const deleteTransactionsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteTransactionsDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedTransactions} />
        </React.Fragment>
    );

    const deleteTransactionDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteTransactionDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteTransaction} />
        </React.Fragment>
    );

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
					<Column field="date" header="Date" sortable style={{ minWidth: "16rem" }}></Column>
					<Column field="description" header="Description" sortable style={{ minWidth: "16rem" }}></Column>
					<Column field="total_amount" header="Total Amount" sortable style={{ minWidth: "16rem" }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
				</DataTable>
			</div>

			<Dialog visible={deleteTransactionsDialog} style={{ width: "32rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} header="Confirm" modal footer={deleteTransactionsDialogFooter} onHide={hideDeleteTransactionsDialog}>
				<div className="confirmation-content">
					<i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
					{selectedTransactions && <span>Are you sure you want to delete the selected transactions?</span>}
				</div>
			</Dialog>

            <Dialog visible={deleteTransactionsDialog} style={{ width: "32rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} header="Confirm" modal footer={deleteTransactionDialogFooter} onHide={hideDeleteTransactionDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                    {transaction && <span>Are you sure you want to delete the transaction with ID: {transaction.id}?</span>}
                </div>
            </Dialog>

			<Dialog visible={transactionDialog} style={{ width: "32rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} header="Transaction Details" modal className="p-fluid" footer={transactionDialogFooter} onHide={hideDialog}>
				<div className="field">
					<label htmlFor="title" className="font-bold">
						Title
					</label>
					<InputText id="title" value={transaction.title} onChange={(e) => setTransaction({ ...transaction, title: e.target.value })} required autoFocus />
				</div>
				<div className="field">
					<label htmlFor="date" className="font-bold">
						Date
					</label>
					<InputText id="date" value={transaction.date} onChange={(e) => setTransaction({ ...transaction, date: e.target.value })} required />
				</div>
				<div className="field">
					<label htmlFor="description" className="font-bold">
						Description
					</label>
					<InputText id="description" value={transaction.description} onChange={(e) => setTransaction({ ...transaction, description: e.target.value })} required />
				</div>
				<div className="field">
					<label htmlFor="total_amount" className="font-bold">
						Total Amount
					</label>
					<InputNumber id="total_amount" value={transaction.total_amount} onValueChange={(e) => onInputNumberChange(e, "total_amount")} mode="currency" currency="EUR" locale="nl-NL" required />
				</div>
			</Dialog>
		</div>
	);
}
