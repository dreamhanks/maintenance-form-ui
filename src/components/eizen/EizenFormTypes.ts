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
  otherText?: string;
  remark: string;
  managerConfirm: boolean;
  variant?: "betsuto" | "checksInConfirm" | "fullInput" | "twoLine" | "twoLineReverse" | "noRadioTwoLine";
  line2Check?: string;
  line2Checked?: boolean;
  splitAt?: number;
  radioColKeys?: string[];
  amountFirst?: boolean;
  remarkExtra?: { label: string; value: string; fileUploadFieldKey?: string; fileCheckboxValue?: boolean }[];
};