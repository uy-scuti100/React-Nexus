// user.ts
export interface User {
   id: string | null | undefined;
   email: string | null | undefined;
   avatarUrl?: string | null | undefined;
   fullName?: string | null | undefined;
   user_name: string | null | undefined;
   bio?: string | null | undefined;
   display_name?: string | null | undefined;
   isVerified?: boolean;
   display_pic?: string | null | undefined;
   location?: string | null | undefined;
   website?: string | null | undefined;
   skills_and_languages?: string | null | undefined;
   created_at?: string | null | undefined; // You can use a string for the timestamp
   currently_learning?: string | null | undefined;
   currently_building?: string | null | undefined;
   banner_pic?: string | null | undefined;
   availability: string | null | undefined;
   username: string | null | undefined
}


export interface Category {
   id: string | null;
   name: string | null;
}
export interface Hashtag {
   id: string | null;
   name: string | null;
}

export interface Post {
   id: string;
   title: string;
   profile_id: string;
   category_id: string;
   category_name: string;
   content: string;
   image: string;
   snippet: string;
   created_at: string;
   updated_at: Date;
   author_verification: boolean;
   author: string;
   author_image: string;
   bookmark_count: number;
   likes_count: number;
   comment_count: number;
}

export interface Comment {
   id: string;
   content: string;
   profile_id: string;
   post_id: string;
   comment_author_name: string;
   comment_author_pic: string;
   likes_count: number;
   comment_count: number;
   replies?: Comment[];
   parent_comment_id?: string;
   created_at: Date;
}
