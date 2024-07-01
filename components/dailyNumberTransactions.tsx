"use server";

//Here the daily number of transactions is displayed.

import { getTransactions } from "@/app/transactions/actions";
import { createClient } from "@/utils/supabase/server";
import { Card } from "primereact/card";
import "./../app/primereact-styles.css";

export default async function DailyNumberTransactions() {
	const supabase = createClient();
	const testToday = new Date().toLocaleDateString("en-NL", {
		year: "numeric",
		month: "numeric",
		day: "numeric",
	});

	let testDate = new Date().toString();
	const currentLocale = process.env.LOCALE ? process.env.LOCALE : process.env.VERCEL_REGION;

	const transactions = await getTransactions();
	const todayTransactions = transactions.filter((transaction) => {
		testDate = new Date(transaction.date).toLocaleDateString("en-NL", {
			timeZone: "Europe/Amsterdam",
			year: "numeric",
			month: "numeric",
			day: "numeric",
		});

		const transactionDate = new Date(transaction.date).toLocaleDateString("en-NL", {
			timeZone: "Europe/Amsterdam",
			year: "numeric",
			month: "numeric",
			day: "numeric",
		});

		const today = new Date().toLocaleDateString("en-NL", {
			timeZone: "Europe/Amsterdam",
			year: "numeric",
			month: "numeric",
			day: "numeric",
		});
		return transactionDate === today;
	});

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const usersDailyTransactions = () => {
		return (
			<p className="m-0">
				Number of transactions today: <strong>{todayTransactions.length}</strong>
				<p>
					{testDate} {testToday}
					{currentLocale}
				</p>
			</p>
		);
	};

	const unauthorizedUser = () => {
		return <p className="m-0">Please log in to see your daily transactions.</p>;
	};

	return user ? (
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
	) : null;
}
