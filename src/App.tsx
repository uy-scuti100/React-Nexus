import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Footer from "./components/myComponents/global/Footer";
import Home from "./pages/home/Page";
import Account from "./pages/account/Page";
import Post from "./pages/post/Page";
import Search from "./pages/search/Page";
import Posts from "./pages/posts/Page";
import Write from "./pages/write/Page";
import Topics from "./pages/explore-topics/Page";
import SubSubTopic from "./pages/subsubtopic/Page";
import Topic from "./pages/subtopic/Page";
import Tag from "./pages/tag/Page";
import Mytags from "./pages/topic/Page";
import Following from "./pages/following/Page";
import Bookmarked from "./pages/bookmarks/Page";
import Liked from "./pages/liked/Page";

const Layout = () => {
   return (
      <div>
         <Outlet />
         <Footer />
      </div>
   );
};

const router = createBrowserRouter([
   {
      element: <Layout />,
      children: [
         {
            path: "/",
            element: <Home />,
         },
         {
            path: "/posts",
            element: <Posts />,
         },
         {
            path: "/account/:id",
            element: <Account />,
         },
         {
            path: "/post/:id",
            element: <Post />,
         },
         {
            path: "/search",
            element: <Search />,
         },
         {
            path: "/write",
            element: <Write />,
         },
         {
            path: "/explore-topics",
            element: <Topics />,
         },
         {
            path: "/tag/:id",
            element: <Tag />,
         },
         {
            path: "/subtopic/:id",
            element: <Topic />,
         },
         {
            path: "/subsubtopic/:id",
            element: <SubSubTopic />,
         },
         {
            path: "/topic/:id",
            element: <Mytags />,
         },
         {
            path: "/following",
            element: <Following />,
         },
         {
            path: "/bookmarks",
            element: <Bookmarked />,
         },
         {
            path: "/liked",
            element: <Liked />,
         },
      ],
   },
]);
const App = () => {
   return (
      <main className="max-w-[1440px] mx-auto">
         <RouterProvider router={router} />
      </main>
   );
};

export default App;
