import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi, type User, type LoginResponse } from "../form/api";

type AuthContextValue = {
  user: User | null;
  mustChangePassword: boolean;
  loading: boolean;
  login: (employeeCode: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  setMustChangePassword: (v: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const u = await authApi.me();
      setUser(u);
      const must = await authApi.mustChangePassword();
      setMustChangePassword(must);
    } catch {
      setUser(null);
      setMustChangePassword(false);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    })();
  }, []);

  const login = async (employeeCode: string, password: string) => {
    // const resp = await authApi.login({ employeeCode, password });
    const resp = {
      user: {
        departmentName: null,
        employeeCode: "0001",
        employmentType: null,
        employmentTypeName: null,
        fullName: "テスト 太郎",
        fullNameKana: "テスト タロウ",
        jobTypeName: null,
        office: null,
        qualificationCode: null,
        roleTitle: null,
        sectionName: null,
        userId: "0001"
      },
      mustChangePassword: false
    }
    console.log('resp ', employeeCode, password)
    setUser(resp.user);
    setMustChangePassword(resp.mustChangePassword);
    return resp;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setMustChangePassword(false);
  };

  const value = useMemo(
    () => ({ user, mustChangePassword, loading, login, logout, refresh, setMustChangePassword }),
    [user, mustChangePassword, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const v = useContext(AuthContext);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
