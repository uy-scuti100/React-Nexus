export interface PostsProp {
   title: string;
   author: string;
   user_img: string;
   date: string;
   verified?: boolean;
}
export interface LargePostsProp extends PostsProp {
   post_image: string;
}

export const posts: Array<PostsProp> = [
   {
      title: "Exploring the Wonders of Nature",
      author: "John Smith",
      user_img: "/img7.jpg",
      date: "September 2, 2023",
      verified: true,
   },
   {
      title: "The Art of Culinary Delights",
      author: "Alice Johnson",
      user_img: "/img8.jpg",
      date: "August 28, 2023",
      verified: true,
   },
   {
      title: "A Journey Through Time and Space",
      author: "David Williams",
      user_img: "/img10.jpg",
      date: "July 15, 2023",
      verified: false,
   },
   {
      title: "Unlocking the Mysteries of the Mind",
      author: "Emily Davis",
      user_img: "/img6.jpg",
      date: "June 30, 2023",
      verified: true,
   },
   {
      title: "Adventures in the Digital Realm",
      author: "Michael Brown",
      user_img: "/img2.jpg",
      date: "May 12, 2023",
      verified: false,
   },
   {
      title: "The Power of Innovation and Technology",
      author: "Sophia Lee",
      user_img: "/img7.jpg",
      date: "April 5, 2023",
      verified: true,
   },
];

export const categories = [
   "Technology",
   "Travel",
   "Food",
   "Fashion",
   "Sports",
   "Health",
   "Movies",
   "Books",
   "Music",
   "Art",
   "Science",
   "History",
   "Education",
   "Gaming",
   "Nature",
   "Business",
   "Fitness",
   "Cooking",
   "Photography",
   "DIY Crafts",
];

export const largePosts: Array<LargePostsProp> = [
   {
      title: "Exploring the Wonders of Nature",
      author: "John Smith",
      user_img: "/img10.jpg",
      date: "September 2, 2023",
      post_image: "/img2.jpg",
   },
   {
      title: "The Art of Culinary Delights",
      author: "Alice Johnson",
      user_img: "/img2.jpg",
      date: "August 28, 2023",
      post_image: "/img10.jpg",
   },
   {
      title: "A Journey Through Time and Space",
      author: "David Williams",
      user_img: "/img7.jpg",
      date: "July 15, 2023",
      post_image: "/img3.jpg",
   },
   {
      title: "Unlocking the Mysteries of the Mind",
      author: "Emily Davis",
      user_img: "/img3.jpg",
      date: "June 30, 2023",
      post_image: "/img4.jpg",
   },
   {
      title: "Adventures in the Digital Realm",
      author: "Michael Brown",
      user_img: "/img11.jpg",
      date: "May 12, 2023",
      post_image: "/img5.jpg",
   },
   {
      title: "The Power of Innovation and Technology",
      author: "Sophia Lee",
      user_img: "/img9.jpg",
      date: "April 5, 2023",
      post_image: "/img6.jpg",
   },
   {
      title: "Discovering Hidden Treasures",
      author: "Oliver Wilson",
      user_img: "/img5.jpg",
      date: "March 20, 2023",
      post_image: "/img7.jpg",
   },
   {
      title: "A Walk in the Woods",
      author: "Lily Adams",
      user_img: "/img1.jpg",
      date: "February 14, 2023",
      post_image: "/img8.jpg",
   },
   {
      title: "Capturing the Beauty of Sunsets",
      author: "Ella Garcia",
      user_img: "/img6.jpg",
      date: "January 9, 2023",
      post_image: "/img9.jpg",
   },
   {
      title: "Exploring Underwater Wonders",
      author: "William Clark",
      user_img: "/img11.jpg",
      date: "December 3, 2022",
      post_image: "/img10.jpg",
   },
];