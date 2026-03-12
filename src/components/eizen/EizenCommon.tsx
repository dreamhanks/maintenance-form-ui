import React from "react";
import { CheckRow, NeedFlag, YesNo } from "./EizenFormTypes";
import { cellLabel, cellValue, textareaClass } from "./EizenFormStyles";

export function LabelCell({ children }: { children: React.ReactNode }) {
  return <div className={cellLabel}>{children}</div>;
}

export function ValueCell({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <div className={`${cellValue} ${className}`}>{children ? children : ""}</div>;
}

export function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="mr-4 inline-flex items-center gap-2 whitespace-nowrap">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-400 text-sky-600 focus:ring-sky-500"
      />
      <span className="text-sm text-slate-800">{label}</span>
    </label>
  );
}

export function NeedSwitch({
  name,
  value,
  onChange,
}: {
  name: string;
  value: NeedFlag;
  onChange: (v: NeedFlag) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <label className="inline-flex items-center gap-2">
        <input
          type="radio"
          name={name}
          checked={value === "必要"}
          onChange={() => onChange("必要")}
          className="h-4 w-4 border-slate-400 text-sky-600 focus:ring-sky-500"
        />
        <span className="text-sm">必要</span>
      </label>
      <label className="inline-flex items-center gap-2">
        <input
          type="radio"
          name={name}
          checked={value === "不要"}
          onChange={() => onChange("不要")}
          className="h-4 w-4 border-slate-400 text-sky-600 focus:ring-sky-500"
        />
        <span className="text-sm">不要</span>
      </label>
    </div>
  );
}

export function YesNoSwitch({
  name,
  value,
  onChange,
}: {
  name: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <label className="inline-flex items-center gap-2">
        <input
          type="radio"
          name={name}
          checked={value === "なし"}
          onChange={() => onChange("なし")}
          className="h-4 w-4 border-slate-400 text-sky-600 focus:ring-sky-500"
        />
        <span className="text-sm">なし</span>
      </label>
      <label className="inline-flex items-center gap-2">
        <input
          type="radio"
          name={name}
          checked={value === "あり"}
          onChange={() => onChange("あり")}
          className="h-4 w-4 border-slate-400 text-sky-600 focus:ring-sky-500"
        />
        <span className="text-sm">あり</span>
      </label>
    </div>
  );
}

export function MatrixRow({
    index,
    type,
    row,
    onChange,
}: {
    index: number;
    type: number;
    row: CheckRow;
    onChange: (next: CheckRow) => void;
}) {
  const optionEntries = Object.entries(row.checks);

  let htmlText = <div className="col-span-1" />

  if(type === 1 && (index === 0 || index === 6 || index === 13 || index === 14)) {
    htmlText = <div className="col-span-1 border-t border-slate-300 px-3 py-3 text-sm font-semibold text-slate-800">{row.category}</div>
  } else if (type === 2 && (index === 0 || index === 5 || index === 7 || index === 13)) {
    htmlText = <div className="col-span-1 border-t border-slate-300 px-3 py-3 text-sm font-semibold text-slate-800">{row.category}</div>
  }

  return (
    <div className="grid [grid-template-columns:repeat(24,minmax(0,1fr))]">
        {htmlText}
      {/* <div className="col-span-1 border border-slate-300 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-800">
        {row.category}
      </div> */}

      <div className="col-span-3 border border-slate-300 px-3 py-3 text-sm text-slate-900">
        {row.item}
      </div>

      <div className="col-span-2 border border-slate-300 px-3 py-3">
        <div className="flex flex-col gap-2">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="radio"
              name={`${row.id}-need`}
              checked={row.need === "必要"}
              onChange={() => onChange({ ...row, need: "必要" })}
              className="h-4 w-4 border-slate-400 text-sky-600 focus:ring-sky-500"
            />
            必要
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="radio"
              name={`${row.id}-need`}
              checked={row.need === "不要"}
              onChange={() => onChange({ ...row, need: "不要" })}
              className="h-4 w-4 border-slate-400 text-sky-600 focus:ring-sky-500"
            />
            不要
          </label>
        </div>
      </div>

      <div className="col-span-6 border border-slate-300 px-3 py-3">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {optionEntries.map(([key, val]) => (
            <Check
              key={key}
              label={key}
              checked={val}
              onChange={(checked) =>
                onChange({
                  ...row,
                  checks: {
                    ...row.checks,
                    [key]: checked,
                  },
                })
              }
            />
          ))}

          {row.unit && (
            <div className="inline-flex items-center gap-2">
              <input
                value={row.amount || ""}
                onChange={(e) => onChange({ ...row, amount: e.target.value })}
                className="w-24 rounded-md border border-slate-300 px-2 py-1 text-sm"
              />
              <span className="text-sm text-slate-700">{row.unit}</span>
            </div>
          )}
        </div>
      </div>

      <div className="col-span-1 border border-slate-300 px-3 py-3 text-center">
        <input
          type="checkbox"
          checked={row.managerConfirm}
          onChange={(e) => onChange({ ...row, managerConfirm: e.target.checked })}
          className="mt-1 h-4 w-4 rounded border-slate-400 text-sky-600 focus:ring-sky-500"
        />
      </div>

      <div className="col-span-11 border border-slate-300 px-2 py-2">
        {/* <input
          value={row.remark}
          onChange={(e) => onChange({ ...row, remark: e.target.value })}
          className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
          placeholder="備考"
        /> */}
        <textarea placeholder="備考" value={row.remark} onChange={(e) => onChange({ ...row, remark: e.target.value })} rows={3} className={textareaClass} />
      </div>
    </div>
  );
}