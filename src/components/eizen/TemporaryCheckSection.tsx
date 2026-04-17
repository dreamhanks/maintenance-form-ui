import { CheckRow } from "./EizenFormTypes";
import { sectionHeader, sectionWrap, textareaClass } from "./EizenFormStyles";
import { LabelCell, MatrixRow, MatrixRowFileUpload, ValueCell } from "./EizenCommon";

type Props = {
  rows: CheckRow[];
  updateRow: (id: string, next: CheckRow) => void;
  siteInstruction: string;
  setSiteInstruction: (v: string) => void;
  sectionKasetsu: boolean;
  setSectionKasetsu: (v: boolean) => void;
  sectionAshiba: boolean;
  setSectionAshiba: (v: boolean) => void;
  sectionBouhan: boolean;
  setSectionBouhan: (v: boolean) => void;
  sectionYosan: boolean;
  setSectionYosan: (v: boolean) => void;
  densenbogokanFileUpload?: MatrixRowFileUpload;
  ashibaPlanFileUpload?: MatrixRowFileUpload;
  plantingPlanFileUpload?: MatrixRowFileUpload;
  disableDapConfirmAndRemark?: boolean;
  disableMainContent?: boolean;
};

export default function TemporaryCheckSection(props: Props) {
  const categoryCheckboxMap: Record<number, { checked: boolean; onChange: (v: boolean) => void }> = {
    0: { checked: props.sectionKasetsu, onChange: props.setSectionKasetsu },
    7: { checked: props.sectionAshiba, onChange: props.setSectionAshiba },
    15: { checked: props.sectionBouhan, onChange: props.setSectionBouhan },
    16: { checked: props.sectionYosan, onChange: props.setSectionYosan },
  };

  return (
    <section className={sectionWrap}>
      <div className="grid grid-cols-12 bg-[#17375E] font-semibold text-white">
        <div className={`${sectionHeader} col-span-6`}>◆仮設チェック欄</div>
        <div className={`${sectionHeader} col-span-6 bg-[#2B547E]`}>大パ確認</div>
        {/* <div className="col-span-1 border border-slate-300 px-3 py-2">分類</div>
        <div className="col-span-1 border border-slate-300 px-3 py-2">項目</div>
        <div className="col-span-1 border border-slate-300 px-3 py-2">必要 / 不要</div>
        <div className="col-span-3 border border-slate-300 px-3 py-2">内容</div>
        <div className="col-span-1 border border-slate-300 px-3 py-2">大パ確認</div>
        <div className="col-span-5 border border-slate-300 px-3 py-2">備考</div> */}
      </div>

      {(() => {
        const renderRow = (row: CheckRow, i: number) => (
          <MatrixRow
            key={row.id}
            index={i}
            type={1}
            row={row}
            onChange={(next) => props.updateRow(row.id, next)}
            categoryCheckbox={categoryCheckboxMap[i]}
            disableDapConfirmAndRemark={props.disableDapConfirmAndRemark}
            disableMainContent={props.disableMainContent}
            fileUpload={row.id === "r5" ? props.densenbogokanFileUpload : row.id === "r7" ? props.ashibaPlanFileUpload : row.id === "r12" ? props.plantingPlanFileUpload : undefined}
          />
        );
        const groups: { masterIdx: number; range: [number, number]; enabled: boolean }[] = [
          { masterIdx: 0, range: [0, 6], enabled: props.sectionKasetsu },
          { masterIdx: 7, range: [7, 14], enabled: props.sectionAshiba },
          { masterIdx: 15, range: [15, 15], enabled: props.sectionBouhan },
          { masterIdx: 16, range: [16, props.rows.length - 1], enabled: props.sectionYosan },
        ];
        const dimChildrenExceptFirst = "[&>div>*:not(:first-child)]:opacity-50 [&>div>*:not(:first-child)]:pointer-events-none";
        return groups.map((g, gi) => (
          <div key={gi}>
            <div className={!props.disableMainContent && !g.enabled ? dimChildrenExceptFirst : ""}>
              {renderRow(props.rows[g.masterIdx], g.masterIdx)}
            </div>
            {g.range[1] > g.masterIdx && (
              <div className={!props.disableMainContent && !g.enabled ? "opacity-50 pointer-events-none" : ""}>
                {props.rows.slice(g.masterIdx + 1, g.range[1] + 1).map((row, j) => renderRow(row, g.masterIdx + 1 + j))}
              </div>
            )}
          </div>
        ));
      })()}

      <div className="grid grid-cols-12">
        <LabelCell>現場指示事項</LabelCell>
        <ValueCell className="col-span-11">
          <textarea value={props.siteInstruction} onChange={(e) => props.setSiteInstruction(e.target.value)} rows={4} maxLength={300} className={textareaClass} />
        </ValueCell>
      </div>
    </section>
  );
}