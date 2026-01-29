import { TextArea } from "./PaperTable";

export function TodokedeChosaKakuninTable() {
  // ===== styles (match PDF) =====
  const thLeft ="border-2 border-black bg-sky-100 px-2 py-2 text-sm font-semibold text-left";
  const thRight ="border-2 border-black bg-gray-200 px-2 py-2 text-sm font-semibold text-center";

  const td = "border border-black px-3 py-2 text-sm align-middle";
//   const tdCenter = `${td} text-center align-middle`;
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
    value,
    label,
  }: {
    name: string;
    value: string;
    label: React.ReactNode;
  }) => (
    <label className="inline-flex items-center gap-2 mr-6">
      <input type="radio" name={name} value={value} className="h-4 w-4" />
      <span>{label}</span>
    </label>
  );

  const UnderlineInput = ({ w = "w-20" }: { w?: string }) => (
    <input
      className={`${w} border-b border-black outline-none bg-transparent`}
      type="text"
    />
  );

  return (
    <div className="overflow-x-auto form-text">

      <p className="text-base mb-2">
        以下、工事・メンテナンスセンターにて記入（該当項目にチェックし、詳細記入願います）
      </p>

      <table
        className={`border-collapse w-full min-w-[1100px] ${thickLeft} ${thickRight} ${thickTop} ${thickBottom}`}
      >
        <thead>
          <tr>
            {/* header left spans 4 columns */}
            <th className={thLeft} colSpan={4}>
              ◆仮設確認
            </th>
            <th className={thRight}>大元回答</th>
          </tr>
        </thead>

        <tbody>
          {/* =========================
              届出 (3 rows)
          ========================== */}
          <tr>
            {/* group radio (rowspan 3) */}
            <td className={tdChk} rowSpan={3}>
                <input type="checkbox" name="grp_todokede" className="h-4 w-4" />
            </td>

            {/* category (rowspan 3) */}
            <td className={`${tdCat} w-20`} rowSpan={3}>
              届出
            </td>

            <td className={tdItem}>道路使用・占用届</td>

            {/* options (HORIZONTAL like image) */}
            <td className={tdOpt}>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <R name="road_use" value="use" label="道路使用" />
                <R name="road_use" value="occupy" label="道路占用" />
              </div>
            </td>

            {/* answer */}
            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R name="road_use_ans" value="budget" label="予算計上" />
                <R
                  name="road_use_ans"
                  value="other"
                  label={
                    <span>
                      その他（ <UnderlineInput w="w-56" /> ）
                    </span>
                  }
                />
              </div>
            </td>
          </tr>

          <tr>
            <td className={tdItem}>アスベスト含有調査</td>
            <td className={tdOpt}>
              {/* TWO LINES like image */}
              <div>
                <div className="mb-1">
                  <R name="asbestos_need" value="no" label="不要" />
                </div>
                <div>
                  <R
                    name="asbestos_need"
                    value="yes"
                    label={
                      <span>
                        必要（ <UnderlineInput w="w-24" /> ）→
                      </span>
                    }
                  />
                </div>
              </div>
            </td>
            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R name="asbestos_ans" value="budget" label="予算計上" />
                <R
                  name="asbestos_ans"
                  value="other"
                  label={
                    <span>
                      その他（ <UnderlineInput w="w-56" /> ）
                    </span>
                  }
                />
              </div>
            </td>
          </tr>

          <tr className={thickBottom}>
            <td className={tdItem}>景観条例対象届出</td>
            <td className={tdOpt}>
              <div>
                <div className="mb-1">
                  <R name="keikan_need" value="no" label="不要" />
                </div>
                <div>
                  <R
                    name="keikan_need"
                    value="yes"
                    label={
                      <span>
                        必要（ <UnderlineInput w="w-24" /> ）→
                      </span>
                    }
                  />
                </div>
              </div>
            </td>
            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R name="keikan_ans" value="budget" label="予算計上" />
                <R
                  name="keikan_ans"
                  value="other"
                  label={
                    <span>
                      その他（ <UnderlineInput w="w-56" /> ）
                    </span>
                  }
                />
              </div>
            </td>
          </tr>

          {/* =========================
              調査 (3 rows)
          ========================== */}
          <tr>
            <td className={tdChk} rowSpan={3}>
              <input type="checkbox" name="grp_chosa" className="h-4 w-4" />
            </td>
            <td className={tdCat} rowSpan={3}>
              調査
            </td>

            <td className={tdItem}>打診調査（タイル・塗装）</td>

            {/* left options: 2 lines (tile/paint + other with blank) */}
            <td className={tdOpt}>
              <div>
                <div className="flex flex-wrap gap-y-2">
                  <R name="dashin_left" value="tile" label="タイル面" />
                  <R name="dashin_left" value="paint" label="塗装面" />
                </div>
                <div className="mt-1">
                  <R
                    name="dashin_left"
                    value="other"
                    label={
                      <span>
                        その他（ <UnderlineInput w="w-24" /> ）
                      </span>
                    }
                  />
                </div>
              </div>
            </td>

            {/* right answer: tile/paint/other */}
            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R name="dashin_ans" value="tile" label="タイル面" />
                <R name="dashin_ans" value="paint" label="塗装面" />
                <R
                  name="dashin_ans"
                  value="other"
                  label={
                    <span>
                      その他（ <UnderlineInput w="w-56" /> ）
                    </span>
                  }
                />
              </div>
            </td>
          </tr>

          <tr>
            <td className={tdItem}>アスベスト含有調査</td>
            <td className={tdOpt}>
              {/* image: "不要 / 必要 →" (NO parentheses here) */}
              <div>
                <div className="mb-1">
                  <R name="chosa_asb" value="no" label="不要" />
                </div>
                <div>
                  <R
                    name="chosa_asb"
                    value="yes"
                    label={
                      <span>
                        必要 <span className="ml-2">→</span>
                      </span>
                    }
                  />
                </div>
              </div>
            </td>
            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R name="chosa_asb_ans" value="budget" label="予算計上" />
                <R
                  name="chosa_asb_ans"
                  value="other"
                  label={
                    <span>
                      その他（ <UnderlineInput w="w-56" /> ）
                    </span>
                  }
                />
              </div>
            </td>
          </tr>

          <tr className={thickBottom}>
            <td className={tdItem}>下地調整</td>
            <td className={tdOpt}>
              <div>
                <div className="mb-1">
                  <R name="shitaji" value="no" label="不要" />
                </div>
                <div>
                  <R
                    name="shitaji"
                    value="yes"
                    label={
                      <span>
                        必要（ <UnderlineInput w="w-24" /> ）→
                      </span>
                    }
                  />
                </div>
              </div>
            </td>
            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R name="shitaji_ans" value="budget" label="予算計上" />
                <R
                  name="shitaji_ans"
                  value="other"
                  label={
                    <span>
                      その他（ <UnderlineInput w="w-56" /> ）
                    </span>
                  }
                />
              </div>
            </td>
          </tr>

          {/* =========================
              確認 (6 rows)
          ========================== */}
          <tr>
            <td className={tdChk} rowSpan={6}>
              <input type="checkbox" name="grp_kakunin" className="h-4 w-4" />
            </td>
            <td className={tdCat} rowSpan={6}>
              確認
            </td>

            <td className={tdItem}>新築時タイル等保存資材</td>
            <td className={tdOpt}>
              <div>
                <div className="mb-1">
                  <R name="hozon" value="no" label="不要" />
                </div>
                <div>
                  <R
                    name="hozon"
                    value="yes"
                    label={
                      <span>
                        必要（ <UnderlineInput w="w-24" /> ）→
                      </span>
                    }
                  />
                </div>
              </div>
            </td>
            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R name="hozon_ans" value="none" label="保管無し" />
                <R
                  name="hozon_ans"
                  value="place"
                  label={
                    <span>
                      保管場所確認（ <UnderlineInput w="w-56" /> ）
                    </span>
                  }
                />
              </div>
            </td>
          </tr>

          <tr>
            <td className={tdItem}>施工業者の建設業許可確認</td>
            <td className={tdOpt}>
              <div>
                <div className="mb-1">
                  <R name="sekou_kyoka" value="no" label="不要" />
                </div>
                <div>
                  <R
                    name="sekou_kyoka"
                    value="yes"
                    label={
                      <span>
                        必要（ <UnderlineInput w="w-24" /> ）→
                      </span>
                    }
                  />
                </div>
              </div>
            </td>
            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R name="sekou_kyoka_ans" value="ok" label="問題なし" />
                <R
                  name="sekou_kyoka_ans"
                  value="other"
                  label={
                    <span>
                      その他（ <UnderlineInput w="w-56" /> ）
                    </span>
                  }
                />
              </div>
            </td>
          </tr>

          <tr>
            <td className={tdItem}>契約支店の建設業許可確認</td>
            <td className={tdOpt}>
              {/* image: "問題なし / 要申請（ ）→" */}
              <div>
                <div className="mb-1">
                  <R name="shiten_kyoka" value="ok" label="問題なし" />
                </div>
                <div>
                  <R
                    name="shiten_kyoka"
                    value="apply"
                    label={
                      <span>
                        要申請（ <UnderlineInput w="w-24" /> ）→
                      </span>
                    }
                  />
                </div>
              </div>
            </td>
            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R
                  name="shiten_kyoka_ans"
                  value="until_contract"
                  label="契約までに一般申請許可"
                />
                <R
                  name="shiten_kyoka_ans"
                  value="other"
                  label={
                    <span>
                      その他（ <UnderlineInput w="w-56" /> ）
                    </span>
                  }
                />
              </div>
            </td>
          </tr>

          <tr>
            <td className={tdItem}>家電リサイクル法</td>
            <td className={tdOpt}>
              {/* image: "対象なし / 対象あり →" */}
              <div>
                <div className="mb-1">
                  <R name="kaden" value="none" label="対象なし" />
                </div>
                <div>
                  <R
                    name="kaden"
                    value="yes"
                    label={
                      <span>
                        対象あり <span className="ml-2">→</span>
                      </span>
                    }
                  />
                </div>
              </div>
            </td>
            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R
                  name="kaden_ans"
                  value="customer"
                  label="別途、お客様にて処分"
                />
                <R
                  name="kaden_ans"
                  value="other"
                  label={
                    <span>
                      その他（ <UnderlineInput w="w-56" /> ）
                    </span>
                  }
                />
              </div>
            </td>
          </tr>

          <tr>
            <td className={tdItem}>フロン排出抑制法</td>
            <td className={tdOpt}>
              {/* image shows no left options text; keep empty like PDF feel */}
                <div>
                <div className="mb-1">
                  <R name="furon" value="none" label="対象なし" />
                </div>
                <div>
                  <R
                    name="furon"
                    value="yes"
                    label={
                      <span>
                        対象あり <span className="ml-2">→</span>
                      </span>
                    }
                  />
                </div>
              </div>
            </td>
            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R
                  name="furon_ans"
                  value="customer"
                  label="別途、お客様にて処分"
                />
                <R
                  name="furon_ans"
                  value="other"
                  label={
                    <span>
                      その他（ <UnderlineInput w="w-56" /> ）
                    </span>
                  }
                />
              </div>
            </td>
          </tr>

          <tr className={thickBottom}>
            <td className={tdItem}>防水工事等保証の確認</td>
            <td className={tdOpt}>
              <div>
                <div className="mb-1">
                  <R name="bousui" value="no" label="不要" />
                </div>
                <div>
                  <R
                    name="bousui"
                    value="yes"
                    label={
                      <span>
                        必要（ <UnderlineInput w="w-24" /> ）→
                      </span>
                    }
                  />
                </div>
              </div>
            </td>
            <td className={tdAns}>
              <div className="flex flex-wrap gap-y-2">
                <R
                  name="bousui_ans"
                  value="years"
                  label={
                    <span>
                      保証年数（ <UnderlineInput w="w-16" /> 年）
                    </span>
                  }
                />
                <R
                  name="bousui_ans"
                  value="other"
                  label={
                    <span>
                      その他（ <UnderlineInput w="w-56" /> ）
                    </span>
                  }
                />
              </div>
            </td>
          </tr>

          {/* =========================
              現場指示事項 (BIG blank area)
          ========================== */}
          <tr className={thickTop}>
            <td className="w-36 border-2 border-black bg-sky-100 px-3 py-3 text-sm font-semibold align-middle"
                colSpan={2}>
              【現場指示事項】
            </td>
            <td className="border-2 border-black" colSpan={3}>
              <TextArea />
            </td>
          </tr>

          {/* =========================
              設計確認
          ========================== */}
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
                <R name="sekkei" value="no" label="不要" />
                <R
                  name="sekkei"
                  value="yes"
                  label={
                    <span>
                      必要（大規模修繕等で確認申請が必要と考えられる場合）→ 管理建築士に確認依頼
                    </span>
                  }
                />
              </div>
            </td>
          </tr>

          <tr>
            <td className="border-2 border-black px-4 py-4 text-sm" colSpan={3}>
              <span className="mr-2">設計コメント（</span>
              <UnderlineInput w="w-[72%]" />
              <span className="ml-2">）</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
