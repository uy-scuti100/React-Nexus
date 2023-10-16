export function calculateReadTime(content: string) {
   if (content) {
      const contentWithoutImages = content.replace(/<img[^>]*>/g, "");
      const wordsWithoutImages = contentWithoutImages
         .split(" ")
         .filter((word) => word.trim() !== "");
      const wordCount = wordsWithoutImages.length;
      const WPS = 238; // Words per minute
      const estimatedReadTime = Math.ceil(wordCount / WPS);
      return estimatedReadTime;
   }
   return 0;
}
