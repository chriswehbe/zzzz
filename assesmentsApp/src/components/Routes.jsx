import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
// import { useAuth } from "./AuthProvider";
import Home from "./Home";
import Signup from "./Signup";
import Login from "./Login";
import CreateMaterial from "./CreateMaterial";
import CreateAssesment from "./CreateAssesment";
import PreCreateAssesment from "./PreCreateAssesment";
import AssesmentsView from "./AssesmentsView";
import EditAssesment from "./EditAssesment";
import AnswerAssesment from "./AnswerAssesment";
import { AdminProtectedRoute } from "./AdminProtectedRoute";
import UserView from "./UserView";
import AssesmentResults from "./AssesmentResults";
import Answers from "./Answers";
import UserAnswers from "./UserAnswers";
const Routes = () => {
  //   const { token } = useAuth();

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/answerAssesment",
          element: <AnswerAssesment />,
        },
        {
          path: "/userView",
          element: <UserView />,
        },
      ],
    },
  ];
  const routesForAdminOnly = [
    {
      path: "/", // Change this path to the appropriate admin route
      element: <AdminProtectedRoute />,
      children: [
        {
          path: "/createMaterial",
          element: <CreateMaterial />,
        },
        {
          path: "/createAssesment",
          element: <CreateAssesment />,
        },
        {
          path: "/preCreateAssesment",
          element: <PreCreateAssesment />,
        },
        {
          path: "/assesmentsView",
          element: <AssesmentsView />,
        },
        {
          path: "/editAssesment",
          element: <EditAssesment />,
        },
        {
          path: "/answerAssesment",
          element: <AnswerAssesment />,
        },
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/assesmentResults",
          element: <AssesmentResults />,
        },
        {
          path: "/answers",
          element: <Answers />,
        },
        {
          path: "/userAnswers",
          element: <UserAnswers />,
        },
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/Login",
      element: <Login />,
    },
    {
      path: "/Signup",
      element: <Signup />,
    },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForNotAuthenticatedOnly,
    ...routesForAuthenticatedOnly,
    ...routesForAdminOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
