type CellProps = {
  className?: string;
  children?: React.ReactNode;
};

export function Th({ className = "", children }: CellProps) {
  return (
    <div className={`bg-gray-200 font-bold text-sm px-3 py-2 border border-black ${className}`}>
      {children}
    </div>
  );
}

export function Td({ className = "", children }: CellProps) {
  return (
    <div className={`px-3 py-2 border border-black ${className}`}>
      {children}
    </div>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-semibold">{children}</span>;
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full h-8 border border-gray-300 px-2 text-sm ${props.className ?? ""}`}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full min-h-[80px] border border-gray-300 px-2 py-1 text-sm ${props.className ?? ""}`}
    />
  );
}

export function CheckboxLine({
  left,
  right,
}: {
  left: string;
  right?: string;
}) {
  return (
    <div className="flex items-center gap-6 text-sm">
      <label className="flex items-center gap-2">
        <input type="checkbox" className="h-4 w-4" />
        {left}
      </label>
      {right ? (
        <label className="flex items-center gap-2">
          <input type="checkbox" className="h-4 w-4" />
          {right}
        </label>
      ) : null}
    </div>
  );
}
