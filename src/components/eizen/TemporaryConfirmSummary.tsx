import { CheckRow } from "./EizenFormTypes";

type Props = {
  rows: CheckRow[];
};

function renderContent(row: CheckRow) {
  const entries = Object.entries(row.checks);

  if (row.variant === "twoLine") {
    const splitAt = row.splitAt ?? 1;
    const line1 = entries.slice(0, splitAt).filter(([, v]) => v);
    const line2 = entries
      .slice(splitAt)
      .filter(([k, v]) => v && !(row.otherText !== undefined && k === "その他"));
    const sonotaChecked = row.checks["その他"] === true;

    return (
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap gap-x-4">
          {line1.map(([k]) => (
            <span key={k}>{k}</span>
          ))}
          {row.amount && (
            <span>
              {row.amountPrefix && `${row.amountPrefix} `}
              {row.amount}
              {row.unit ?? ""}
            </span>
          )}
        </div>
        {line2.length > 0 && (
          <div className="flex flex-wrap gap-x-4">
            {line2.map(([k]) => (
              <span key={k}>{k}</span>
            ))}
          </div>
        )}
        {sonotaChecked && row.otherText !== undefined && (
          <div className="flex gap-x-2">
            <span>その他</span>
            {row.otherText && <span>（{row.otherText}）</span>}
          </div>
        )}
      </div>
    );
  }

  if (row.variant === "twoLineReverse") {
    const line1 = entries.filter(([k, v]) => v && k !== "その他");
    const sonotaChecked = row.checks["その他"] === true;

    return (
      <div className="flex flex-col gap-1">
        {line1.length > 0 && (
          <div className="flex flex-wrap gap-x-4">
            {line1.map(([k]) => (
              <span key={k}>{k}</span>
            ))}
          </div>
        )}
        {sonotaChecked && row.otherText !== undefined && (
          <div className="flex gap-x-2">
            <span>その他</span>
            {row.otherText && <span>（{row.otherText}）</span>}
          </div>
        )}
        {row.line2Check && row.line2Checked === true && (
          <div className="flex flex-wrap gap-x-4">
            <span>{row.line2Check}</span>
            {row.amount && (
              <span>
                {row.amount}
                {row.unit ?? ""}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  if (row.variant === "checksInConfirm") {
    return (
      <div className="flex flex-wrap gap-x-4">
        {entries
          .filter(([, v]) => v)
          .map(([k]) => (
            <span key={k}>{k}</span>
          ))}
        {row.amount && (
          <span>
            {row.amount}
            {row.unit ?? ""}
          </span>
        )}
      </div>
    );
  }

  if (row.variant === "fullInput") {
    return (
      <div className="flex flex-wrap gap-x-4">
        {row.amount && (
          <span>
            {row.amount}
            {row.unit ?? ""}
          </span>
        )}
      </div>
    );
  }

  if (row.variant === "noRadioTwoLine") {
    const mainChecks = entries.filter(
      ([k, v]) => v && !row.radioColKeys?.includes(k) && k !== "その他"
    );
    const sonotaChecked = row.checks["その他"] === true;

    return (
      <div className="flex flex-col gap-1">
        {mainChecks.length > 0 && (
          <div className="flex flex-wrap gap-x-4">
            {mainChecks.map(([k]) => (
              <span key={k}>{k}</span>
            ))}
          </div>
        )}
        {sonotaChecked && (
          <div className="flex gap-x-2">
            <span>その他</span>
            {row.otherText && <span>（{row.otherText}）</span>}
          </div>
        )}
      </div>
    );
  }

  const defaultMain = entries.filter(([k, v]) => v && k !== "その他");
  const defaultSonota = row.checks["その他"] === true;

  return (
    <div className="flex flex-col gap-1">
      {defaultMain.length > 0 && (
        <div className="flex flex-wrap gap-x-4">
          {defaultMain.map(([k]) => (
            <span key={k}>{k}</span>
          ))}
        </div>
      )}
      {defaultSonota && (
        <div className="flex gap-x-2">
          <span>その他</span>
          {row.otherText && <span>（{row.otherText}）</span>}
        </div>
      )}
      {row.amount && (
        <div className="flex flex-wrap gap-x-4">
          <span>
            {row.amount}
            {row.unit ?? ""}
          </span>
        </div>
      )}
    </div>
  );
}

export default function TemporaryConfirmSummary({ rows }: Props) {
  const visibleRows = rows.filter(
    (r) =>
      r.variant !== "betsuto" &&
      (r.need === "必要" || r.need === "許可未取得" || r.need === "対象あり")
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
      <div className="grid grid-cols-12 bg-[#17375E] font-semibold text-white">
        <div className="col-span-12 border-b border-[#17375E] bg-[#17375E] px-4 py-3 text-base font-bold text-white">
          ◆仮設確認
        </div>
      </div>

      {visibleRows.map((row, index) => {
        const prevCategory = index > 0 ? visibleRows[index - 1].category : undefined;
        const showCategory = index === 0 || row.category !== prevCategory;

        return (
          <div key={row.id} className="grid grid-cols-12 border-b border-slate-300">
            <div className="col-span-1 border-r border-slate-300 px-2 py-2 text-sm font-semibold text-slate-800 flex items-center justify-center">
              {showCategory ? row.category ?? "" : ""}
            </div>
            <div className="col-span-3 border-r border-slate-300 px-3 py-2 text-sm text-slate-900">
              {row.item}
            </div>
            <div className="col-span-8 px-3 py-2 text-sm text-slate-900">
              {renderContent(row)}
            </div>
          </div>
        );
      })}

      {visibleRows.length === 0 && (
        <div className="px-4 py-3 text-sm text-slate-500">必要な項目はありません</div>
      )}
    </section>
  );
}
