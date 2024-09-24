import { Dashboard } from "@/components/Dashboard";
import React from "react";
import { auth } from "@/auth";
import SignIn from "./auth/signin/page";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";

const TodoList = async () => {
  const session = await auth();

  if (session) {
    return (
      <SessionProvider session={session}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Dashboard session={session} />
      </SessionProvider>
    );
  }

  return <SignIn />;
};

export default TodoList;
