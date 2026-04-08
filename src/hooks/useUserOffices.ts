import { useEffect, useState } from "react";
import { masterApi, type OfficeDto } from "../form/api";
import type { SalesOfficeOption } from "../types";

export function useUserOffices() {
  const [officeOptions, setOfficeOptions] = useState<SalesOfficeOption[]>([]);
  const [defaultOffice, setDefaultOffice] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    masterApi.userOffices()
      .then((offices: OfficeDto[]) => {
        if (cancelled) return;
        if (offices && offices.length > 0) {
          const opts = offices.map((o) => ({ label: o.officeName, value: o.officeName }));
          setOfficeOptions(opts);
          setDefaultOffice(opts[0].value);
        } else {
          return masterApi.offices().then((all: OfficeDto[]) => {
            if (cancelled) return;
            if (all && all.length > 0) {
              const opts = all.map((o) => ({ label: o.officeName, value: o.officeName }));
              setOfficeOptions(opts);
              setDefaultOffice(opts[0].value);
            } else {
              setError("営業所情報がありません");
            }
          });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "営業所情報の取得に失敗しました");
        }
      });
    return () => { cancelled = true; };
  }, []);

  return { officeOptions, defaultOffice, error };
}
