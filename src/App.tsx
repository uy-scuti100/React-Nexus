import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Footer from "./components/myComponents/global/Footer";
import Home from "./pages/home/Page";
import Account from "./pages/account/Page";
import Post from "./pages/post/Page";
import Search from "./pages/search/Page";
import Posts from "./pages/posts/Page";
import Write from "./pages/write/Page";
import Category from "./pages/categories/Page";
import Hashtag from "./pages/hashtags/Page";
import Settings from "./pages/settings/Page";
import Chat from "./pages/chat/Page";

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
            path: "/categories/:id",
            element: <Category />,
         },
         {
            path: "/hashtag/:id",
            element: <Hashtag />,
         },
         {
            path: "/settings",
            element: <Settings />,
         },
         {
            path: "/chat",
            element: <Chat />,
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
