import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";
import BackButton from "../../components/backButton";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Password } from "primereact/password";
import { revalidatePath } from "next/cache";

export default function Login({ searchParams }: { searchParams: { message: string } }) {
	const login = async (formData: FormData) => {
		"use server";
		const supabase = createClient();

		const { error } = await supabase.auth.signInWithPassword({
			email: formData.get("email") as string,
			password: formData.get("password") as string,
		});

		if (error) {
			return redirect("/error");
		}

		revalidatePath("/", "layout");
		redirect("/");
	};

	const signUp = async (formData: FormData) => {
		"use server";
		const supabase = createClient();

		const { error } = await supabase.auth.signUp({
			email: formData.get("email") as string,
			password: formData.get("password") as string,
		});

		if (error) {
			return redirect("/error");
		}

		revalidatePath("/", "layout");
		redirect("/");
	};

	return (
		<div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
			<div className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm">
				<BackButton />
			</div>

			<form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
				<div className="flex gap-6">
					<FloatLabel>
						<InputText id="email" name="email" required />
						<label htmlFor="email">Email</label>
					</FloatLabel>

					<FloatLabel>
						<Password inputId="password" name="password" required />
						<label htmlFor="password">Password</label>
					</FloatLabel>
				</div>

				<SubmitButton formAction={login} className="bg-green-700 md:w-40 rounded-md py-2 w-full text-foreground mb-2" pendingText="Signing In...">
					Log in
				</SubmitButton>

				<SubmitButton formAction={signUp} className="bg-green-700 md:w-40 rounded-md py-2 w-full text-foreground mb-2" pendingText="Signing In...">
					Sign up
				</SubmitButton>

				{searchParams?.message && <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">{searchParams.message}</p>}
			</form>
		</div>
	);
}
