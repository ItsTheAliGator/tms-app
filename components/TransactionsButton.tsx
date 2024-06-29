"use client";

//Here the button redirects user to the transactions page.

import { Button } from "primereact/button";
import { navigateToTransactionsPage } from "./actions";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function TransactionButton() {
	const [userIsLoggedIn, setUserIsLoggedIn] = useState<boolean>();

	useEffect(() => {
		(async () => {
			const supabase = createClient();

			const {
				data: { user },
			} = await supabase.auth.getUser();

			setUserIsLoggedIn(!!user);
		})();
	}, []);

	return userIsLoggedIn ? (
		<form action={navigateToTransactionsPage}>
			<Button
				link
				label="View all transactions"
				icon="pi pi-list"
				rounded
				raised
				pt={{
					root: {
						className: "transaction-button-root",
					},
					label: { className: "transaction-button-label" },
					icon: { className: "transaction-button-icon" },
				}}
			/>
		</form>
	) : null;
}
