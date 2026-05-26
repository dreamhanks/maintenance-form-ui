export const LOST_REASON_OPTIONS = [
  { value: "1", label: "合意解約" },
  { value: "2", label: "建替" },
  { value: "3", label: "金銭的事情" },
  { value: "4", label: "工事内容" },
  { value: "5", label: "他社施工" },
  { value: "6", label: "その他" },
];

export const LOST_REASON_LABELS: Record<string, string> = Object.fromEntries(
  LOST_REASON_OPTIONS.map((o) => [o.value, o.label])
);
