import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [employeeCode, setEmployeeCode] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setBusy(true);
  try {
    const resp = await login(employeeCode.trim(), password);
    toast.success("ログインしました", { position: "top-center", autoClose: 1200 });

    if (resp.mustChangePassword) {
      nav("/change-password", { replace: true });
    } else {
      nav("/", { replace: true });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.error(err?.message ?? "ログインに失敗しました", { position: "top-center" });
  } finally {
    setBusy(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border shadow p-6">
        <h1 className="text-2xl font-semibold text-center mb-6">ログイン</h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">ユーザーID (社員CD)</label>
            <input
              className="w-full border px-3 py-2"
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
              placeholder="例:0001"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm mb-1">パスワード</label>
            <input
              type="password"
              className="w-full border px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="初回PW:ユーザーID(社員CD)"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full px-6 py-2 border border-black bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-60"
          >
            {busy ? "ログイン中..." : "ログイン"}
          </button>

          <div className="text-xs text-gray-600">
            初回パスワードは「ユーザーID (社員CD)」です。ログイン後に任意のPWに変更する場合は、PW変更APIを追加します。
          </div>
        </form>
      </div>
    </div>
  );
}
