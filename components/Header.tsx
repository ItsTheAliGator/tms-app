import { createClient } from "@/utils/supabase/server";
import AuthButton from "./AuthButton";

export default async function Header() {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return user ? (
		<div className="flex flex-col gap-16 items-center">
			<div className="flex gap-8 justify-center items-center">
				<h1 className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">Hey, {user.email}! Welcome to your TMS dashboard!</h1>
			</div>
		</div>
	) : (
		<div className="flex gap-16 items-center">
			<div className="flex gap-8 flex-col justify-center items-center">
				<h1 className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">Welcome to TMS dashboard! Please login to access your transactions.</h1>
				<AuthButton />
			</div>
		</div>
	);
}
