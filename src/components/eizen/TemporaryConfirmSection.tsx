import { CheckRow } from "./EizenFormTypes";
import { sectionHeader, sectionWrap, textareaClass } from "./EizenFormStyles";
import { LabelCell, MatrixRow, ValueCell } from "./EizenCommon";

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
};

export default function TemporaryConfirmSection(props: Props) {
  const categoryCheckboxMap: Record<number, { checked: boolean; onChange: (v: boolean) => void }> = {
    0: { checked: props.grpTodokede, onChange: props.setGrpTodokede },
    5: { checked: props.grpChosa, onChange: props.setGrpChosa },
    7: { checked: props.grpKakunin, onChange: props.setGrpKakunin },
  };

  return (
    <section className={sectionWrap}>
      <div className="grid grid-cols-12 bg-sky-50 font-semibold text-slate-800">
            <div className={`${sectionHeader} col-span-6`}>◆仮設確認</div>
            <div className={`${sectionHeader} col-span-6`}>大パ確認</div>
        {/* <div className="col-span-2 border border-slate-300 px-3 py-2">分類</div>
        <div className="col-span-3 border border-slate-300 px-3 py-2">項目</div>
        <div className="col-span-1 border border-slate-300 px-3 py-2">必要 / 不要</div>
        <div className="col-span-4 border border-slate-300 px-3 py-2">内容</div>
        <div className="col-span-1 border border-slate-300 px-3 py-2">大パ確認</div>
        <div className="col-span-1 border border-slate-300 px-3 py-2">備考</div> */}
      </div>

      {props.rows.map((row, i) => (
        <MatrixRow key={row.id} index={i} type={2} row={row} onChange={(next) => props.updateRow(row.id, next)} categoryCheckbox={categoryCheckboxMap[i]} />
      ))}

      <div className="grid grid-cols-12">
        <LabelCell>現場指示事項</LabelCell>
        <ValueCell className="col-span-11">
          <textarea value={props.siteInstruction} onChange={(e) => props.setSiteInstruction(e.target.value)} rows={4} className={textareaClass} />
        </ValueCell>
      </div>
    </section>
  );
}