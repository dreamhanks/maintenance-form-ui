import DatePicker, { registerLocale } from "react-datepicker";
import { ja } from "date-fns/locale/ja";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("ja", ja);

type Props = {
  value: string; // "yyyy-MM-dd" or ""
  onChange: (value: string) => void;
  className?: string;
  placeholderText?: string;
};

function toDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function toStr(d: Date | null): string {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function JaDatePicker({ value, onChange, className, placeholderText }: Props) {
  return (
    <DatePicker
      locale="ja"
      dateFormat="yyyy年MM月dd日"
      selected={toDate(value)}
      onChange={(d: Date | null) => onChange(toStr(d))}
      className={className}
      placeholderText={placeholderText ?? "年/月/日"}
    />
  );
}


