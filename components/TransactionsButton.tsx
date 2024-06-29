"use client";

//Here the button redirects user to the transactions page.

import Link from "next/link";
import { Button } from "primereact/button";
import { navigateToTransactionsPage } from "./actions";

export default function TransactionButton() {
	return (
		<form action={navigateToTransactionsPage}>
			<Button label="View all transactions" className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover" />
		</form>
	);
}
