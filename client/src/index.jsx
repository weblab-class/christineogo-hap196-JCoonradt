import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import Home from "./components/pages/Home";
import NotFound from "./components/pages/NotFound";
import Branch from "./components/pages/Branch";
import Forest from "./components/pages/Forest";
import HowTo from "./components/pages/HowTo";
import Twig from "./components/pages/Twig";
import Leaf from "./components/pages/Leaf";
// import Stats from "./components/pages/Stats";
import FriendTree from "./components/pages/FriendTree";
import FriendBranch from "./components/pages/FriendBranch";
import FriendTwig from "./components/pages/FriendTwig";
import FriendLeaf from "./components/pages/FriendLeaf";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID =
  "1008460415148-6o42i6sdbcrpjn2skdf308i73hp57tmu.apps.googleusercontent.com";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<NotFound />} element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/forest" element={<Forest />} />
      <Route path="/tree/:userId" element={<Home />} />
      <Route path="/friend/:userId/tree" element={<FriendTree />} />
      <Route path="/friend/:userId/tree/branch/:branchId" element={<FriendBranch />} />
      <Route path="/friend/:userId/tree/branch/:branchId/twig/:twigId" element={<FriendTwig />} />
      <Route path="/friend/:userId/tree/branch/:branchId/twig/:twigId/leaf/:leafId" element={<FriendLeaf />} />
      <Route path="/tree/:userId/branch/:branchId" element={<Branch />} />
      <Route path="/tree/:userId/branch/:branchId/twig/:twigId" element={<Twig />} />
      <Route path="/howto" element={<HowTo />} />
      {/* Friend tree routes */}
      <Route path="/friend/:userId/tree" element={<FriendTree />} />
      <Route path="/friend/:userId/tree/branch/:branchId" element={<FriendBranch />} />
      <Route path="/friend/:userId/tree/twig/:twigId" element={<FriendTwig />} />
    </Route>
  )
);

// renders React Component "Root" into the DOM element with ID "root"
ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <RouterProvider router={router} />
  </GoogleOAuthProvider>
);
