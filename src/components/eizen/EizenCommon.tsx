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
        className="h-4 w-4 rounded border-slate-400 text-[#17375E] focus:ring-[#17375E]"
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
          className="h-4 w-4 border-slate-400 text-[#17375E] focus:ring-[#17375E]"
        />
        <span className="text-sm">必要</span>
      </label>
      <label className="inline-flex items-center gap-2">
        <input
          type="radio"
          name={name}
          checked={value === "不要"}
          onChange={() => onChange("不要")}
          className="h-4 w-4 border-slate-400 text-[#17375E] focus:ring-[#17375E]"
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
          className="h-4 w-4 border-slate-400 text-[#17375E] focus:ring-[#17375E]"
        />
        <span className="text-sm">なし</span>
      </label>
      <label className="inline-flex items-center gap-2">
        <input
          type="radio"
          name={name}
          checked={value === "あり"}
          onChange={() => onChange("あり")}
          className="h-4 w-4 border-slate-400 text-[#17375E] focus:ring-[#17375E]"
        />
        <span className="text-sm">あり</span>
      </label>
    </div>
  );
}

export type MatrixRowFileUpload = {
  matchKey: string;
  fieldKey: string;
  attachments: Record<string, { filename: string; uploading: boolean }>;
  fileInputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  onFileCheckChange: (fieldKey: string, checked: boolean, setChecked: (v: boolean) => void) => void;
  onFileSelected: (fieldKey: string, file: File, setChecked: (v: boolean) => void) => void;
  getAttachmentUrl: (fieldKey: string) => string | null;
};

export type RemarkFileUploadContext = {
  attachments: Record<string, { filename: string; uploading: boolean }>;
  fileInputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  onFileSelected: (fieldKey: string, file: File, setChecked: (v: boolean) => void) => void;
  onFileCheckChange: (fieldKey: string, checked: boolean, setChecked: (v: boolean) => void) => void;
  getAttachmentUrl: (fieldKey: string) => string | null;
};

export function MatrixRow({
    index,
    type,
    row,
    onChange,
    onNeedChange,
    categoryCheckbox,
    fileUpload,
    sonotaFileUpload,
    remarkFileUpload,
    disableDapConfirmAndRemark,
    disableMainContent,
}: {
    index: number;
    type: number;
    row: CheckRow;
    onChange: (next: CheckRow) => void;
    onNeedChange?: (need: string) => void;
    categoryCheckbox?: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean };
    fileUpload?: MatrixRowFileUpload;
    sonotaFileUpload?: MatrixRowFileUpload;
    remarkFileUpload?: RemarkFileUploadContext;
    disableDapConfirmAndRemark?: boolean;
    disableMainContent?: boolean;
}) {
  const optionEntries = Object.entries(row.checks);

  const categoryContent = categoryCheckbox ? (
    <label className={`inline-flex items-center gap-1 whitespace-nowrap${categoryCheckbox.disabled ? " cursor-not-allowed" : " cursor-pointer"}`}>
      <input
        type="checkbox"
        checked={categoryCheckbox.checked}
        onChange={(e) => categoryCheckbox.onChange(e.target.checked)}
        disabled={categoryCheckbox.disabled}
        className={`h-4 w-4 shrink-0 rounded border-slate-400 text-[#17375E] focus:ring-[#17375E]${categoryCheckbox.disabled ? " opacity-50 cursor-not-allowed" : ""}`}
      />
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
          <fieldset disabled={disableMainContent} className="contents">
          <div className={`col-span-11 border border-slate-300 px-3 py-3 text-sm text-slate-900${disableMainContent ? " opacity-50" : ""}`}>
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap">{row.item}</span>
              <input
                value={row.amount || ""}
                onChange={(e) => onChange({ ...row, amount: e.target.value })}
                maxLength={200}
                className={inputClass}
              />
            </div>
          </div>
          </fieldset>
          <div className="col-span-1 border border-slate-300 px-3 py-3 text-center">
            <input
              type="checkbox"
              checked={row.managerConfirm}
              onChange={(e) => onChange({ ...row, managerConfirm: e.target.checked })}
              disabled={disableDapConfirmAndRemark}
              className={`mt-1 h-4 w-4 rounded border-slate-400 text-[#17375E] focus:ring-[#17375E]${disableDapConfirmAndRemark ? " opacity-50 cursor-not-allowed" : ""}`}
            />
          </div>
        </>
      ) : row.variant === "noRadioTwoLine" ? (
        <>
          <fieldset disabled={disableMainContent} className="contents">
          <div className={`col-span-3 border border-slate-300 px-3 py-3 text-sm text-slate-900${disableMainContent ? " opacity-50" : ""}`}>
            {row.item}
          </div>

          <div className={`col-span-2 border border-slate-300 px-3 py-3${disableMainContent ? " opacity-50" : ""}`}>
            {row.radioColKeys && (
              <div className="flex flex-col gap-2">
                {row.radioColAsRadio ? (
                  row.radioColKeys.map((rk) => (
                    <label key={rk} className="inline-flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name={`${row.id}-radiocol`}
                        checked={row.need === rk}
                        onChange={() => onChange({ ...row, need: rk })}
                        className="h-4 w-4 border-slate-400 text-[#17375E] focus:ring-[#17375E]"
                      />
                      {rk}
                    </label>
                  ))
                ) : (
                  row.radioColKeys.map((rk) => (
                    <Check
                      key={rk}
                      label={rk}
                      checked={row.checks[rk] ?? false}
                      onChange={(checked) =>
                        onChange({ ...row, checks: { ...row.checks, [rk]: checked } })
                      }
                    />
                  ))
                )}
              </div>
            )}
          </div>

          <div className={`col-span-6 border border-slate-300 px-3 py-3 ${((row.radioColAsRadio && (row.need === "対象なし" || row.need === "問題なし")) || (!row.radioColAsRadio && row.radioColKeys?.includes("対象なし") && row.checks["対象なし"])) ? "opacity-50 pointer-events-none" : ""}`}>
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
                        maxLength={50}
                        className={inputClass + " w-24"}
                      />
                      <span>）</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          </fieldset>

          <div className="col-span-1 border border-slate-300 px-3 py-3 text-center">
            <input
              type="checkbox"
              checked={row.managerConfirm}
              onChange={(e) => onChange({ ...row, managerConfirm: e.target.checked })}
              disabled={disableDapConfirmAndRemark}
              className={`mt-1 h-4 w-4 rounded border-slate-400 text-[#17375E] focus:ring-[#17375E]${disableDapConfirmAndRemark ? " opacity-50 cursor-not-allowed" : ""}`}
            />
          </div>
        </>
      ) : (
        <>
          <fieldset disabled={disableMainContent} className="contents">
          <div className={`col-span-3 border border-slate-300 px-3 py-3 text-sm text-slate-900${disableMainContent ? " opacity-50" : ""}`}>
            {row.item}
          </div>

          <div className={`col-span-2 border border-slate-300 px-3 py-3${disableMainContent ? " opacity-50" : ""}`}>
            <div className="flex flex-col gap-2">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={`${row.id}-need`}
                  checked={row.need === "必要"}
                  onChange={() => onChange({ ...row, need: "必要" })}
                  className="h-4 w-4 border-slate-400 text-[#17375E] focus:ring-[#17375E]"
                />
                必要
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={`${row.id}-need`}
                  checked={row.need === "不要"}
                  onChange={() => {
                    if (onNeedChange) {
                      onNeedChange("不要");
                    } else {
                      onChange({ ...row, need: "不要" });
                    }
                  }}
                  className="h-4 w-4 border-slate-400 text-[#17375E] focus:ring-[#17375E]"
                />
                不要
              </label>
            </div>
          </div>

          <div className={`col-span-6 border border-slate-300 px-3 py-3 ${row.need === "不要" ? "opacity-50 pointer-events-none" : ""}${disableMainContent ? " opacity-50" : ""}`}>
            {row.variant === "fullInput" ? (
              <textarea
                value={row.amount || ""}
                onChange={(e) => onChange({ ...row, amount: e.target.value })}
                rows={3}
                maxLength={200}
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
                      {row.amountPrefix && (
                        <span className="text-sm text-slate-700">{row.amountPrefix}</span>
                      )}
                      <input
                        value={row.amount || ""}
                        onChange={(e) => { const v = row.amountNumeric ? e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1") : e.target.value; onChange({ ...row, amount: v }); }}
                        {...(row.amountNumeric ? {
                          inputMode: "decimal" as const, pattern: "[0-9.]*",
                          onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => { const nav = ["Backspace","Delete","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Tab","Home","End"]; if (nav.includes(e.key) || e.ctrlKey || e.metaKey) return; if (!/^[0-9.]$/.test(e.key)) { e.preventDefault(); return; } if (e.key === "." && e.currentTarget.value.includes(".")) e.preventDefault(); },
                          onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => { e.preventDefault(); const cleaned = e.clipboardData.getData("text").replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"); onChange({ ...row, amount: cleaned }); },
                        } : {})}
                        className="w-24 rounded-md border border-slate-300 px-2 py-1 text-sm"
                      />
                      <span className="text-sm text-slate-700">{row.unit}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  {optionEntries.slice(row.splitAt ?? 1).filter(([key]) => !(row.otherText !== undefined && key === "その他")).map(([key, val]) => {
                    if (fileUpload && key === fileUpload.matchKey) {
                      const setChecked = (v: boolean) =>
                        onChange({ ...row, checks: { ...row.checks, [key]: v } });
                      const att = fileUpload.attachments[fileUpload.fieldKey];
                      const url = fileUpload.getAttachmentUrl(fileUpload.fieldKey);
                      return (
                        <div key={key} className="inline-flex items-center gap-2">
                          <Check
                            label={key}
                            checked={val}
                            onChange={(checked) =>
                              fileUpload.onFileCheckChange(fileUpload.fieldKey, checked, setChecked)
                            }
                          />
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            ref={(el) => { fileUpload.fileInputRefs.current[fileUpload.fieldKey] = el; }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) fileUpload.onFileSelected(fileUpload.fieldKey, file, setChecked);
                            }}
                          />
                          {att && (
                            att.uploading ? (
                              <span className="text-xs text-slate-400">アップロード中...</span>
                            ) : (
                              <a
                                href={url ?? "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600"
                                onClick={(e) => { if (!url) e.preventDefault(); }}
                              >
                                {att.filename}
                              </a>
                            )
                          )}
                        </div>
                      );
                    }
                    return (
                      <Check
                        key={key}
                        label={key}
                        checked={val}
                        onChange={(checked) =>
                          onChange({ ...row, checks: { ...row.checks, [key]: checked } })
                        }
                      />
                    );
                  })}
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
                        maxLength={50}
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
                      {fileUpload && key === fileUpload.matchKey ? (
                        (() => {
                          const setChecked = (v: boolean) =>
                            onChange({ ...row, checks: { ...row.checks, [key]: v } });
                          const att = fileUpload.attachments[fileUpload.fieldKey];
                          const url = fileUpload.getAttachmentUrl(fileUpload.fieldKey);
                          return (
                            <div className="inline-flex items-center gap-2">
                              <Check
                                label={key}
                                checked={val}
                                onChange={(checked) =>
                                  fileUpload.onFileCheckChange(fileUpload.fieldKey, checked, setChecked)
                                }
                              />
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                className="hidden"
                                ref={(el) => { fileUpload.fileInputRefs.current[fileUpload.fieldKey] = el; }}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) fileUpload.onFileSelected(fileUpload.fieldKey, file, setChecked);
                                }}
                              />
                              {att && (att.uploading ? (
                                <span className="text-xs text-slate-400">アップロード中...</span>
                              ) : (
                                <a
                                  href={url ?? "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600"
                                  onClick={(e) => { if (!url) e.preventDefault(); }}
                                >
                                  {att.filename}
                                </a>
                              ))}
                            </div>
                          );
                        })()
                      ) : (
                        <Check
                          label={key}
                          checked={val}
                          onChange={(checked) =>
                            onChange({ ...row, checks: { ...row.checks, [key]: checked } })
                          }
                        />
                      )}
                      {(i === optionEntries.filter(([k]) => !(row.otherText !== undefined && k === "その他")).length - 1 && !optionEntries.some(([k]) => k === "その他") && row.otherText !== undefined) && (
                        <div className="inline-flex items-center gap-1 text-sm">
                          <span>（</span>
                          <input
                            value={row.otherText}
                            onChange={(e) => onChange({ ...row, otherText: e.target.value })}
                            maxLength={50}
                            className={inputClass + " w-32"}
                          />
                          <span>）</span>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                {row.otherText !== undefined && row.checks["その他"] !== undefined && (
                  <div className="flex items-center gap-1 flex-wrap">
                    <Check
                      label="その他"
                      checked={row.checks["その他"]}
                      onChange={(checked) => {
                        const setChecked = (v: boolean) =>
                          onChange({ ...row, checks: { ...row.checks, "その他": v } });
                        if (sonotaFileUpload) {
                          sonotaFileUpload.onFileCheckChange(sonotaFileUpload.fieldKey, checked, setChecked);
                        } else {
                          setChecked(checked);
                        }
                      }}
                    />
                    <div className="inline-flex items-center gap-1 text-sm">
                      <span>（</span>
                      <input
                        value={row.otherText}
                        onChange={(e) => onChange({ ...row, otherText: e.target.value })}
                        maxLength={50}
                        className={inputClass + " w-32"}
                      />
                      <span>）</span>
                    </div>
                    {sonotaFileUpload && (() => {
                      const att = sonotaFileUpload.attachments[sonotaFileUpload.fieldKey];
                      const url = sonotaFileUpload.getAttachmentUrl(sonotaFileUpload.fieldKey);
                      return (
                        <>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            ref={(el) => { sonotaFileUpload.fileInputRefs.current[sonotaFileUpload.fieldKey] = el; }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const setChecked = (v: boolean) =>
                                  onChange({ ...row, checks: { ...row.checks, "その他": v } });
                                sonotaFileUpload.onFileSelected(sonotaFileUpload.fieldKey, file, setChecked);
                              }
                            }}
                          />
                          {att && (att.uploading ? (
                            <span className="text-xs text-slate-400">アップロード中...</span>
                          ) : (
                            <a
                              href={url ?? "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600"
                              onClick={(e) => { if (!url) e.preventDefault(); }}
                            >
                              {att.filename}
                            </a>
                          ))}
                        </>
                      );
                    })()}
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
                        onChange={(e) => { const v = row.amountNumeric ? e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1") : e.target.value; onChange({ ...row, amount: v }); }}
                        {...(row.amountNumeric ? {
                          inputMode: "decimal" as const, pattern: "[0-9.]*",
                          onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => { const nav = ["Backspace","Delete","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Tab","Home","End"]; if (nav.includes(e.key) || e.ctrlKey || e.metaKey) return; if (!/^[0-9.]$/.test(e.key)) { e.preventDefault(); return; } if (e.key === "." && e.currentTarget.value.includes(".")) e.preventDefault(); },
                          onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => { e.preventDefault(); const cleaned = e.clipboardData.getData("text").replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"); onChange({ ...row, amount: cleaned }); },
                        } : {})}
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
                      onChange={(e) => { const v = row.amountNumeric ? e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1") : e.target.value; onChange({ ...row, amount: v }); }}
                      {...(row.amountNumeric ? {
                        inputMode: "decimal" as const, pattern: "[0-9.]*",
                        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => { const nav = ["Backspace","Delete","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Tab","Home","End"]; if (nav.includes(e.key) || e.ctrlKey || e.metaKey) return; if (!/^[0-9.]$/.test(e.key)) { e.preventDefault(); return; } if (e.key === "." && e.currentTarget.value.includes(".")) e.preventDefault(); },
                        onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => { e.preventDefault(); const cleaned = e.clipboardData.getData("text").replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"); onChange({ ...row, amount: cleaned }); },
                      } : {})}
                      className="w-24 rounded-md border border-slate-300 px-2 py-1 text-sm"
                    />
                    <span className="text-sm text-slate-700">{row.unit}</span>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {row.variant !== "checksInConfirm" && optionEntries.filter(([key]) => !(row.otherText !== undefined && key === "その他")).map(([key, val]) => {
                  if (fileUpload && key === fileUpload.matchKey) {
                    const setChecked = (v: boolean) =>
                      onChange({ ...row, checks: { ...row.checks, [key]: v } });
                    const att = fileUpload.attachments[fileUpload.fieldKey];
                    const url = fileUpload.getAttachmentUrl(fileUpload.fieldKey);
                    return (
                      <div key={key} className="inline-flex items-center gap-2">
                        <Check
                          label={key}
                          checked={val}
                          onChange={(checked) =>
                            fileUpload.onFileCheckChange(fileUpload.fieldKey, checked, setChecked)
                          }
                        />
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          className="hidden"
                          ref={(el) => { fileUpload.fileInputRefs.current[fileUpload.fieldKey] = el; }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) fileUpload.onFileSelected(fileUpload.fieldKey, file, setChecked);
                          }}
                        />
                        {att && (
                          att.uploading ? (
                            <span className="text-xs text-slate-400">アップロード中...</span>
                          ) : (
                            <a
                              href={url ?? "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600"
                              onClick={(e) => { if (!url) e.preventDefault(); }}
                            >
                              {att.filename}
                            </a>
                          )
                        )}
                      </div>
                    );
                  }
                  return (
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
                  );
                })}

                {!row.amountFirst && row.unit && (
                  <div className="inline-flex items-center gap-2">
                    <input
                      value={row.amount || ""}
                      onChange={(e) => { const v = row.amountNumeric ? e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1") : e.target.value; onChange({ ...row, amount: v }); }}
                      {...(row.amountNumeric ? {
                        inputMode: "decimal" as const, pattern: "[0-9.]*",
                        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => { const nav = ["Backspace","Delete","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Tab","Home","End"]; if (nav.includes(e.key) || e.ctrlKey || e.metaKey) return; if (!/^[0-9.]$/.test(e.key)) { e.preventDefault(); return; } if (e.key === "." && e.currentTarget.value.includes(".")) e.preventDefault(); },
                        onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => { e.preventDefault(); const cleaned = e.clipboardData.getData("text").replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"); onChange({ ...row, amount: cleaned }); },
                      } : {})}
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
                      maxLength={50}
                      className={inputClass + " w-32"}
                    />
                    <span>）</span>
                  </div>
                </div>
              )}
            </div>
            )}
          </div>
          </fieldset>

          <div className={`col-span-1 border border-slate-300 px-3 py-3 text-center${(row.id === "r6" || row.id === "p2r8") && row.need === "不要" && disableMainContent ? " opacity-50 pointer-events-none" : ""}`}>
            {row.variant === "checksInConfirm" ? (
              <div className={`flex flex-col items-center gap-2${disableDapConfirmAndRemark ? " opacity-50 cursor-not-allowed pointer-events-none" : ""}`}>
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
                disabled={disableDapConfirmAndRemark}
                className={`mt-1 h-4 w-4 rounded border-slate-400 text-[#17375E] focus:ring-[#17375E]${disableDapConfirmAndRemark ? " opacity-50 cursor-not-allowed" : ""}`}
              />
            )}
          </div>
        </>
      )}

      <div className={`col-span-11 border border-slate-300 bg-white px-2 py-2${row.need === "不要" && (!disableMainContent || row.id === "r6" || row.id === "p2r8") ? " opacity-50 pointer-events-none" : ""}`}>
        {!row.remarkExtra && (
          <textarea placeholder="備考" value={row.remark} onChange={(e) => onChange({ ...row, remark: e.target.value })} rows={3} maxLength={100} disabled={disableDapConfirmAndRemark} className={`${textareaClass}${disableDapConfirmAndRemark ? " opacity-50 cursor-not-allowed" : ""}`} />
        )}
        {row.remarkExtra && row.remarkExtra.map((extra, i) => {
          const updateEntry = (patch: Partial<typeof extra>) => {
            const updated = [...row.remarkExtra!];
            updated[i] = { ...updated[i], ...patch };
            onChange({ ...row, remarkExtra: updated });
          };
          const hasFileUpload = !!(extra.fileUploadFieldKey && remarkFileUpload);
          const fk = extra.fileUploadFieldKey;
          const att = hasFileUpload ? remarkFileUpload!.attachments[fk!] : undefined;
          const url = hasFileUpload ? remarkFileUpload!.getAttachmentUrl(fk!) : null;
          const checkboxChecked = !!extra.fileCheckboxValue;
          const setCheckboxChecked = (v: boolean) => updateEntry({ fileCheckboxValue: v });
          return (
            <div key={i} className="mt-2 flex items-center gap-2 flex-wrap">
              {hasFileUpload && (
                <input
                  type="checkbox"
                  checked={checkboxChecked}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    remarkFileUpload!.onFileCheckChange(fk!, checked, setCheckboxChecked);
                  }}
                  disabled={disableDapConfirmAndRemark}
                  className={`h-4 w-4 shrink-0 rounded border-slate-400 text-[#17375E] focus:ring-[#17375E]${disableDapConfirmAndRemark ? " opacity-50 cursor-not-allowed" : ""}`}
                />
              )}
              <span className="whitespace-nowrap text-sm text-slate-700">{extra.label}</span>
              <input
                value={extra.value}
                onChange={(e) => updateEntry({ value: e.target.value })}
                maxLength={300}
                disabled={disableDapConfirmAndRemark}
                className={`${inputClass}${disableDapConfirmAndRemark ? " opacity-50 cursor-not-allowed" : ""}`}
              />
              {hasFileUpload && (
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  ref={(el) => { remarkFileUpload!.fileInputRefs.current[fk!] = el; }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) remarkFileUpload!.onFileSelected(fk!, file, setCheckboxChecked);
                  }}
                />
              )}
              {hasFileUpload && checkboxChecked && att && (att.uploading ? (
                <span className="text-xs text-slate-400">アップロード中...</span>
              ) : (
                <a
                  href={url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600"
                  onClick={(e) => { if (!url) e.preventDefault(); }}
                >
                  {att.filename}
                </a>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}