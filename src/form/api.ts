const API_BASE = "http://localhost:8080";

// Centralized auth-failure handler. Any 401/403 from the backend means the
// session is gone — bounce the user to /login. Skip when the failing call
// is itself an auth endpoint, otherwise /api/auth/me probing would loop.
function handleAuthFailure(path: string, status: number): boolean {
  if (status !== 401 && status !== 403) return false;
  if (path.includes("/api/auth/")) return false;
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
  return true;
}

export type LoginRequest = {
  employeeCode: string;
  password: string;
};

export type LoginResponse = {
  user: User;
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
  role?: string | null;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method?.toUpperCase() ?? "GET";
  const needsContentType = method !== "GET" && method !== "HEAD";
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(needsContentType ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers ?? {}),
    },
    credentials: "include", // IMPORTANT: send/receive JSESSIONID
  });

  if (!res.ok) {
    if (handleAuthFailure(path, res.status)) throw new Error("unauthorized");
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
  logout: () => request<void>("/api/auth/logout", { method: "POST" }),
};


export async function postMultipart(url: string, fd: FormData) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: "POST",
    body: fd,
    credentials: "include",
  });
  if (!res.ok) {
    if (handleAuthFailure(url, res.status)) throw new Error("unauthorized");
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
  if (!res.ok) {
    if (handleAuthFailure(url, res.status)) throw new Error("unauthorized");
    throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
  }
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
  relatedForms: (id: number) =>
    request<RelatedFormDto[]>(`/api/forms/${id}/related-forms`),
};

export type RelatedFormDto = {
  formRecordId: number;
  documentNo: string | null;
  buildingCode2: string;
};

export type WorkflowStepDto = {
  stepNumber: number;
  stepName: string;
  stepLabel: string;
  status: string;
  actorEmployeeCode: string | null;
  actorName: string | null;
  comment: string | null;
  actionedAt: string | null;
};

export const workflowApi = {
  get: (id: number) => request<WorkflowStepDto[]>(`/api/forms/${id}/workflow`),
  confirm: (id: number, step: number) =>
    request<WorkflowStepDto[]>(`/api/forms/${id}/workflow/confirm?step=${step}`, {
      method: "POST",
      body: JSON.stringify({}),
    }),
  reject: (id: number, step: number) =>
    request<WorkflowStepDto[]>(`/api/forms/${id}/workflow/reject?step=${step}`, {
      method: "POST",
      body: JSON.stringify({}),
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

export type OfficeDto = {
  officeCode: string;
  officeName: string;
};

export const masterApi = {
  offices: () => request<OfficeDto[]>("/api/master/offices"),
  userOffices: () => request<OfficeDto[]>("/api/master/user-offices"),
};

export type MitsumoriIraishoDto = {
  id: number;
  formRecordId: number;
  formData: Record<string, any>;
};

export const mitsumoriApi = {
  /** Returns the record, or null if not found (404). Throws on other errors. */
  get: async (formRecordId: number): Promise<MitsumoriIraishoDto | null> => {
    const res = await fetch(`${API_BASE}/api/mitsumori-iraisho/${formRecordId}`, {
      credentials: "include",
    });
    if (res.status === 404) return null;
    if (!res.ok) {
      if (handleAuthFailure(`/api/mitsumori-iraisho/${formRecordId}`, res.status)) throw new Error("unauthorized");
      throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
    }
    return (await res.json()) as MitsumoriIraishoDto;
  },
  create: (formRecordId: number) =>
    request<MitsumoriIraishoDto>(`/api/mitsumori-iraisho/${formRecordId}`, { method: "POST" }),
  update: (formRecordId: number, formData: Record<string, any>) =>
    request<MitsumoriIraishoDto>(`/api/mitsumori-iraisho/${formRecordId}`, {
      method: "PUT",
      body: JSON.stringify(formData),
    }),
};

export const attachmentApi = {
  upload: (formId: number, fieldKey: string, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return fetch(`${API_BASE}/api/forms/${formId}/files/${fieldKey}`, {
      method: "POST",
      body: fd,
      credentials: "include",
    }).then(r => {
      if (!r.ok) {
        if (handleAuthFailure(`/api/forms/${formId}/files/${fieldKey}`, r.status)) throw new Error("unauthorized");
        throw new Error();
      }
      return r.json();
    });
  },
  delete: (formId: number, fieldKey: string) =>
    request<void>(`/api/forms/${formId}/files/${fieldKey}`, { method: "DELETE" }),
  list: (formId: number) =>
    request<any[]>(`/api/forms/${formId}/attachments`),
  openUrl: (formId: number, fieldKey: string) =>
    `${API_BASE}/api/forms/${formId}/files/${fieldKey}`,
};
