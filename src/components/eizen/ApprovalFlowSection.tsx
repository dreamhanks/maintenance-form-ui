import { sectionWrap } from "./EizenFormStyles";

type Props = {
  approval1: string;
  setApproval1: (v: string) => void;
  approval2: string;
  setApproval2: (v: string) => void;
  approval3: string;
  setApproval3: (v: string) => void;
  approval4: string;
  setApproval4: (v: string) => void;
  approval5: string;
  setApproval5: (v: string) => void;
  approval6: string;
  setApproval6: (v: string) => void;
  approval7: string;
  setApproval7: (v: string) => void;
};

function Box({
  title,
  value,
  onChange,
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-xl border-2 border-slate-800">
      <div className="border-b-2 border-slate-800 bg-slate-50 px-3 py-2 text-center font-semibold">{title}</div>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} className="w-full p-3 outline-none" />
      <div className="grid grid-cols-2 border-t-2 border-slate-800">
        <div className="border-r-2 border-slate-800 px-3 py-2 text-center">確認</div>
        <div className="px-3 py-2 text-center">差戻</div>
      </div>
    </div>
  );
}

export default function ApprovalFlowSection(props: Props) {
  return (
    <section className={sectionWrap}>
      <div className="grid [grid-template-columns:repeat(24,minmax(0,1fr))] gap-3 p-4">
        <div />
        <div className="col-span-2"><Box title="大パ担当者" value={props.approval1} onChange={props.setApproval1} /></div>
        <div className="col-span-2"><Box title="大パ管理職" value={props.approval2} onChange={props.setApproval2} /></div>
        <div className="col-span-2"><Box title="メンテ管理" value={props.approval3} onChange={props.setApproval3} /></div>
        <div className="flex items-center justify-center">
            <div className="h-0.5 w-6 bg-slate-800 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 border-y-4 border-l-4 border-y-transparent border-l-slate-800" />
            </div>
        </div>
        <div className="col-span-2"><Box title="設計管理職" value={props.approval4} onChange={props.setApproval4} /></div>
        <div className="flex items-center justify-center">
            <div className="h-0.5 w-6 bg-slate-800 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 border-y-4 border-l-4 border-y-transparent border-l-slate-800" />
            </div>
        </div>
        <div className="col-span-2"><Box title="大パ担当者" value={props.approval1} onChange={props.setApproval1} /></div>
        <div className="col-span-2"><Box title="大パ管理職" value={props.approval2} onChange={props.setApproval2} /></div>
        <div className="col-span-2"><Box title="メンテ管理" value={props.approval3} onChange={props.setApproval3} /></div>
        <div className="flex items-center justify-center">
            <div className="h-0.5 w-6 bg-slate-800 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 border-y-4 border-l-4 border-y-transparent border-l-slate-800" />
            </div>
        </div>
        <div className="col-span-2"><Box title="大パ担当者" value={props.approval5} onChange={props.setApproval5} /></div>
        <div className="col-span-2"><Box title="大パ管理職" value={props.approval6} onChange={props.setApproval6} /></div>
        <div className="col-span-2"><Box title="業務管理職" value={props.approval7} onChange={props.setApproval7} /></div>
      </div>
    </section>
  );
}