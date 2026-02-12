import React from "react";

type CellProps = {
  className?: string;
  children?: React.ReactNode;
};

export function Th({ className = "", children }: CellProps) {
  return (
    <div className={`bg-gray-200 font-medium text-sm px-3 py-2 border border-black ${className}`}>
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
  return <span className="text-xs font-medium">{children}</span>;
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
  leftChecked,
  rightChecked,
  onLeftChange,
  onRightChange,
}: {
  left: string;
  right?: string;
  leftChecked: boolean;
  rightChecked?: boolean;
  onLeftChange: (v: boolean) => void;
  onRightChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-6 text-sm">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={leftChecked}
          onChange={(e) => onLeftChange(e.target.checked)}
        />
        {left}
      </label>

      {right ? (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={!!rightChecked}
            onChange={(e) => onRightChange?.(e.target.checked)}
          />
          {right}
        </label>
      ) : null}
    </div>
  );
}
