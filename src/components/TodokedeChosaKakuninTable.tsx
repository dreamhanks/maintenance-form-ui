import React from "react";
import { TextArea } from "./PaperTable";
import { TodokedeChosaForm } from "../form/formTypes";

export function TodokedeChosaKakuninTable({
  value,
  onChange,
}: {
  value: TodokedeChosaForm;
  onChange: (next: TodokedeChosaForm) => void;
}) {
  const set = (patch: Partial<TodokedeChosaForm>) => onChange({ ...value, ...patch });

  // ===== styles (match PDF) =====
  const thLeft = "border-2 border-black bg-sky-100 px-2 py-2 text-sm text-left";
  const thRight = "border-2 border-black bg-gray-200 px-2 py-2 text-sm text-center";
  const td = "border border-black px-3 py-2 text-sm align-middle";

  const tdCat = `${td} text-center align-top font-semibold`;
  const tdChk = `${td} text-center align-top w-[52px]`;
  const tdItem = `${td} w-[320px]`;
  const tdOpt = `${td} w-[320px]`;
  const tdAns = `${td} w-[520px]`;

  const thickTop = "border-t-2 border-t-black";
  const thickBottom = "border-b-2 border-b-black";
  const thickLeft = "border-l-2 border-l-black";
  const thickRight = "border-r-2 border-r-black";

  const R = ({
    name,
    val,
    label,
    checked,
    onPick,
  }: {
    name: string;
    val: string;
    label: React.ReactNode;
    checked: boolean;
    onPick: (v: string) => void;
  }) => (
    <label className="inline-flex items-center gap-2 mr-6">
      <input
        type="radio"
        name={name}
        value={val}
        className="h-4 w-4"
        checked={checked}
        onChange={() => onPick(val)}
      />
      <span>{label}</span>
    </label>
  );

  const UnderlineInput = ({
    w = "w-20",
    v,
    onV,
  }: {
    w?: string;
    v: string;
    onV: (t: string) => void;
  }) => (
    <input
      className={`${w} border-b border-black outline-none bg-transparent`}
      type="text"
      value={v}
      onChange={(e) => onV(e.target.value)}
    />
  );

  return (
    <div className="overflow-x-auto">
      <p className="text-sm mb-2">
        以下、工事・メンテナンスセンターにて記入（該当項目にチェックし、詳細記入願います）
      </p>

      <table
        className={`border-collapse w-full min-w-[1100px] ${thickLeft} ${thickRight} ${thickTop} ${thickBottom}`}
      >
        <thead>
          <tr>
            <th className={thLeft} colSpan={4}>
              ◆仮設確認
            </th>
            <th className={thRight}>大元回答</th>
          </tr>
        </thead>

        <tbody>
          {/* ========================= 届出 (3 rows) ========================== */}
          <tr>
            <td className={tdChk} rowSpan={3}>
              <input
                type="checkbox"
                name="grp_todokede"
                className="h-4 w-4"
                checked={value.grp_todokede}
                onChange={(e) => set({ grp_todokede: e.target.checked })}
              />
            </td>

            <td className={`${tdCat} w-20`} rowSpan={3}>
              届出
            </td>

            <td className={tdItem}>道路使用・占用届</td>

            <td className={tdOpt}>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <R
                  name="road_use"
                  val="1"
                  label="道路使用"
                  checked={value.road_use === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ road_use: v as any })}
                />
                <R
                  name="road_use"
                  val="2"
                  label="道路占用"
                  checked={value.road_use === "2"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ road_use: v as any })}
                />
              </div>
            </td>

            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R
                  name="road_use_ans"
                  val="1"
                  label="予算計上"
                  checked={value.road_use_ans === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ road_use_ans: v as any })}
                />
                <R
                  name="road_use_ans"
                  val="2"
                  label={
                    <span>
                      その他（{" "}
                      <UnderlineInput
                        w="w-56"
                        v={value.road_use_other}
                        onV={(t) => set({ road_use_other: t })}
                      />{" "}
                      ）
                    </span>
                  }
                  checked={value.road_use_ans === "2"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ road_use_ans: v as any })}
                />
              </div>
            </td>
          </tr>

          <tr>
            <td className={tdItem}>アスベスト含有調査</td>
            <td className={tdOpt}>
              <div>
                <div className="mb-1">
                  <R
                    name="asbestos_need"
                    val="0"
                    label="不要"
                    checked={value.asbestos_need === "0"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPick={(v) => set({ asbestos_need: v as any })}
                  />
                </div>
                <div>
                  <R
                    name="asbestos_need"
                    val="1"
                    label={
                      <span>
                        必要（{" "}
                        <UnderlineInput
                          w="w-24"
                          v={value.asbestos_need_note}
                          onV={(t) => set({ asbestos_need_note: t })}
                        />{" "}
                        ）→
                      </span>
                    }
                    checked={value.asbestos_need === "1"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPick={(v) => set({ asbestos_need: v as any })}
                  />
                </div>
              </div>
            </td>

            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R
                  name="asbestos_ans"
                  val="1"
                  label="予算計上"
                  checked={value.asbestos_ans === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ asbestos_ans: v as any })}
                />
                <R
                  name="asbestos_ans"
                  val="2"
                  label={
                    <span>
                      その他（{" "}
                      <UnderlineInput
                        w="w-56"
                        v={value.asbestos_other}
                        onV={(t) => set({ asbestos_other: t })}
                      />{" "}
                      ）
                    </span>
                  }
                  checked={value.asbestos_ans === "2"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ asbestos_ans: v as any })}
                />
              </div>
            </td>
          </tr>

          <tr className={thickBottom}>
            <td className={tdItem}>景観条例対象届出</td>
            <td className={tdOpt}>
              <div>
                <div className="mb-1">
                  <R
                    name="keikan_need"
                    val="0"
                    label="不要"
                    checked={value.keikan_need === "0"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPick={(v) => set({ keikan_need: v as any })}
                  />
                </div>
                <div>
                  <R
                    name="keikan_need"
                    val="1"
                    label={
                      <span>
                        必要（{" "}
                        <UnderlineInput
                          w="w-24"
                          v={value.keikan_need_note}
                          onV={(t) => set({ keikan_need_note: t })}
                        />{" "}
                        ）→
                      </span>
                    }
                    checked={value.keikan_need === "1"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPick={(v) => set({ keikan_need: v as any })}
                  />
                </div>
              </div>
            </td>

            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R
                  name="keikan_ans"
                  val="1"
                  label="予算計上"
                  checked={value.keikan_ans === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ keikan_ans: v as any })}
                />
                <R
                  name="keikan_ans"
                  val="2"
                  label={
                    <span>
                      その他（{" "}
                      <UnderlineInput
                        w="w-56"
                        v={value.keikan_other}
                        onV={(t) => set({ keikan_other: t })}
                      />{" "}
                      ）
                    </span>
                  }
                  checked={value.keikan_ans === "2"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ keikan_ans: v as any })}
                />
              </div>
            </td>
          </tr>

          {/* ========================= 調査 (3 rows) ========================== */}
          <tr>
            <td className={tdChk} rowSpan={3}>
              <input
                type="checkbox"
                name="grp_chosa"
                className="h-4 w-4"
                checked={value.grp_chosa}
                onChange={(e) => set({ grp_chosa: e.target.checked })}
              />
            </td>

            <td className={tdCat} rowSpan={3}>
              調査
            </td>

            <td className={tdItem}>打診調査（タイル・塗装）</td>

            <td className={tdOpt}>
              <div>
                <div className="flex flex-wrap gap-y-2">
                  <R
                    name="dashin_left"
                    val="1"
                    label="タイル面"
                    checked={value.dashin_left === "1"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPick={(v) => set({ dashin_left: v as any })}
                  />
                  <R
                    name="dashin_left"
                    val="2"
                    label="塗装面"
                    checked={value.dashin_left === "2"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPick={(v) => set({ dashin_left: v as any })}
                  />
                </div>

                <div className="mt-1">
                  <R
                    name="dashin_left"
                    val="3"
                    label={
                      <span>
                        その他（{" "}
                        <UnderlineInput
                          w="w-24"
                          v={value.dashin_left_other}
                          onV={(t) => set({ dashin_left_other: t })}
                        />{" "}
                        ）
                      </span>
                    }
                    checked={value.dashin_left === "3"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPick={(v) => set({ dashin_left: v as any })}
                  />
                </div>
              </div>
            </td>

            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R
                  name="dashin_ans"
                  val="1"
                  label="タイル面"
                  checked={value.dashin_ans === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ dashin_ans: v as any })}
                />
                <R
                  name="dashin_ans"
                  val="2"
                  label="塗装面"
                  checked={value.dashin_ans === "2"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ dashin_ans: v as any })}
                />
                <R
                  name="dashin_ans"
                  val="3"
                  label={
                    <span>
                      その他（{" "}
                      <UnderlineInput
                        w="w-56"
                        v={value.dashin_ans_other}
                        onV={(t) => set({ dashin_ans_other: t })}
                      />{" "}
                      ）
                    </span>
                  }
                  checked={value.dashin_ans === "3"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ dashin_ans: v as any })}
                />
              </div>
            </td>
          </tr>

          <tr>
            <td className={tdItem}>アスベスト含有調査</td>
            <td className={tdOpt}>
              <div>
                <div className="mb-1">
                  <R
                    name="chosa_asb"
                    val="0"
                    label="不要"
                    checked={value.chosa_asb === "0"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPick={(v) => set({ chosa_asb: v as any })}
                  />
                </div>
                <div>
                  <R
                    name="chosa_asb"
                    val="1"
                    label={
                      <span>
                        必要 <span className="ml-2">→</span>
                      </span>
                    }
                    checked={value.chosa_asb === "1"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPick={(v) => set({ chosa_asb: v as any })}
                  />
                </div>
              </div>
            </td>
            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R
                  name="chosa_asb_ans"
                  val="1"
                  label="予算計上"
                  checked={value.chosa_asb_ans === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ chosa_asb_ans: v as any })}
                />
                <R
                  name="chosa_asb_ans"
                  val="2"
                  label={
                    <span>
                      その他（{" "}
                      <UnderlineInput
                        w="w-56"
                        v={value.chosa_asb_other}
                        onV={(t) => set({ chosa_asb_other: t })}
                      />{" "}
                      ）
                    </span>
                  }
                  checked={value.chosa_asb_ans === "2"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ chosa_asb_ans: v as any })}
                />
              </div>
            </td>
          </tr>

          <tr className={thickBottom}>
            <td className={tdItem}>下地調整</td>
            <td className={tdOpt}>
              <div>
                <div className="mb-1">
                  <R
                    name="shitaji"
                    val="0"
                    label="不要"
                    checked={value.shitaji === "0"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPick={(v) => set({ shitaji: v as any })}
                  />
                </div>
                <div>
                  <R
                    name="shitaji"
                    val="1"
                    label={
                      <span>
                        必要（{" "}
                        <UnderlineInput
                          w="w-24"
                          v={value.shitaji_note}
                          onV={(t) => set({ shitaji_note: t })}
                        />{" "}
                        ）→
                      </span>
                    }
                    checked={value.shitaji === "1"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPick={(v) => set({ shitaji: v as any })}
                  />
                </div>
              </div>
            </td>
            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R
                  name="shitaji_ans"
                  val="1"
                  label="予算計上"
                  checked={value.shitaji_ans === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ shitaji_ans: v as any })}
                />
                <R
                  name="shitaji_ans"
                  val="2"
                  label={
                    <span>
                      その他（{" "}
                      <UnderlineInput
                        w="w-56"
                        v={value.shitaji_other}
                        onV={(t) => set({ shitaji_other: t })}
                      />{" "}
                      ）
                    </span>
                  }
                  checked={value.shitaji_ans === "2"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ shitaji_ans: v as any })}
                />
              </div>
            </td>
          </tr>

          {/* ========================= 確認 (6 rows) ========================== */}
          <tr>
            <td className={tdChk} rowSpan={6}>
              <input
                type="checkbox"
                name="grp_kakunin"
                className="h-4 w-4"
                checked={value.grp_kakunin}
                onChange={(e) => set({ grp_kakunin: e.target.checked })}
              />
            </td>

            <td className={tdCat} rowSpan={6}>
              確認
            </td>

            <td className={tdItem}>新築時タイル等保存資材</td>
            <td className={tdOpt}>
              <div>
                <div className="mb-1">
                  <R
                    name="hozon"
                    val="0"
                    label="不要"
                    checked={value.hozon === "0"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPick={(v) => set({ hozon: v as any })}
                  />
                </div>
                <div>
                  <R
                    name="hozon"
                    val="1"
                    label={
                      <span>
                        必要（{" "}
                        <UnderlineInput
                          w="w-24"
                          v={value.hozon_note}
                          onV={(t) => set({ hozon_note: t })}
                        />{" "}
                        ）→
                      </span>
                    }
                    checked={value.hozon === "1"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPick={(v) => set({ hozon: v as any })}
                  />
                </div>
              </div>
            </td>
            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R
                  name="hozon_ans"
                  val="1"
                  label="保管無し"
                  checked={value.hozon_ans === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ hozon_ans: v as any })}
                />
                <R
                  name="hozon_ans"
                  val="2"
                  label={
                    <span>
                      保管場所確認（{" "}
                      <UnderlineInput
                        w="w-56"
                        v={value.hozon_place}
                        onV={(t) => set({ hozon_place: t })}
                      />{" "}
                      ）
                    </span>
                  }
                  checked={value.hozon_ans === "2"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ hozon_ans: v as any })}
                />
              </div>
            </td>
          </tr>

          <tr>
            <td className={tdItem}>施工業者の建設業許可確認</td>
            <td className={tdOpt}>
              <div>
                <div className="mb-1">
                  <R
                    name="sekou_kyoka"
                    val="0"
                    label="不要"
                    checked={value.sekou_kyoka === "0"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPick={(v) => set({ sekou_kyoka: v as any })}
                  />
                </div>
                <div>
                  <R
                    name="sekou_kyoka"
                    val="1"
                    label={
                      <span>
                        必要（{" "}
                        <UnderlineInput
                          w="w-24"
                          v={value.sekou_kyoka_note}
                          onV={(t) => set({ sekou_kyoka_note: t })}
                        />{" "}
                        ）→
                      </span>
                    }
                    checked={value.sekou_kyoka === "1"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPick={(v) => set({ sekou_kyoka: v as any })}
                  />
                </div>
              </div>
            </td>
            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R
                  name="sekou_kyoka_ans"
                  val="1"
                  label="問題なし"
                  checked={value.sekou_kyoka_ans === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ sekou_kyoka_ans: v as any })}
                />
                <R
                  name="sekou_kyoka_ans"
                  val="2"
                  label={
                    <span>
                      その他（{" "}
                      <UnderlineInput
                        w="w-56"
                        v={value.sekou_kyoka_other}
                        onV={(t) => set({ sekou_kyoka_other: t })}
                      />{" "}
                      ）
                    </span>
                  }
                  checked={value.sekou_kyoka_ans === "2"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ sekou_kyoka_ans: v as any })}
                />
              </div>
            </td>
          </tr>

          <tr>
            <td className={tdItem}>契約支店の建設業許可確認</td>
            <td className={tdOpt}>
              <div>
                <div className="mb-1">
                  <R
                    name="shiten_kyoka"
                    val="1"
                    label="問題なし"
                    checked={value.shiten_kyoka === "1"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPick={(v) => set({ shiten_kyoka: v as any })}
                  />
                </div>
                <div>
                  <R
                    name="shiten_kyoka"
                    val="2"
                    label={
                      <span>
                        要申請（{" "}
                        <UnderlineInput
                          w="w-24"
                          v={value.shiten_kyoka_note}
                          onV={(t) => set({ shiten_kyoka_note: t })}
                        />{" "}
                        ）→
                      </span>
                    }
                    checked={value.shiten_kyoka === "2"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPick={(v) => set({ shiten_kyoka: v as any })}
                  />
                </div>
              </div>
            </td>
            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R
                  name="shiten_kyoka_ans"
                  val="1"
                  label="契約までに一般申請許可"
                  checked={value.shiten_kyoka_ans === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ shiten_kyoka_ans: v as any })}
                />
                <R
                  name="shiten_kyoka_ans"
                  val="2"
                  label={
                    <span>
                      その他（{" "}
                      <UnderlineInput
                        w="w-56"
                        v={value.shiten_kyoka_other}
                        onV={(t) => set({ shiten_kyoka_other: t })}
                      />{" "}
                      ）
                    </span>
                  }
                  checked={value.shiten_kyoka_ans === "2"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ shiten_kyoka_ans: v as any })}
                />
              </div>
            </td>
          </tr>

          <tr>
            <td className={tdItem}>家電リサイクル法</td>
            <td className={tdOpt}>
              <div>
                <div className="mb-1">
                  <R
                    name="kaden"
                    val="1"
                    label="対象なし"
                    checked={value.kaden === "1"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPick={(v) => set({ kaden: v as any })}
                  />
                </div>
                <div>
                  <R
                    name="kaden"
                    val="2"
                    label={
                      <span>
                        対象あり <span className="ml-2">→</span>
                      </span>
                    }
                    checked={value.kaden === "2"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPick={(v) => set({ kaden: v as any })}
                  />
                </div>
              </div>
            </td>
            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R
                  name="kaden_ans"
                  val="1"
                  label="別途、お客様にて処分"
                  checked={value.kaden_ans === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ kaden_ans: v as any })}
                />
                <R
                  name="kaden_ans"
                  val="2"
                  label={
                    <span>
                      その他（{" "}
                      <UnderlineInput
                        w="w-56"
                        v={value.kaden_other}
                        onV={(t) => set({ kaden_other: t })}
                      />{" "}
                      ）
                    </span>
                  }
                  checked={value.kaden_ans === "2"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ kaden_ans: v as any })}
                />
              </div>
            </td>
          </tr>

          <tr>
            <td className={tdItem}>フロン排出抑制法</td>
            <td className={tdOpt}>
              <div>
                <div className="mb-1">
                  <R
                    name="furon"
                    val="1"
                    label="対象なし"
                    checked={value.furon === "1"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPick={(v) => set({ furon: v as any })}
                  />
                </div>
                <div>
                  <R
                    name="furon"
                    val="2"
                    label={
                      <span>
                        対象あり <span className="ml-2">→</span>
                      </span>
                    }
                    checked={value.furon === "2"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPick={(v) => set({ furon: v as any })}
                  />
                </div>
              </div>
            </td>
            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R
                  name="furon_ans"
                  val="1"
                  label="別途、お客様にて処分"
                  checked={value.furon_ans === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ furon_ans: v as any })}
                />
                <R
                  name="furon_ans"
                  val="2"
                  label={
                    <span>
                      その他（{" "}
                      <UnderlineInput
                        w="w-56"
                        v={value.furon_other}
                        onV={(t) => set({ furon_other: t })}
                      />{" "}
                      ）
                    </span>
                  }
                  checked={value.furon_ans === "2"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ furon_ans: v as any })}
                />
              </div>
            </td>
          </tr>

          <tr className={thickBottom}>
            <td className={tdItem}>防水工事等保証の確認</td>
            <td className={tdOpt}>
              <div>
                <div className="mb-1">
                  <R
                    name="bousui"
                    val="0"
                    label="不要"
                    checked={value.bousui === "0"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPick={(v) => set({ bousui: v as any })}
                  />
                </div>
                <div>
                  <R
                    name="bousui"
                    val="1"
                    label={
                      <span>
                        必要（{" "}
                        <UnderlineInput
                          w="w-24"
                          v={value.bousui_note}
                          onV={(t) => set({ bousui_note: t })}
                        />{" "}
                        ）→
                      </span>
                    }
                    checked={value.bousui === "1"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPick={(v) => set({ bousui: v as any })}
                  />
                </div>
              </div>
            </td>

            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R
                  name="bousui_ans"
                  val="1"
                  label={
                    <span>
                      保証年数（{" "}
                      <UnderlineInput
                        w="w-16"
                        v={value.bousui_years}
                        onV={(t) => set({ bousui_years: t })}
                      />{" "}
                      年）
                    </span>
                  }
                  checked={value.bousui_ans === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ bousui_ans: v as any })}
                />
                <R
                  name="bousui_ans"
                  val="2"
                  label={
                    <span>
                      その他（{" "}
                      <UnderlineInput
                        w="w-56"
                        v={value.bousui_other}
                        onV={(t) => set({ bousui_other: t })}
                      />{" "}
                      ）
                    </span>
                  }
                  checked={value.bousui_ans === "2"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ bousui_ans: v as any })}
                />
              </div>
            </td>
          </tr>

          {/* ========================= 現場指示事項 (BIG blank area) ========================== */}
          <tr className={thickTop}>
            <td
              className="w-36 border-2 border-black bg-sky-100 px-3 py-3 text-sm font-semibold align-middle"
              colSpan={2}
            >
              【現場指示事項】
            </td>
            <td className="border-2 border-black" colSpan={3}>
              <TextArea
                value={value.genba_shiji}
                onChange={(e) => set({ genba_shiji: e.target.value })}
              />
            </td>
          </tr>

          {/* ========================= 設計確認 ========================== */}
          <tr>
            <td
              className="border-2 border-black bg-sky-100 px-3 py-4 text-sm font-semibold text-center align-middle"
              colSpan={2}
              rowSpan={2}
            >
              設計確認
            </td>

            <td className="border-2 border-black px-4 py-4 text-sm" colSpan={3}>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <R
                  name="sekkei"
                  val="0"
                  label="不要"
                  checked={value.sekkei === "0"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ sekkei: v as any })}
                />
                <R
                  name="sekkei"
                  val="1"
                  label={
                    <span>
                      必要（大規模修繕等で確認申請が必要と考えられる場合）→ 管理建築士に確認依頼
                    </span>
                  }
                  checked={value.sekkei === "1"}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPick={(v) => set({ sekkei: v as any })}
                />
              </div>
            </td>
          </tr>

          <tr>
            <td className="border-2 border-black px-4 py-4 text-sm" colSpan={3}>
              <span className="mr-2">設計コメント (</span>
              <UnderlineInput
                w="w-[72%]"
                v={value.sekkei_comment}
                onV={(t) => set({ sekkei_comment: t })}
              />
              <span className="ml-2">)</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
