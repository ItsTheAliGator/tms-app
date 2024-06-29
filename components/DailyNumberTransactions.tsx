"use server";

//Here the daily number of transactions is displayed.

import { getTransactions } from "@/app/transactions/actions";
import { createClient } from "@/utils/supabase/server";
import { Card } from "primereact/card";
import "./../app/primereact-styles.css";

export default async function DailyNumberTransactions() {
	const supabase = createClient();

	const transactions = await getTransactions();
	const todayTransactions = transactions.filter((transaction) => {
		const transactionDate = new Date(transaction.date);
		const today = new Date();
		return transactionDate.getDate() === today.getDate() && transactionDate.getMonth() === today.getMonth() && transactionDate.getFullYear() === today.getFullYear();
	});

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const usersDailyTransactions = () => {
		return (
			<p className="m-0">
				Number of transactions today: <strong>{todayTransactions.length}</strong>
			</p>
		);
	};

	const unauthorizedUser = () => {
		return <p className="m-0">Please log in to see your daily transactions.</p>;
	};

	return (
		<Card
			title="Daily transactions"
			subTitle="Number of transactions for today"
			className="md:w-25rem h-40"
			pt={{
				root: {
					className: "widget-card-root",
				},
				subTitle: { className: "widget-card-subtitle" },
				title: { className: "widget-card-title" },
				content: { className: "widget-card-content" },
			}}>
			{user ? usersDailyTransactions() : unauthorizedUser()}
		</Card>
	);
}
