import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";

import Dashboard from "../features/Dashboard/Dashboard";
import Wallets from "../features/Wallets/Wallets";
import Reports from "../features/Reports";
import Transactions from "../features/Transactions/Transactions";
import Settings from "../features/Settings/Settings";
import Categories from "../features/Categories/Categories";
import Invoices from "../features/Invoices";
import Profile from "../features/Profile/Profile";

import RegisterPage from "../features/Auth/Register";
import LoginPage from "../features/Auth/Login";

import ReceiptPage from "../features/Transactions/pages/TransactionReceiptPage";
import LandingPage from "../features/LandingPage";

import { ROUTES } from "../utils/Routes";

const router = createBrowserRouter([
  // =========================================================
  // PUBLIC ROUTES
  // =========================================================

  {
    path: ROUTES.landing,
    element: <LandingPage />,
  },

  {
    path: ROUTES.login,
    element: <LoginPage />,
  },

  {
    path: ROUTES.register,
    element: <RegisterPage />,
  },

  // =========================================================
  // PROTECTED ROUTES
  // =========================================================

  {
    element: <AppLayout />,
    children: [
      {
        path: ROUTES.dashboard,
        element: <Dashboard />,
      },

      {
        path: ROUTES.wallets,
        element: <Wallets />,
      },

      {
        path: ROUTES.transactions,
        element: <Transactions />,
      },

      {
        path: ROUTES.transactionPage,
        element: <ReceiptPage />,
      },

      {
        path: ROUTES.reports,
        element: <Reports />,
      },

      {
        path: ROUTES.invoices,
        element: <Invoices />,
      },

      {
        path: ROUTES.categories,
        element: <Categories />,
      },

      {
        path: ROUTES.settings,
        element: <Settings />,
      },

      {
        path: ROUTES.profile,
        element: <Profile />,
      },
    ],
  },
]);

export default router;