export type NeedFlag = "" | "必要" | "不要";
export type YesNo = "" | "あり" | "なし";
export type OrderResult = "" | "受注" | "失注";

export type CheckRow = {
  id: string;
  category?: string;
  item: string;
  need: NeedFlag;
  checks: Record<string, boolean>;
  amount?: string;
  unit?: string;
  remark: string;
  managerConfirm: boolean;
};