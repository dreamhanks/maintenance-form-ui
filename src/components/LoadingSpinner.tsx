export default function LoadingSpinner() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          border: "3px solid #E6EEF5",
          borderTop: "3px solid #17375E",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <span style={{ fontSize: "13px", color: "#17375E" }}>読み込み中...</span>
    </div>
  );
}
