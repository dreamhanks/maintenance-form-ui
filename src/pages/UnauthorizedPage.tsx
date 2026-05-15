export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 max-w-md w-full text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          アクセス権限がありません
        </h1>
        <p className="text-sm text-slate-500">
          このシステムへのアクセス権限がありません。<br />
          システム管理者にお問い合わせください。
        </p>
      </div>
    </div>
  );
}