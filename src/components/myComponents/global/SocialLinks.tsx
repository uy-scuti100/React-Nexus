type Props = {
   isDark?: boolean;
};

const SocialLinks = ({ isDark = false }: Props) => {
   return (
      <div className="flex items-center justify-between gap-7">
         <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <img
               className={`${isDark ? "brightness-0" : ""} hover:opacity-50`}
               alt="twitter"
               src="/social_twitter.png"
               width={20}
               height={20}
            />
         </a>
         <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <img
               className={`${isDark ? "brightness-0" : ""} hover:opacity-50`}
               alt="facebook"
               src="/social_facebook.png"
               width={20}
               height={20}
            />
         </a>
         <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <img
               className={`${isDark ? "brightness-0" : ""} hover:opacity-50`}
               alt="instagram"
               src="/social_instagram.png"
               width={20}
               height={20}
            />
         </a>
         <a href="https://google.com" target="_blank" rel="noreferrer">
            <img
               className={`${isDark ? "brightness-0" : ""} hover:opacity-50`}
               alt="google"
               src="/social_google.png"
               width={20}
               height={20}
            />
         </a>
         <a href="https://discord.com" target="_blank" rel="noreferrer">
            <img
               className={`${isDark ? "brightness-0" : ""} hover:opacity-50`}
               alt="discord"
               src="/social_discord.png"
               width={20}
               height={20}
            />
         </a>
      </div>
   );
};

export default SocialLinks;
