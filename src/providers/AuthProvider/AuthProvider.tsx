import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { initAuth, selectAuth, updateAuth } from "@/features/auth/authSlice";
import { getUserLS } from "@/utils/authLS";
import { listenEvent } from "@/utils/event";
import { ReactNode, useEffect, useLayoutEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type AuthGuardProp = {
  children: ReactNode;
};

type AuthProviderProp = {
  children: ReactNode;
};

export const AuthEvent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // lắng nghe sự kiện redirect login
    listenEvent("auth:redirectLogin", () => {
      navigate("/login");
    });
  }, []);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export const AuthGuard = ({ children }: AuthGuardProp) => {
  const auth = useAppSelector(selectAuth);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!auth.isAuthenticated && auth.isInitialized) {
      navigate("/login");
      toast.error("Vui lòng đăng nhập");
    }
  }, [auth]);

  return <>{children}</>;
};

export const AuthProvider = ({ children }: AuthProviderProp) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // set auth store
    const user = getUserLS();
    if (user) {
      dispatch(
        updateAuth({
          isAuthenticated: true,
          user: user,
        }),
      );
    } else {
      dispatch(initAuth());
    }
  }, []);

  return <>{children}</>;
};
