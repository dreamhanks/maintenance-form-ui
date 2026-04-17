import { CheckRow } from "./EizenFormTypes";
import { sectionHeader, sectionWrap, textareaClass } from "./EizenFormStyles";
import { LabelCell, MatrixRow, MatrixRowFileUpload, RemarkFileUploadContext, ValueCell } from "./EizenCommon";

type Props = {
  rows: CheckRow[];
  updateRow: (id: string, next: CheckRow) => void;
  siteInstruction: string;
  setSiteInstruction: (v: string) => void;
  grpTodokede: boolean;
  setGrpTodokede: (v: boolean) => void;
  grpChosa: boolean;
  setGrpChosa: (v: boolean) => void;
  grpKakunin: boolean;
  setGrpKakunin: (v: boolean) => void;
  danshinSonotaFileUpload?: MatrixRowFileUpload;
  shitajiFileUpload?: MatrixRowFileUpload;
  remarkFileUpload?: RemarkFileUploadContext;
  disableDapConfirmAndRemark?: boolean;
  disableMainContent?: boolean;
};

export default function TemporaryConfirmSection(props: Props) {
  const categoryCheckboxMap: Record<number, { checked: boolean; onChange: (v: boolean) => void }> = {
    0: { checked: props.grpTodokede, onChange: props.setGrpTodokede },
    6: { checked: props.grpChosa, onChange: props.setGrpChosa },
    8: { checked: props.grpKakunin, onChange: props.setGrpKakunin },
  };

  return (
    <section className={sectionWrap}>
      <div className="grid grid-cols-12 bg-[#17375E] font-semibold text-white">
            <div className={`${sectionHeader} col-span-6`}>◆仮設確認</div>
            <div className={`${sectionHeader} col-span-6 bg-[#2B547E]`}>大パ確認</div>
        {/* <div className="col-span-2 border border-slate-300 px-3 py-2">分類</div>
        <div className="col-span-3 border border-slate-300 px-3 py-2">項目</div>
        <div className="col-span-1 border border-slate-300 px-3 py-2">必要 / 不要</div>
        <div className="col-span-4 border border-slate-300 px-3 py-2">内容</div>
        <div className="col-span-1 border border-slate-300 px-3 py-2">大パ確認</div>
        <div className="col-span-1 border border-slate-300 px-3 py-2">備考</div> */}
      </div>

      {(() => {
        const renderRow = (row: CheckRow, i: number) => (
          <MatrixRow
            key={row.id}
            index={i}
            type={2}
            row={row}
            onChange={(next) => props.updateRow(row.id, next)}
            categoryCheckbox={categoryCheckboxMap[i]}
            disableDapConfirmAndRemark={props.disableDapConfirmAndRemark}
            disableMainContent={props.disableMainContent}
            sonotaFileUpload={row.id === "p2r6" ? props.danshinSonotaFileUpload : undefined}
            fileUpload={row.id === "p2r7" ? props.shitajiFileUpload : undefined}
            remarkFileUpload={row.id === "p2r8" ? props.remarkFileUpload : undefined}
          />
        );
        const groups: { masterIdx: number; range: [number, number]; enabled: boolean }[] = [
          { masterIdx: 0, range: [0, 5], enabled: props.grpTodokede },
          { masterIdx: 6, range: [6, 7], enabled: props.grpChosa },
          { masterIdx: 8, range: [8, props.rows.length - 1], enabled: props.grpKakunin },
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