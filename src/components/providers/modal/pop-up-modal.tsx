// //;
// import { AlertTriangle, Terminal, Waves } from "lucide-react";
// import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
// import { Button } from "../../ui/button";
// import Link from "next/link";

// interface AlertModalProp {
//    title?: string;
//    message?: string;
// }

// const AlertModal: React.FC<AlertModalProp> = ({
//    title,
//    message,
// }: AlertModalProp) => {
//    return (
//       <Alert
//          variant="default"
//          className="md:w-[600px] h-[200px] w-[300px] transition-all duration-300">
//          <div className="flex items-center gap-3 mb-5">
//             <AlertTriangle className="w-4 h-4" />
//             <AlertTitle className="text-xl">{title}</AlertTitle>
//          </div>
//          <AlertDescription className="text-base">{message}</AlertDescription>
//          <div className="absolute bottom-0 left-0 right-0 flex items-baseline justify-between px-5 pb-3 md:justify-end md:gap-6">
//             <Button variant="outline">Cancel</Button>
//             <Button>
//                <Link href="/login"> Log in </Link>
//             </Button>
//          </div>
//       </Alert>
//    );
// };

// export default AlertModal;
