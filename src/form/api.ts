import { API_BASE } from "../config";

// Centralized auth-failure handler. Any 401/403 from the backend means the
// session is gone — bounce the user to /unauthorized. Skip when the failing
// call is itself an auth endpoint, otherwise /api/auth/me probing would loop.
function handleAuthFailure(path: string, status: number): boolean {
  if (status !== 401 && status !== 403) return false;
  if (path.includes("/api/auth/")) return false;
  if (typeof window !== "undefined" && window.location.pathname !== "/unauthorized") {
    window.location.href = "/unauthorized";
  }
  return true;
}

// Unwrap JSON error bodies like {"message":"..."} → "...", falling through
// to raw text or the HTTP status fallback when the body isn't JSON.
function parseErrorMessage(text: string, fallback: string): string {
  if (!text) return fallback;
  try {
    const json = JSON.parse(text);
    return json.message || text;
  } catch {
    return text;
  }
}

export type User = {
  employeeCode: string;
  fullName: string;
  companyCode: string;
  departmentCode: string;
  positionCode: string;
  groupCode: string;
  isAdmin: boolean;
  branchCodes: string[];
  role?: string | null;
};

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
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
    throw new Error(parseErrorMessage(text, `HTTP ${res.status}`));
  }

  // logout returns empty
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) return undefined as T;

  return (await res.json()) as T;
}

export const authApi = {
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
    throw new Error(parseErrorMessage(text, `HTTP ${res.status}`));
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
    const text = await res.text().catch(() => "");
    throw new Error(parseErrorMessage(text, `HTTP ${res.status}`));
  }
  return res.json();
}

export type PagedApiResponse<T> = {
  rows: T[];
  totalCount: number;
  page: number;
  hasMore: boolean;
};

export type ListApiParams = {
  page?: number;
  size?: number;
  sortKey?: string | null;
  sortDir?: "asc" | "desc";
  filters?: Record<string, string[]>;
};

function buildListQuery(params: ListApiParams): URLSearchParams {
  const q = new URLSearchParams();
  q.set("page", String(params.page ?? 0));
  q.set("size", String(params.size ?? 100));
  if (params.sortKey) q.set("sortKey", params.sortKey);
  if (params.sortDir) q.set("sortDir", params.sortDir);
  if (params.filters && Object.keys(params.filters).length > 0) {
    q.set("filters", JSON.stringify(params.filters));
  }
  return q;
}

export const formApi = {
  create: (fd: FormData) => postMultipart("/api/forms", fd),
  update: (id: number, fd: FormData) => putMultipart(`/api/forms/${id}`, fd),
  get: (id: number) => request<any>(`/api/forms/${id}`),
  list: (params: ListApiParams) => {
    const q = buildListQuery(params);
    return request<PagedApiResponse<any>>(`/api/forms/list?${q}`);
  },
  columnValues: (params: { column: string }) => {
    const q = new URLSearchParams();
    q.set("column", params.column);
    return request<{ values: string[] }>(`/api/forms/column-values?${q}`);
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

export type PropertySearchResult = {
  buildingName: string;
  completionDate: string;
  productName: string;
  address: string;
  branchCode: string;
  branchName: string;
};

export const propertyApi = {
  search: (propertyCd: string, propertyCd3: string) =>
    request<PropertySearchResult>(
      `/api/property/search?propertyCd=${propertyCd}&propertyCd3=${propertyCd3}`,
    ),
};

export type DesignSearchResult = {
  employeeCode: string;
  employeeName: string;
};

export const designApi = {
  search: (employeeCd: string, branchCode: string) =>
    request<DesignSearchResult>(
      `/api/design/search?employeeCd=${encodeURIComponent(employeeCd)}&branchCode=${encodeURIComponent(branchCode)}`,
    ),
};

export type BusinessSearchResult = {
  employeeCode: string;
  employeeName: string;
};

export const businessApi = {
  search: (employeeCd: string, branchCode: string, companyCode: string) =>
    request<BusinessSearchResult>(
      `/api/business/search?employeeCd=${encodeURIComponent(employeeCd)}&branchCode=${encodeURIComponent(branchCode)}&companyCode=${encodeURIComponent(companyCode)}`,
    ),
};

export type JudgmentListApiParams = ListApiParams & { judgment?: string };

function buildJudgmentListQuery(params: JudgmentListApiParams): URLSearchParams {
  const q = buildListQuery(params);
  if (params.judgment) q.set("judgment", params.judgment);
  return q;
}

export const judgmentApi = {
  set: (formId: number, body: { judgment: string; contractDate?: string; lostDate?: string }) =>
    request<any>(`/api/forms/${formId}/judgment`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  setJudgment: (
    formId: number,
    body: {
      judgment: string;
      contractDate: string | null;
      lostDate: string | null;
      holdDate: string | null;
      buildingCode2?: string;
    },
  ) =>
    request<void>(`/api/forms/${formId}/judgment`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  restore: (formId: number) =>
    request<void>(`/api/forms/${formId}/judgment/restore`, {
      method: "POST",
    }),
  list: (params: JudgmentListApiParams) => {
    const q = buildJudgmentListQuery(params);
    return request<PagedApiResponse<any>>(`/api/judgment/list?${q}`);
  },
  columnValues: (params: { judgment?: string; column: string }) => {
    const q = new URLSearchParams();
    if (params.judgment) q.set("judgment", params.judgment);
    q.set("column", params.column);
    return request<{ values: string[] }>(`/api/judgment/column-values?${q}`);
  },
};

export type MitsumoriIraishoDto = {
  id: number;
  formRecordId: number;
  formData: Record<string, any>;
  attachmentFieldKeys?: string[];
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
  autofillInfo: (formRecordId: number) =>
    request<{
      tantosha: string;
      bushoName: string;
      zipCode: string;
      address: string;
      tel: string;
      email: string;
    }>(`/api/mitsumori-iraisho/${formRecordId}/autofill-info`, { method: "GET" }),
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
