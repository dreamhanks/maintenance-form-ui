import { FullForm, toJson } from "./formTypes";

export function buildMultipartFormData(form: FullForm): FormData {
  const fd = new FormData();

  // 1) JSON payload as a string part
  fd.append("payload", JSON.stringify(toJson(form)));

  // 2) kasetsu file (if any)
  if (form.kasetsu.ashiba_partialFile) {
    fd.append("ashiba_partialFile", form.kasetsu.ashiba_partialFile);
  }

  // 3) tenpu files: key = id like "pre_site_plan"
  for (const [key, file] of Object.entries(form.tenpu.fileMap)) {
    if (file) fd.append(key, file);
  }

  return fd;
}
