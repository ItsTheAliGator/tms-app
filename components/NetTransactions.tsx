"use server";

//Here the net of all transactions is displayed.

import { getTransactions } from "@/app/transactions/actions";
import { createClient } from "@/utils/supabase/server";
import { Card } from "primereact/card";

export default async function NetTransactions() {
	const supabase = createClient();

	const transactions = await getTransactions();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const net = transactions.reduce((acc, transaction) => acc + transaction.total_amount, 0);

	const usersNetTransactions = () => {
		return (
			<p className="m-0">
				Net transactions: <strong>{net.toLocaleString("nl-NL", { style: "currency", currency: "EUR" })}</strong>
			</p>
		);
	};

	const unauthorizedUser = () => {
		return <p className="m-0">Please log in to see your daily transactions.</p>;
	};

	return user ? (
		<Card
			title="Net transactions"
			subTitle="Your accumulated transactions"
			className="md:w-25rem h-40"
			pt={{
				root: {
					className: "widget-card-root",
				},
				subTitle: { className: "widget-card-subtitle" },
				title: { className: "widget-card-title" },
				content: { className: "widget-card-content" },
			}}>
			{user ? usersNetTransactions() : unauthorizedUser()}
		</Card>
	) : null;
}
