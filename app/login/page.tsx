import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";
import BackButton from "../../components/backButton";

export default function Login({ searchParams }: { searchParams: { message: string } }) {
	const signInWithEmail = async (formData: FormData) => {
		"use server";

		const email = formData.get("email") as string;
		const supabase = createClient();

		const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				shouldCreateUser: false,
				emailRedirectTo: defaultUrl,
			},
		});

		if (error) {
			return redirect("/error");
		}
	};

	return (
		<div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
			<div className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm">
				<BackButton />
			</div>

			<form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
				<label className="text-md" htmlFor="email">
					Email
				</label>
				<input className="rounded-md px-4 py-2 bg-inherit border mb-6" name="email" placeholder="you@example.com" required />
				<SubmitButton formAction={signInWithEmail} className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2" pendingText="Signing In...">
					Sign In
				</SubmitButton>
				{searchParams?.message && <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">{searchParams.message}</p>}
			</form>
		</div>
	);
}
