import React from "react";
import { CheckRow, NeedFlag, YesNo } from "./EizenFormTypes";
import { cellLabel, cellValue, inputClass, textareaClass } from "./EizenFormStyles";

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
    categoryCheckbox,
}: {
    index: number;
    type: number;
    row: CheckRow;
    onChange: (next: CheckRow) => void;
    categoryCheckbox?: { checked: boolean; onChange: (v: boolean) => void };
}) {
  const optionEntries = Object.entries(row.checks);

  const categoryContent = categoryCheckbox ? (
    <label className="inline-flex items-center gap-1 whitespace-nowrap cursor-pointer">
      <input type="checkbox" checked={categoryCheckbox.checked} onChange={(e) => categoryCheckbox.onChange(e.target.checked)} className="h-4 w-4 shrink-0 rounded border-slate-400 text-sky-600 focus:ring-sky-500" />
      <span>{row.category}</span>
    </label>
  ) : row.category;

  let htmlText = <div className="col-span-1" />

  if(type === 1 && (index === 0 || index === 7 || index === 15 || index === 16)) {
    htmlText = <div className="col-span-1 overflow-visible border-t border-slate-300 text-sm font-semibold text-slate-800" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
      {categoryContent}
    </div>
  } else if (type === 2 && (index === 0 || index === 6 || index === 8 || index === 14)) {
    htmlText = <div className="col-span-1 overflow-visible border-t border-slate-300 text-sm font-semibold text-slate-800" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
      {categoryContent}
    </div>
  }

  return (
    <div className="grid [grid-template-columns:repeat(24,minmax(0,1fr))]">
        {htmlText}
      {/* <div className="col-span-1 border border-slate-300 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-800">
        {row.category}
      </div> */}

      {row.variant === "betsuto" ? (
        <>
          <div className="col-span-11 border border-slate-300 px-3 py-3 text-sm text-slate-900">
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap">{row.item}</span>
              <input
                value={row.amount || ""}
                onChange={(e) => onChange({ ...row, amount: e.target.value })}
                className={inputClass}
              />
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
        </>
      ) : row.variant === "noRadioTwoLine" ? (
        <>
          <div className="col-span-3 border border-slate-300 px-3 py-3 text-sm text-slate-900">
            {row.item}
          </div>

          <div className="col-span-2 border border-slate-300 px-3 py-3">
            {row.radioColKeys && (
              <div className="flex flex-col gap-2">
                {row.radioColKeys.map((rk) => (
                  <Check
                    key={rk}
                    label={rk}
                    checked={row.checks[rk] ?? false}
                    onChange={(checked) =>
                      onChange({ ...row, checks: { ...row.checks, [rk]: checked } })
                    }
                  />
                ))}
              </div>
            )}
          </div>

          <div className="col-span-6 border border-slate-300 px-3 py-3">
            <div className={`grid gap-2 ${row.radioColKeys ? "grid-cols-1" : "grid-cols-2"}`}>
              {optionEntries.filter(([key]) => !row.radioColKeys?.includes(key)).map(([key, val]) => (
                <div key={key} className="flex items-center gap-1">
                  <Check
                    label={key}
                    checked={val}
                    onChange={(checked) =>
                      onChange({ ...row, checks: { ...row.checks, [key]: checked } })
                    }
                  />
                  {key === "その他" && row.otherText !== undefined && (
                    <div className="inline-flex items-center gap-1 text-sm">
                      <span>（</span>
                      <input
                        value={row.otherText}
                        onChange={(e) => onChange({ ...row, otherText: e.target.value })}
                        className={inputClass + " w-24"}
                      />
                      <span>）</span>
                    </div>
                  )}
                </div>
              ))}
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
        </>
      ) : (
        <>
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
            {row.variant === "fullInput" ? (
              <textarea
                value={row.amount || ""}
                onChange={(e) => onChange({ ...row, amount: e.target.value })}
                rows={3}
                className={textareaClass}
              />
            ) : row.variant === "twoLine" ? (
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  {optionEntries.slice(0, row.splitAt ?? 1).map(([key, val]) => (
                    <Check
                      key={key}
                      label={key}
                      checked={val}
                      onChange={(checked) =>
                        onChange({ ...row, checks: { ...row.checks, [key]: checked } })
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
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  {optionEntries.slice(row.splitAt ?? 1).filter(([key]) => !(row.otherText !== undefined && key === "その他")).map(([key, val]) => (
                    <Check
                      key={key}
                      label={key}
                      checked={val}
                      onChange={(checked) =>
                        onChange({ ...row, checks: { ...row.checks, [key]: checked } })
                      }
                    />
                  ))}
                </div>
                {row.otherText !== undefined && row.checks["その他"] !== undefined && (
                  <div className="flex items-center gap-1">
                    <Check
                      label="その他"
                      checked={row.checks["その他"]}
                      onChange={(checked) =>
                        onChange({ ...row, checks: { ...row.checks, "その他": checked } })
                      }
                    />
                    <div className="inline-flex items-center gap-1 text-sm">
                      <span>（</span>
                      <input
                        value={row.otherText}
                        onChange={(e) => onChange({ ...row, otherText: e.target.value })}
                        className={inputClass + " w-32"}
                      />
                      <span>）</span>
                    </div>
                  </div>
                )}
              </div>
            ) : row.variant === "twoLineReverse" ? (
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  {optionEntries.filter(([key]) => !(row.otherText !== undefined && key === "その他")).map(([key, val], i) => (
                    <React.Fragment key={key}>
                      <Check
                        label={key}
                        checked={val}
                        onChange={(checked) =>
                          onChange({ ...row, checks: { ...row.checks, [key]: checked } })
                        }
                      />
                      {(i === optionEntries.filter(([k]) => !(row.otherText !== undefined && k === "その他")).length - 1 && !optionEntries.some(([k]) => k === "その他") && row.otherText !== undefined) && (
                        <div className="inline-flex items-center gap-1 text-sm">
                          <span>（</span>
                          <input
                            value={row.otherText}
                            onChange={(e) => onChange({ ...row, otherText: e.target.value })}
                            className={inputClass + " w-32"}
                          />
                          <span>）</span>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                {row.otherText !== undefined && row.checks["その他"] !== undefined && (
                  <div className="flex items-center gap-1">
                    <Check
                      label="その他"
                      checked={row.checks["その他"]}
                      onChange={(checked) =>
                        onChange({ ...row, checks: { ...row.checks, "その他": checked } })
                      }
                    />
                    <div className="inline-flex items-center gap-1 text-sm">
                      <span>（</span>
                      <input
                        value={row.otherText}
                        onChange={(e) => onChange({ ...row, otherText: e.target.value })}
                        className={inputClass + " w-32"}
                      />
                      <span>）</span>
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  {row.line2Check && (
                    <Check
                      label={row.line2Check}
                      checked={row.line2Checked ?? false}
                      onChange={(checked) =>
                        onChange({ ...row, line2Checked: checked })
                      }
                    />
                  )}
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
            ) : (
            <div className="flex flex-col gap-2">
              {row.amountFirst && row.unit && (
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  <div className="inline-flex items-center gap-2">
                    <input
                      value={row.amount || ""}
                      onChange={(e) => onChange({ ...row, amount: e.target.value })}
                      className="w-24 rounded-md border border-slate-300 px-2 py-1 text-sm"
                    />
                    <span className="text-sm text-slate-700">{row.unit}</span>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {row.variant !== "checksInConfirm" && optionEntries.filter(([key]) => !(row.otherText !== undefined && key === "その他")).map(([key, val]) => (
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

                {!row.amountFirst && row.unit && (
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
              {row.otherText !== undefined && row.checks["その他"] !== undefined && (
                <div className="flex items-center gap-1">
                  <Check
                    label="その他"
                    checked={row.checks["その他"]}
                    onChange={(checked) =>
                      onChange({ ...row, checks: { ...row.checks, "その他": checked } })
                    }
                  />
                  <div className="inline-flex items-center gap-1 text-sm">
                    <span>（</span>
                    <input
                      value={row.otherText}
                      onChange={(e) => onChange({ ...row, otherText: e.target.value })}
                      className={inputClass + " w-32"}
                    />
                    <span>）</span>
                  </div>
                </div>
              )}
            </div>
            )}
          </div>

          <div className="col-span-1 border border-slate-300 px-3 py-3 text-center">
            {row.variant === "checksInConfirm" ? (
              <div className="flex flex-col gap-2">
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
              </div>
            ) : (
              <input
                type="checkbox"
                checked={row.managerConfirm}
                onChange={(e) => onChange({ ...row, managerConfirm: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-slate-400 text-sky-600 focus:ring-sky-500"
              />
            )}
          </div>
        </>
      )}

      <div className="col-span-11 border border-slate-300 px-2 py-2">
        {!row.remarkExtra && (
          <textarea placeholder="備考" value={row.remark} onChange={(e) => onChange({ ...row, remark: e.target.value })} rows={3} className={textareaClass} />
        )}
        {row.remarkExtra && row.remarkExtra.map((extra, i) => (
          <div key={i} className="mt-2 flex items-center gap-2">
            <span className="whitespace-nowrap text-sm text-slate-700">{extra.label}</span>
            <input
              value={extra.value}
              onChange={(e) => {
                const updated = [...row.remarkExtra!];
                updated[i] = { ...updated[i], value: e.target.value };
                onChange({ ...row, remarkExtra: updated });
              }}
              className={inputClass}
            />
          </div>
        ))}
      </div>
    </div>
  );
}