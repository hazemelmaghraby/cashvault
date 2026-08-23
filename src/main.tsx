import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./app/router";
import "./index.css";
import { WalletProvider } from "./context/WalletContext";
import { TransactionProvider } from "./context/TransactionContext";
import { CategoryProvider } from "./context/CategoryContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <WalletProvider>
        <TransactionProvider>
          <CategoryProvider>
            <RouterProvider router={router} />
          </CategoryProvider>
        </TransactionProvider>
      </WalletProvider>
    </AuthProvider>
  </React.StrictMode>
);