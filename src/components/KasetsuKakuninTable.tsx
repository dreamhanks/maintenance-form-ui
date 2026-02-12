import React, { useRef } from "react";
import { TextArea } from "./PaperTable";
import { KasetsuForm } from "../form/formTypes";

const thL = "border border-black bg-sky-100 text-sm px-2 py-2 text-left font-semibold";
const thR = "border border-black bg-gray-200 text-sm px-2 py-2 text-center font-semibold";
const td = "border border-black text-sm px-2 py-2 align-middle";
const tdTop = "border border-black text-sm px-2 py-2 align-top";
const center = "text-center align-middle";
const sepL = "border-l-2 border-black";
const sepT = "border-t-2 border-black";
const outer = "border-2 border-black";

const UnderlineInput = ({
  w = "w-20",
  value,
  onChange,
}: {
  w?: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <input
    className={`${w} border-b border-black outline-none bg-transparent`}
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

function getFileKind(file: File): "PDF" | "IMG" | "EXCEL" | "FILE" {
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) return "PDF";
  if (file.type.startsWith("image/")) return "IMG";
  if (file.name.toLowerCase().endsWith(".xlsx") || file.name.toLowerCase().endsWith(".xls")) return "EXCEL";
  return "FILE";
}

type RadioProps = {
  name: string;
  value: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: (value: string) => void;
  onClick?: () => void;
};

const RadioFile = ({ name, value, label, checked, onChange, onClick }: RadioProps) => (
  <label className="inline-flex items-center gap-2 mr-6">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={() => onChange(value)}
      onClick={onClick}
      className="h-4 w-4"
    />
    <span>{label}</span>
  </label>
);

const R = ({ name, value, label, checked, onChange }: RadioProps) => (
  <label className="inline-flex items-center gap-2 mr-6">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={() => onChange(value)}
      className="h-4 w-4"
    />
    <span>{label}</span>
  </label>
);

export function KasetsuKakuninTable({
  value,
  onChange,
}: {
  value: KasetsuForm;
  onChange: (next: KasetsuForm) => void;
}) {
  const set = (patch: Partial<KasetsuForm>) => onChange({ ...value, ...patch });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openFileDialog = () => fileInputRef.current?.click();

  const openFilePreview = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

    const handleAshibaNeedChange = (v: "1" | "2") => {
    set({
        ashiba_setchi_need: v,
        ...(v === "2" ? {} : { ashiba_partialFile: null }),
    });

    if (v === "2") {
        setTimeout(openFileDialog, 0);
    } else {
        if (fileInputRef.current) fileInputRef.current.value = "";
    }
    };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    set({ ashiba_partialFile: f });
  };

  const kind = value.ashiba_partialFile ? getFileKind(value.ashiba_partialFile) : null;

  return (
    <div className="overflow-x-auto">
      <p className="text-sm mb-2">
        以下、工事・メンテナンスセンターにて記入（該当項目にチェックし、詳細記入願います）
      </p>

      <table className={`border-collapse w-full min-w-[1100px] ${outer}`}>
        <thead>
          <tr>
            <th className={`${thL} text-lg`} colSpan={4}>
              ◆仮設確認
            </th>
            <th className={`${thR} ${sepL} text-lg`}>大元回答</th>
          </tr>
        </thead>

        <tbody>
          {/* ===================== 仮設 ===================== */}
          <tr>
            <td className={`${td} ${center} ${sepT}`} rowSpan={7}>
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={value.section_kasetsu}
                onChange={(e) => set({ section_kasetsu: e.target.checked })}
              />
            </td>

            <td className={`${td} ${center} ${sepT} text-base`} rowSpan={7}>
              仮設
            </td>

            <td className={`${tdTop} ${sepT}`}>第三者侵入防止</td>

            <td className={`${tdTop} ${sepT}`}>
              <div>
                <R
                  name="kasetsu_intrusion_need"
                  value="0"
                  label="不要"
                  checked={value.kasetsu_intrusion_need === "0"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ kasetsu_intrusion_need: v as any })}
                />
              </div>
              <div className="mt-1">
                <R
                  name="kasetsu_intrusion_need"
                  value="1"
                  label={
                    <span>
                      <span className="mr-5">必要</span>（
                      <UnderlineInput
                        w="w-36"
                        value={value.kasetsu_intrusion_need_note}
                        onChange={(t) => set({ kasetsu_intrusion_need_note: t })}
                      />
                      ）
                    </span>
                  }
                  checked={value.kasetsu_intrusion_need === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ kasetsu_intrusion_need: v as any })}
                />
                <span>→</span>
              </div>
            </td>

            <td className={`${tdTop} ${sepT} ${sepL}`}>
              <R
                name="kasetsu_intrusion_ans"
                value="1"
                label="仮囲い"
                checked={value.kasetsu_intrusion_ans === "1"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ kasetsu_intrusion_ans: v as any })}
              />
              <R
                name="kasetsu_intrusion_ans"
                value="2"
                label="カラーコーン"
                checked={value.kasetsu_intrusion_ans === "2"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ kasetsu_intrusion_ans: v as any })}
              />
              <R
                name="kasetsu_intrusion_ans"
                value="3"
                label={
                  <span>
                    <span className="mr-5">その他</span>（
                    <UnderlineInput
                      w="w-36"
                      value={value.kasetsu_intrusion_ans_note}
                      onChange={(t) => set({ kasetsu_intrusion_ans_note: t })}
                    />
                    ）
                  </span>
                }
                checked={value.kasetsu_intrusion_ans === "3"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ kasetsu_intrusion_ans: v as any })}
              />
            </td>
          </tr>

          <tr>
            <td className={tdTop}>仮設電気</td>
            <td className={tdTop}>
              <div>
                <R
                  name="kasetsu_denki_need"
                  value="0"
                  label="不要"
                  checked={value.kasetsu_denki_need === "0"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ kasetsu_denki_need: v as any })}
                />
              </div>
              <div className="mt-1">
                <R
                  name="kasetsu_denki_need"
                  value="1"
                  label={
                    <span>
                      <span className="mr-5">必要</span>（
                      <UnderlineInput
                        w="w-36"
                        value={value.kasetsu_denki_need_note}
                        onChange={(t) => set({ kasetsu_denki_need_note: t })}
                      />
                      ）
                    </span>
                  }
                  checked={value.kasetsu_denki_need === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ kasetsu_denki_need: v as any })}
                />
                <span>→</span>
              </div>
            </td>
            <td className={`${tdTop} ${sepL}`}>
              <R
                name="kasetsu_denki_ans"
                value="1"
                label="既存無償利用可"
                checked={value.kasetsu_denki_ans === "1"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ kasetsu_denki_ans: v as any })}
              />
              <R
                name="kasetsu_denki_ans"
                value="2"
                label={
                  <span>
                    <span className="mr-5">その他</span>（
                    <UnderlineInput
                      w="w-36"
                      value={value.kasetsu_denki_ans_note}
                      onChange={(t) => set({ kasetsu_denki_ans_note: t })}
                    />
                    ）
                  </span>
                }
                checked={value.kasetsu_denki_ans === "2"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ kasetsu_denki_ans: v as any })}
              />
            </td>
          </tr>

          <tr>
            <td className={tdTop}>仮設水道</td>
            <td className={tdTop}>
              <div>
                <R
                  name="kasetsu_suido_need"
                  value="0"
                  label="不要"
                  checked={value.kasetsu_suido_need === "0"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ kasetsu_suido_need: v as any })}
                />
              </div>
              <div className="mt-1">
                <R
                  name="kasetsu_suido_need"
                  value="1"
                  label={
                    <span>
                      <span className="mr-5">必要</span>（
                      <UnderlineInput
                        w="w-36"
                        value={value.kasetsu_suido_need_note}
                        onChange={(t) => set({ kasetsu_suido_need_note: t })}
                      />
                      ）
                    </span>
                  }
                  checked={value.kasetsu_suido_need === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ kasetsu_suido_need: v as any })}
                />
                <span>→</span>
              </div>
            </td>
            <td className={`${tdTop} ${sepL}`}>
              <R
                name="kasetsu_suido_ans"
                value="1"
                label="既存無償利用可"
                checked={value.kasetsu_suido_ans === "1"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ kasetsu_suido_ans: v as any })}
              />
              <R
                name="kasetsu_suido_ans"
                value="2"
                label={
                  <span>
                    <span className="mr-5">その他</span>（
                    <UnderlineInput
                      w="w-36"
                      value={value.kasetsu_suido_ans_note}
                      onChange={(t) => set({ kasetsu_suido_ans_note: t })}
                    />
                    ）
                  </span>
                }
                checked={value.kasetsu_suido_ans === "2"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ kasetsu_suido_ans: v as any })}
              />
            </td>
          </tr>

          <tr>
            <td className={tdTop}>仮設トイレ</td>
            <td className={tdTop}>
              <div>
                <R
                  name="kasetsu_toilet_need"
                  value="0"
                  label="不要"
                  checked={value.kasetsu_toilet_need === "0"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ kasetsu_toilet_need: v as any })}
                />
              </div>
              <div className="mt-1">
                <R
                  name="kasetsu_toilet_need"
                  value="1"
                  label={
                    <span>
                      <span className="mr-5">必要</span>（
                      <UnderlineInput
                        w="w-36"
                        value={value.kasetsu_toilet_need_note}
                        onChange={(t) => set({ kasetsu_toilet_need_note: t })}
                      />
                      ）
                    </span>
                  }
                  checked={value.kasetsu_toilet_need === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ kasetsu_toilet_need: v as any })}
                />
                <span>→</span>
              </div>
            </td>
            <td className={`${tdTop} ${sepL}`}>
              <R
                name="kasetsu_toilet_ans"
                value="1"
                label="既存無償利用可"
                checked={value.kasetsu_toilet_ans === "1"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ kasetsu_toilet_ans: v as any })}
              />
              <R
                name="kasetsu_toilet_ans"
                value="2"
                label={
                  <span>
                    <span className="mr-5">その他</span>（
                    <UnderlineInput
                      w="w-36"
                      value={value.kasetsu_toilet_ans_note}
                      onChange={(t) => set({ kasetsu_toilet_ans_note: t })}
                    />
                    ）
                  </span>
                }
                checked={value.kasetsu_toilet_ans === "2"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ kasetsu_toilet_ans: v as any })}
              />
            </td>
          </tr>

          <tr>
            <td className={tdTop}>電線防護管</td>
            <td className={tdTop}>
              <div>
                <R
                  name="kasetsu_densen_need"
                  value="0"
                  label="不要"
                  checked={value.kasetsu_densen_need === "0"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ kasetsu_densen_need: v as any })}
                />
              </div>
              <div className="mt-1">
                <R
                  name="kasetsu_densen_need"
                  value="1"
                  label={
                    <span>
                      <span className="mr-5">必要</span>（
                      <UnderlineInput
                        w="w-36"
                        value={value.kasetsu_densen_need_note}
                        onChange={(t) => set({ kasetsu_densen_need_note: t })}
                      />
                      ）
                    </span>
                  }
                  checked={value.kasetsu_densen_need === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ kasetsu_densen_need: v as any })}
                />
                <span>→</span>
              </div>
            </td>
            <td className={`${tdTop} ${sepL}`}>
              <R
                name="kasetsu_densen_ans"
                value="1"
                label="予算計上"
                checked={value.kasetsu_densen_ans === "1"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ kasetsu_densen_ans: v as any })}
              />
              <R
                name="kasetsu_densen_ans"
                value="2"
                label={
                  <span>
                    <span className="mr-5">その他</span>（
                    <UnderlineInput
                      w="w-36"
                      value={value.kasetsu_densen_ans_note}
                      onChange={(t) => set({ kasetsu_densen_ans_note: t })}
                    />
                    ）
                  </span>
                }
                checked={value.kasetsu_densen_ans === "2"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ kasetsu_densen_ans: v as any })}
              />
            </td>
          </tr>

          <tr>
            <td className={tdTop}>工事駐車場</td>
            <td className={tdTop}>
              <div>
                <R
                  name="kasetsu_parking_need"
                  value="0"
                  label="不要"
                  checked={value.kasetsu_parking_need === "0"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ kasetsu_parking_need: v as any })}
                />
              </div>
              <div className="mt-1">
                <R
                  name="kasetsu_parking_need"
                  value="1"
                  label={
                    <span>
                      <span className="mr-5">必要</span>（
                      <UnderlineInput
                        w="w-32"
                        value={value.kasetsu_parking_need_dai}
                        onChange={(t) => set({ kasetsu_parking_need_dai: t })}
                      />{" "}
                      台）
                    </span>
                  }
                  checked={value.kasetsu_parking_need === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ kasetsu_parking_need: v as any })}
                />
                <span>→</span>
              </div>
            </td>

            <td className={`${tdTop} ${sepL}`}>
              <R
                name="kasetsu_parking_ans"
                value="1"
                label="場内確保"
                checked={value.kasetsu_parking_ans === "1"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ kasetsu_parking_ans: v as any })}
              />
              <R
                name="kasetsu_parking_ans"
                value="2"
                label="場内なし・予算対応"
                checked={value.kasetsu_parking_ans === "2"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ kasetsu_parking_ans: v as any })}
              />
              <R
                name="kasetsu_parking_ans"
                value="3"
                label={
                  <span>
                    <span className="mr-5">その他</span>（
                    <UnderlineInput
                      w="w-32"
                      value={value.kasetsu_parking_ans_note}
                      onChange={(t) => set({ kasetsu_parking_ans_note: t })}
                    />
                    ）
                  </span>
                }
                checked={value.kasetsu_parking_ans === "3"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ kasetsu_parking_ans: v as any })}
              />
            </td>
          </tr>

          <tr>
            <td className={`${td}`} colSpan={3}>
              （別途指示事項）
              <TextArea
                className="min-h-12"
                value={value.kasetsu_betsuto}
                onChange={(e) => set({ kasetsu_betsuto: e.target.value })}
              />
            </td>
          </tr>

          {/* ===================== 足場 ===================== */}
          <tr>
            <td className={`${td} ${center} ${sepT}`} rowSpan={6}>
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={value.section_ashiba}
                onChange={(e) => set({ section_ashiba: e.target.checked })}
              />
            </td>

            <td className={`${td} ${center} ${sepT}`} rowSpan={6}>
              足場
            </td>

            <td className={`${tdTop} ${sepT}`}>足場設置</td>

            <td className={`${tdTop} ${sepT}`}>
              <div>
                <RadioFile
                  name="ashiba_setchi_need"
                  value="1"
                  label="全周"
                  checked={value.ashiba_setchi_need === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => handleAshibaNeedChange(v as any)}
                />
              </div>

              <div className="mt-1">
                <RadioFile
                  name="ashiba_setchi_need"
                  value="2"
                  label="一部設置（図示）"
                  checked={value.ashiba_setchi_need === "2"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => handleAshibaNeedChange(v as any)}
                  onClick={() => {
                    if (value.ashiba_setchi_need === "2") openFileDialog();
                  }}
                />
                <span>→</span>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {value.ashiba_setchi_need === "2" && value.ashiba_partialFile && (
                  <div className="mt-1 ml-6 text-xs text-gray-700 whitespace-nowrap">
                    <span className="mr-1 font-semibold">[{kind}]</span> 📎{" "}
                    <button
                      type="button"
                      className="underline text-blue-700 hover:text-blue-900"
                      onClick={() => openFilePreview(value.ashiba_partialFile!)}
                      title="開く"
                    >
                      {value.ashiba_partialFile.name}
                    </button>
                  </div>
                )}
              </div>
            </td>

            <td className={`${tdTop} ${sepT} ${sepL}`}>
              <R
                name="ashiba_setchi_ans"
                value="1"
                label="全周"
                checked={value.ashiba_setchi_ans === "1"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ ashiba_setchi_ans: v as any })}
              />
              <R
                name="ashiba_setchi_ans"
                value="2"
                label="一部設置（技術部門指示の通り）"
                checked={value.ashiba_setchi_ans === "2"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ ashiba_setchi_ans: v as any })}
              />
              <R
                name="ashiba_setchi_ans"
                value="3"
                label={
                  <span>
                    <span className="mr-5">その他</span>（
                    <UnderlineInput
                      w="w-28"
                      value={value.ashiba_setchi_ans_note}
                      onChange={(t) => set({ ashiba_setchi_ans_note: t })}
                    />
                    ）
                  </span>
                }
                checked={value.ashiba_setchi_ans === "3"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ ashiba_setchi_ans: v as any })}
              />
            </td>
          </tr>

          {/* Continue the exact same approach for the rest of 足場 rows */}
          <tr>
            <td className={tdTop}>足場届出（機械設置届）</td>
            <td className={tdTop}>
              <div>
                <R
                  name="ashiba_todokede_need"
                  value="0"
                  label="不要"
                  checked={value.ashiba_todokede_need === "0"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ ashiba_todokede_need: v as any })}
                />
              </div>
              <div className="mt-1">
                <R
                  name="ashiba_todokede_need"
                  value="1"
                  label={
                    <span>
                      <span className="mr-5">必要</span>（
                      <UnderlineInput
                        w="w-32"
                        value={value.ashiba_todokede_need_note}
                        onChange={(t) => set({ ashiba_todokede_need_note: t })}
                      />
                      ）
                    </span>
                  }
                  checked={value.ashiba_todokede_need === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ ashiba_todokede_need: v as any })}
                />
                <span>→</span>
              </div>
            </td>
            <td className={`${tdTop} ${sepL}`}>
              <R
                name="ashiba_todokede_ans"
                value="1"
                label="予算計上"
                checked={value.ashiba_todokede_ans === "1"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ ashiba_todokede_ans: v as any })}
              />
              <R
                name="ashiba_todokede_ans"
                value="2"
                label={
                  <span>
                    <span className="mr-5">その他</span>（
                    <UnderlineInput
                      w="w-36"
                      value={value.ashiba_todokede_ans_note}
                      onChange={(t) => set({ ashiba_todokede_ans_note: t })}
                    />
                    ）
                  </span>
                }
                checked={value.ashiba_todokede_ans === "2"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ ashiba_todokede_ans: v as any })}
              />
            </td>
          </tr>

          <tr>
            <td className={tdTop}>隣地足場越境時の承諾</td>
            <td className={tdTop}>
              <div>
                <R
                  name="ashiba_kyoukai_need"
                  value="0"
                  label="不要"
                  checked={value.ashiba_kyoukai_need === "0"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ ashiba_kyoukai_need: v as any })}
                />
              </div>
              <div className="mt-1">
                <R
                  name="ashiba_kyoukai_need"
                  value="1"
                  label={
                    <span>
                      <span className="mr-5">必要</span>（
                      <UnderlineInput
                        w="w-32"
                        value={value.ashiba_kyoukai_need_note}
                        onChange={(t) => set({ ashiba_kyoukai_need_note: t })}
                      />
                      ）
                    </span>
                  }
                  checked={value.ashiba_kyoukai_need === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ ashiba_kyoukai_need: v as any })}
                />
                <span>→</span>
              </div>
            </td>
            <td className={`${tdTop} ${sepL}`}>
              <R
                name="ashiba_kyoukai_ans"
                value="1"
                label="承諾取得済"
                checked={value.ashiba_kyoukai_ans === "1"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ ashiba_kyoukai_ans: v as any })}
              />
              <R
                name="ashiba_kyoukai_ans"
                value="2"
                label={
                  <span>
                    <span className="mr-5">その他</span>（
                    <UnderlineInput
                      w="w-36"
                      value={value.ashiba_kyoukai_ans_note}
                      onChange={(t) => set({ ashiba_kyoukai_ans_note: t })}
                    />
                    ）
                  </span>
                }
                checked={value.ashiba_kyoukai_ans === "2"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ ashiba_kyoukai_ans: v as any })}
              />
            </td>
          </tr>

          <tr>
            <td className={tdTop}>巾木、中桟、手すり等</td>
            <td className={tdTop}>
              <div>
                <R
                  name="ashiba_te_suri_need"
                  value="1"
                  label="巾木"
                  checked={value.ashiba_te_suri_need === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ ashiba_te_suri_need: v as any })}
                />
                <R
                  name="ashiba_te_suri_need"
                  value="2"
                  label="中桟"
                  checked={value.ashiba_te_suri_need === "2"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ ashiba_te_suri_need: v as any })}
                />
              </div>
              <div className="mt-1">
                <R
                  name="ashiba_te_suri_need"
                  value="3"
                  label="手摺"
                  checked={value.ashiba_te_suri_need === "3"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ ashiba_te_suri_need: v as any })}
                />
                <R
                  name="ashiba_te_suri_need"
                  value="4"
                  label={
                    <span>
                      （
                      <UnderlineInput
                        w="w-28"
                        value={value.ashiba_te_suri_need_note}
                        onChange={(t) => set({ ashiba_te_suri_need_note: t })}
                      />
                      ）
                    </span>
                  }
                  checked={value.ashiba_te_suri_need === "4"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ ashiba_te_suri_need: v as any })}
                />
              </div>
            </td>

            <td className={`${tdTop} ${sepL}`}>
              <R
                name="ashiba_te_suri_ans"
                value="1"
                label="巾木"
                checked={value.ashiba_te_suri_ans === "1"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ ashiba_te_suri_ans: v as any })}
              />
              <R
                name="ashiba_te_suri_ans"
                value="2"
                label="中桟"
                checked={value.ashiba_te_suri_ans === "2"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ ashiba_te_suri_ans: v as any })}
              />
              <R
                name="ashiba_te_suri_ans"
                value="3"
                label="手摺"
                checked={value.ashiba_te_suri_ans === "3"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ ashiba_te_suri_ans: v as any })}
              />
              <R
                name="ashiba_te_suri_ans"
                value="4"
                label={
                  <span>
                    <span className="mr-5">その他</span>（
                    <UnderlineInput
                      w="w-36"
                      value={value.ashiba_te_suri_ans_note}
                      onChange={(t) => set({ ashiba_te_suri_ans_note: t })}
                    />
                    ）
                  </span>
                }
                checked={value.ashiba_te_suri_ans === "4"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ ashiba_te_suri_ans: v as any })}
              />
            </td>
          </tr>

          <tr>
            <td className={tdTop}>飛散防止措置</td>
            <td className={tdTop}>
              <div>
                <R
                  name="ashiba_hisan_need"
                  value="0"
                  label="不要"
                  checked={value.ashiba_hisan_need === "0"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ ashiba_hisan_need: v as any })}
                />
              </div>
              <div className="mt-1">
                <R
                  name="ashiba_hisan_need"
                  value="1"
                  label={
                    <span>
                      <span className="mr-5">必要</span>（
                      <UnderlineInput
                        w="w-32"
                        value={value.ashiba_hisan_need_note}
                        onChange={(t) => set({ ashiba_hisan_need_note: t })}
                      />
                      ）
                    </span>
                  }
                  checked={value.ashiba_hisan_need === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ ashiba_hisan_need: v as any })}
                />
                <span>→</span>
              </div>
            </td>
            <td className={`${tdTop} ${sepL}`}>
              <R
                name="ashiba_hisan_ans"
                value="1"
                label="朝顔"
                checked={value.ashiba_hisan_ans === "1"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ ashiba_hisan_ans: v as any })}
              />
              <R
                name="ashiba_hisan_ans"
                value="2"
                label={
                  <span>
                    <span className="mr-5">その他</span>（
                    <UnderlineInput
                      w="w-36"
                      value={value.ashiba_hisan_ans_note}
                      onChange={(t) => set({ ashiba_hisan_ans_note: t })}
                    />
                    ）
                  </span>
                }
                checked={value.ashiba_hisan_ans === "2"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ ashiba_hisan_ans: v as any })}
              />
            </td>
          </tr>

          <tr>
            <td className={`${td}`} colSpan={3}>
              （別途指示事項）
              <TextArea
                className="min-h-12"
                value={value.ashiba_betsuto}
                onChange={(e) => set({ ashiba_betsuto: e.target.value })}
              />
            </td>
          </tr>

          {/* ===================== 防犯 ===================== */}
          <tr>
            <td className={`${td} ${center} ${sepT}`}>
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={value.section_bouhan}
                onChange={(e) => set({ section_bouhan: e.target.checked })}
              />
            </td>
            <td className={`${td} ${center} ${sepT}`}>防犯</td>
            <td className={`${tdTop} ${sepT}`}>夜間照明・防犯カメラ</td>
            <td className={`${tdTop} ${sepT}`}>
              <R
                name="bouhan_need"
                value="1"
                label="夜間灯"
                checked={value.bouhan_need === "1"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ bouhan_need: v as any })}
              />
              <R
                name="bouhan_need"
                value="2"
                label="防犯カメラ"
                checked={value.bouhan_need === "2"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ bouhan_need: v as any })}
              />
            </td>
            <td className={`${tdTop} ${sepT} ${sepL}`}>
              <R
                name="bouhan_ans"
                value="1"
                label="夜間灯"
                checked={value.bouhan_ans === "1"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ bouhan_ans: v as any })}
              />
              <R
                name="bouhan_ans"
                value="2"
                label="防犯カメラ"
                checked={value.bouhan_ans === "2"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ bouhan_ans: v as any })}
              />
              <R
                name="bouhan_ans"
                value="3"
                label={
                  <span>
                    <span className="mr-5">その他</span>（
                    <UnderlineInput
                      w="w-36"
                      value={value.bouhan_ans_note}
                      onChange={(t) => set({ bouhan_ans_note: t })}
                    />
                    ）
                  </span>
                }
                checked={value.bouhan_ans === "3"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ bouhan_ans: v as any })}
              />
            </td>
          </tr>

          {/* ===================== 予算 ===================== */}
          <tr>
            <td className={`${td} ${center} ${sepT}`} rowSpan={2}>
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={value.section_yosan}
                onChange={(e) => set({ section_yosan: e.target.checked })}
              />
            </td>
            <td className={`${td} ${center} ${sepT}`} rowSpan={2}>
              予算
            </td>
            <td className={`${tdTop} ${sepT}`}>産廃費用</td>
            <td className={`${tdTop} ${sepT}`}>
              <R
                name="yosan_sanpai_need"
                value="1"
                label="必要"
                checked={value.yosan_sanpai_need === "1"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ yosan_sanpai_need: v as any })}
              />
            </td>
            <td className={`${tdTop} ${sepT} ${sepL}`}>
              <R
                name="yosan_sanpai_ans"
                value="1"
                label="予算計上"
                checked={value.yosan_sanpai_ans === "1"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ yosan_sanpai_ans: v as any })}
              />
              <R
                name="yosan_sanpai_ans"
                value="2"
                label={
                  <span>
                    <span className="mr-5">その他</span>（
                    <UnderlineInput
                      w="w-36"
                      value={value.yosan_sanpai_ans_note}
                      onChange={(t) => set({ yosan_sanpai_ans_note: t })}
                    />
                    ）
                  </span>
                }
                checked={value.yosan_sanpai_ans === "2"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ yosan_sanpai_ans: v as any })}
              />
            </td>
          </tr>

          <tr>
            <td className={tdTop}>荷揚げ費用</td>
            <td className={tdTop}>
              <div>
                <R
                  name="yosan_niaage_need"
                  value="0"
                  label="不要"
                  checked={value.yosan_niaage_need === "0"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ yosan_niaage_need: v as any })}
                />
              </div>
              <div className="mt-1">
                <R
                  name="yosan_niaage_need"
                  value="1"
                  label={
                    <span>
                      <span className="mr-5">必要</span>（
                      <UnderlineInput
                        w="w-32"
                        value={value.yosan_niaage_need_note}
                        onChange={(t) => set({ yosan_niaage_need_note: t })}
                      />
                      ）
                    </span>
                  }
                  checked={value.yosan_niaage_need === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(v) => set({ yosan_niaage_need: v as any })}
                />
                <span>→</span>
              </div>
            </td>
            <td className={`${tdTop} ${sepL}`}>
              <R
                name="yosan_niaage_ans"
                value="1"
                label="予算計上"
                checked={value.yosan_niaage_ans === "1"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ yosan_niaage_ans: v as any })}
              />
              <R
                name="yosan_niaage_ans"
                value="2"
                label={
                  <span>
                    <span className="mr-5">その他</span>（
                    <UnderlineInput
                      w="w-36"
                      value={value.yosan_niaage_ans_note}
                      onChange={(t) => set({ yosan_niaage_ans_note: t })}
                    />
                    ）
                  </span>
                }
                checked={value.yosan_niaage_ans === "2"}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => set({ yosan_niaage_ans: v as any })}
              />
            </td>
          </tr>

          {/* ===================== 現場指示事項 ===================== */}
          <tr>
            <td className={`${td} bg-sky-100 font-semibold ${sepT}`} colSpan={2}>
              【現場指示事項】
            </td>
            <td className={`${td} ${sepT}`} colSpan={3}>
              <TextArea
                value={value.genba_shiji}
                onChange={(e) => set({ genba_shiji: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
