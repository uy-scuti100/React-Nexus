const Footer = () => {
   return (
      <footer className="mt-10 text-white bg-black border h-80 border-t-background dark:text-accent-orange">
         <div className="px-6 mx-auto ">
            <div className="py-6 text-5xl logo ">Nexus</div>

            <ul className="flex items-center gap-6 text-sm ">
               <li>About</li>
               <li>Help</li>
               <li>Terms</li>
               <li>Privacy</li>
            </ul>
         </div>
         <div className="w-full mt-5 border-b border-white dark:border-black"></div>
      </footer>
   );
};

export default Footer;
