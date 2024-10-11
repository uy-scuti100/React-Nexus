import { ModeToggle } from "../../providers/theme/theme-toggle";
import { Hash, LogOut, Mail, Search } from "lucide-react";
import supabase from "../../../lib/supabaseClient";
import { Link } from "react-router-dom";
import { useFetchUser } from "../../../hooks/useFetchUser";

export default function SideNav({
	className,
	toggleSideNav,
}: {
	className: string;
	toggleSideNav: () => void;
}) {
	const { user } = useFetchUser();
	const userId = user?.id;

	///////////////////////////////////////////////////////////////////
	const scrollToTop = () => {
		window.scrollTo({ top: 0 });
	};

	const logOff = async () => {
		try {
			const { error } = await supabase.auth.signOut();

			if (error) {
				console.error("Error signing out:", error);
			} else {
				window.location.href = "/";
			}
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	return (
		<nav
			className={` ${className} transition-all rounded duration-500 ease z-30 md:w-[300px] overflow-x-hidden w-[200px] bg-background overflow-y-auto fixed top-[57px] shadow-lg`}
		>
			<div className="p-4">
				<ul className="flex flex-col gap-8">
					<Link
						to={user ? "/write" : "/"}
						onClick={() => {
							toggleSideNav();
							scrollToTop();
						}}
					>
						<li className="flex items-center gap-4 cursor-pointer hover:opacity-75">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								aria-label="Write"
							>
								<path
									d="M14 4a.5.5 0 0 0 0-1v1zm7 6a.5.5 0 0 0-1 0h1zm-7-7H4v1h10V3zM3 4v16h1V4H3zm1 17h16v-1H4v1zm17-1V10h-1v10h1zm-1 1a1 1 0 0 0 1-1h-1v1zM3 20a1 1 0 0 0 1 1v-1H3zM4 3a1 1 0 0 0-1 1h1V3z"
									fill="currentColor"
								></path>
								<path
									d="M17.5 4.5l-8.46 8.46a.25.25 0 0 0-.06.1l-.82 2.47c-.07.2.12.38.31.31l2.47-.82a.25.25 0 0 0 .1-.06L19.5 6.5m-2-2l2.32-2.32c.1-.1.26-.1.36 0l1.64 1.64c.1.1.1.26 0 .36L19.5 6.5m-2-2l2 2"
									stroke="currentColor"
								></path>
							</svg>
							<span>Write</span>
						</li>
					</Link>
					<Link
						to={user ? `/account/${userId}` : "/"}
						onClick={() => {
							toggleSideNav();
							scrollToTop();
						}}
					>
						<li className="flex items-center gap-4 cursor-pointer hover:opacity-75">
							{" "}
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								aria-label="Profile"
							>
								<circle cx="12" cy="7" r="4.5" stroke="currentColor"></circle>
								<path
									d="M3.5 21.5v-4.34C3.5 15.4 7.3 14 12 14s8.5 1.41 8.5 3.16v4.34"
									stroke="currentColor"
									stroke-linecap="round"
								></path>
							</svg>
							<span>Profile</span>
						</li>
					</Link>

					<li
						className="flex items-center gap-4 cursor-pointer hover:opacity-75"
						onClick={() => alert("comng soon")}
					>
						<Mail className="w-6 h-6 opacity-60 " />
						<span>Messages</span>
					</li>

					<Link
						to="/search"
						onClick={() => {
							toggleSideNav();
							scrollToTop();
						}}
					>
						<li className="flex items-center gap-4 cursor-pointer hover:opacity-75">
							<Search className="w-6 h-6 cursor-pointer opacity-70" />
							<span>Search</span>
						</li>
					</Link>

					<Link
						to={user ? "/bookmarks" : "/"}
						onClick={() => {
							toggleSideNav();
							scrollToTop();
						}}
					>
						<li className="flex items-center gap-4 cursor-pointer hover:opacity-75">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								aria-label="Lists"
							>
								<path
									d="M6.44 6.69h0a1.5 1.5 0 0 1 1.06-.44h9c.4 0 .78.16 1.06.44l.35-.35-.35.35c.28.28.44.66.44 1.06v14l-5.7-4.4-.3-.23-.3.23-5.7 4.4v-14c0-.4.16-.78.44-1.06z"
									stroke="currentColor"
								></path>
								<path
									d="M12.5 2.75h-8a2 2 0 0 0-2 2v11.5"
									stroke="currentColor"
									stroke-linecap="round"
								></path>
							</svg>
							<span>Bookmarks</span>
						</li>
					</Link>

					<Link
						to={user ? "/liked" : "/"}
						onClick={() => {
							toggleSideNav();
							scrollToTop();
						}}
					>
						<li className="flex items-center gap-4 cursor-pointer hover:opacity-75">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								aria-label="clap"
								className="-colors dark:fill-white "
							>
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M11.37.83L12 3.28l.63-2.45h-1.26zM13.92 3.95l1.52-2.1-1.18-.4-.34 2.5zM8.59 1.84l1.52 2.11-.34-2.5-1.18.4zM18.52 18.92a4.23 4.23 0 0 1-2.62 1.33l.41-.37c2.39-2.4 2.86-4.95 1.4-7.63l-.91-1.6-.8-1.67c-.25-.56-.19-.98.21-1.29a.7.7 0 0 1 .55-.13c.28.05.54.23.72.5l2.37 4.16c.97 1.62 1.14 4.23-1.33 6.7zm-11-.44l-4.15-4.15a.83.83 0 0 1 1.17-1.17l2.16 2.16a.37.37 0 0 0 .51-.52l-2.15-2.16L3.6 11.2a.83.83 0 0 1 1.17-1.17l3.43 3.44a.36.36 0 0 0 .52 0 .36.36 0 0 0 0-.52L5.29 9.51l-.97-.97a.83.83 0 0 1 0-1.16.84.84 0 0 1 1.17 0l.97.97 3.44 3.43a.36.36 0 0 0 .51 0 .37.37 0 0 0 0-.52L6.98 7.83a.82.82 0 0 1-.18-.9.82.82 0 0 1 .76-.51c.22 0 .43.09.58.24l5.8 5.79a.37.37 0 0 0 .58-.42L13.4 9.67c-.26-.56-.2-.98.2-1.29a.7.7 0 0 1 .55-.13c.28.05.55.23.73.5l2.2 3.86c1.3 2.38.87 4.59-1.29 6.75a4.65 4.65 0 0 1-4.19 1.37 7.73 7.73 0 0 1-4.07-2.25zm3.23-12.5l2.12 2.11c-.41.5-.47 1.17-.13 1.9l.22.46-3.52-3.53a.81.81 0 0 1-.1-.36c0-.23.09-.43.24-.59a.85.85 0 0 1 1.17 0zm7.36 1.7a1.86 1.86 0 0 0-1.23-.84 1.44 1.44 0 0 0-1.12.27c-.3.24-.5.55-.58.89-.25-.25-.57-.4-.91-.47-.28-.04-.56 0-.82.1l-2.18-2.18a1.56 1.56 0 0 0-2.2 0c-.2.2-.33.44-.4.7a1.56 1.56 0 0 0-2.63.75 1.6 1.6 0 0 0-2.23-.04 1.56 1.56 0 0 0 0 2.2c-.24.1-.5.24-.72.45a1.56 1.56 0 0 0 0 2.2l.52.52a1.56 1.56 0 0 0-.75 2.61L7 19a8.46 8.46 0 0 0 4.48 2.45 5.18 5.18 0 0 0 3.36-.5 4.89 4.89 0 0 0 4.2-1.51c2.75-2.77 2.54-5.74 1.43-7.59L18.1 7.68z"
								></path>
							</svg>{" "}
							<span>Liked Posts</span>
						</li>
					</Link>

					{/* <Link to="/" onClick={toggleSideNav}>
                  <li className="flex items-center gap-4 cursor-pointer hover:opacity-75">
                     <Settings strokeWidth={1.25} />
                     <span>Settings</span>
                  </li>
               </Link> */}
					{user && (
						<Link to="/" onClick={toggleSideNav}>
							<li
								className="flex items-center gap-4 cursor-pointer hover:opacity-75"
								onClick={logOff}
							>
								<LogOut strokeWidth={1.25} />
								<span>Log Out</span>
							</li>
						</Link>
					)}

					<li className="hover:opacity-75">
						<ModeToggle />
					</li>
				</ul>
			</div>
		</nav>
	);
}
