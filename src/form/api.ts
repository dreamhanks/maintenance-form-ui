const API_BASE = "http://localhost:8080";

export type LoginRequest = {
  employeeCode: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  mustChangePassword: boolean;
};

export type User = {
  employeeCode: string;
  fullName: string;
  fullNameKana?: string | null;
  userId: string;
  roleTitle?: string | null;
  qualificationCode?: string | null;
  office?: string | null;
  departmentName?: string | null;
  sectionName?: string | null;
  jobTypeName?: string | null;
  employmentType?: string | null;
  employmentTypeName?: string | null;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    credentials: "include", // IMPORTANT: send/receive JSESSIONID
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }

  // logout returns empty
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) return undefined as T;

  return (await res.json()) as T;
}

export const authApi = {
  login: (req: LoginRequest) => request<LoginResponse>("/api/auth/login", { method: "POST", body: JSON.stringify(req) }),
  me: () => request<User>("/api/auth/me", { method: "GET" }),
  mustChangePassword: () => request<boolean>("/api/auth/must-change-password", { method: "GET" }),

  changePassword: (currentPassword: string, newPassword: string) =>
    request<void>("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  logout: () => request<void>("/api/auth/logout", { method: "POST" }),
};


export async function postMultipart(url: string, fd: FormData) {
  const res = await fetch(url, {
    method: "POST",
    body: fd,
    credentials: "include", // IMPORTANT
  });

  if (!res.ok) {
    const ct = res.headers.get("content-type") || "";
    const msg = ct.includes("application/json")
      ? (await res.json())?.message ?? "Upload failed"
      : await res.text();
    throw new Error(msg);
  }
  
  return res.json();
}

export async function putMultipart(url: string, fd: FormData) {
  const res = await fetch(url, { 
    method: "PUT", 
    body: fd,
    credentials: "include", // IMPORTANT 
  });

  if (!res.ok) throw new Error(await res.text());
  
  return res.json();
}


export async function confirmStep(formId: number, step: string) {
  const url = new URL(`http://localhost:8080/api/forms/${formId}/confirm`);
  url.searchParams.set("step", step);

  const res = await fetch(url.toString(), {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
