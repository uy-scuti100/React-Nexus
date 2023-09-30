import Navbar from "../../components/myComponents/global/Navbar";
import { useFetchUser } from "../../hooks/useFetchUser";
import Account from "./Account";

const page = () => {
   const { user } = useFetchUser();

   return (
      <div>
         <Navbar />
         <Account />
      </div>
   );
};

export default page;
