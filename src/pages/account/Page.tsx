import Navbar from "../../components/myComponents/global/Navbar";
import { useFetchUser } from "../../hooks/useFetchUser";
import Account from "./Account";

const page = () => {
	const { user } = useFetchUser();

	return (
		<div className=" bg-[#F5F5F5] dark:bg-black">
			<Account />
		</div>
	);
};

export default page;
