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
  const res = await fetch(`${API_BASE}${url}`, {
    method: "POST",
    body: fd,
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function putMultipart(url: string, fd: FormData) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: "PUT",
    body: fd,
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const formApi = {
  create: (fd: FormData) => postMultipart("/api/forms", fd),
  update: (id: number, fd: FormData) => putMultipart(`/api/forms/${id}`, fd),
  get: (id: number) => request<any>(`/api/forms/${id}`),
  list: (params?: { salesOffice?: string; keyword?: string; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.salesOffice) q.set("salesOffice", params.salesOffice);
    if (params?.keyword) q.set("keyword", params.keyword);
    if (params?.status) q.set("status", params.status);
    return request<any[]>(`/api/forms/list?${q}`);
  },
  delete: (id: number) => request<void>(`/api/forms/${id}`, { method: "DELETE" }),
  downloadUrl: (id: number, fieldKey: string) =>
    `${API_BASE}/api/forms/${id}/files/${fieldKey}`,
};

export const workflowApi = {
  get: (id: number) => request<any[]>(`/api/forms/${id}/workflow`),
  approve: (id: number, step: string, approverName: string) =>
    request<any>(`/api/forms/${id}/approve?step=${encodeURIComponent(step)}`, {
      method: "POST",
      body: JSON.stringify({ approverName }),
    }),
};

export const judgmentApi = {
  set: (formId: number, body: { judgment: string; contractDate?: string; lostDate?: string }) =>
    request<any>(`/api/forms/${formId}/judgment`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  list: (params?: { salesOffice?: string; judgment?: string }) => {
    const q = new URLSearchParams();
    if (params?.salesOffice) q.set("salesOffice", params.salesOffice);
    if (params?.judgment) q.set("judgment", params.judgment);
    return request<any[]>(`/api/judgment/list?${q}`);
  },
};

export const masterApi = {
  offices: () => request<string[]>("/api/master/offices"),
};

export const attachmentApi = {
  upload: (formId: number, fieldKey: string, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return fetch(`${API_BASE}/api/forms/${formId}/files/${fieldKey}`, {
      method: "POST",
      body: fd,
      credentials: "include",
    }).then(r => { if (!r.ok) throw new Error(); return r.json(); });
  },
  delete: (formId: number, fieldKey: string) =>
    request<void>(`/api/forms/${formId}/files/${fieldKey}`, { method: "DELETE" }),
  list: (formId: number) =>
    request<any[]>(`/api/forms/${formId}/attachments`),
  openUrl: (formId: number, fieldKey: string) =>
    `${API_BASE}/api/forms/${formId}/files/${fieldKey}`,
};
