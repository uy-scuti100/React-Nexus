import { Card, CardDescription, CardHeader, CardTitle } from "../../ui/card";

const Confirmation = ({ email }: { email: string }) => {
   return (
      <section className="fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-hidden text-white transition-all duration-300">
         {/* <div className="absolute inset-0 z-40 bg-white backdrop-blur-0 md:bg-white/60 md:backdrop-blur-xl dark:bg-black" /> */}
         <div className="absolute flex justify-center items-center z-50 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"></div>
         <Card className="z-50 h-[490px] w-full ">
            <CardHeader className="">
               <CardTitle className="pb-20 text-4xl text-center">
                  Check your inbox
               </CardTitle>
               <CardDescription className="pb-10 text-xl text-center">
                  Please check your inbox at{" "}
                  <span className="font-bold text-primary dark:text-accent-orange">{email}</span> and
                  click the link we sent to continue.
               </CardDescription>
            </CardHeader>
         </Card>
      </section>
   );
};

export default Confirmation;

// {/* <section className="fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-hidden text-white transition-all duration-300">
//    {/* <div className="absolute inset-0 z-40 bg-white backdrop-blur-0 md:bg-white/60 md:backdrop-blur-xl dark:bg-black" /> */}
//    <div className="absolute flex justify-center items-center z-50 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"></div>
//    <Card className="z-50 h-[490px] w-full ">
//       <CardHeader className="">
//          <CardTitle className="pb-5 text-3xl text-center">
//             Check your inbox
//          </CardTitle>
//          <CardDescription className="pb-10 text-center">
//             Thank you for creating an account . Please check your inbox at {email} and
//             click the link we sent to complete your account set-up.
//          </CardDescription>
//          <CardDescription className="pb-5 text-center">
//          <Button>OK</Button>
//          </CardDescription>
//       </CardHeader>

//    </Card>
// </section>; */}
