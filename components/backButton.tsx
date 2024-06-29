"use client";

//Here the button redirects user back to main page.

import { Button } from "primereact/button";
import { navigateBackToMainPage } from "./actions";

export default function BackButton() {
	return (
		<form action={navigateBackToMainPage}>
			<Button
				link
				label="Back"
				icon="pi pi-chevron-left"
				rounded
				pt={{
					root: {
						className: "back-button-root",
					},
					label: { className: "back-button-label" },
					icon: { className: "back-button-icon" },
				}}
			/>
		</form>
	);
}
