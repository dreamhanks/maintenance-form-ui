import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authApi } from "../form/api";
import { useAuth } from "../auth/AuthContext";

export default function ChangePasswordPage() {
  const nav = useNavigate();
  const { user, setMustChangePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== newPassword2) {
      toast.error("新しいパスワードが一致しません", { position: "top-center" });
      return;
    }
    if (newPassword.length < 8) {
      toast.error("新しいパスワードは8文字以上にしてください", { position: "top-center" });
      return;
    }
    if (user && newPassword === user.employeeCode) {
      toast.error("新しいパスワードは社員CDと同じにできません", { position: "top-center" });
      return;
    }

    setBusy(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      setMustChangePassword(false);
      toast.success("パスワードを変更しました", { position: "top-center", autoClose: 1500 });
      nav("/", { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.message ?? "パスワード変更に失敗しました", { position: "top-center" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border shadow p-6">
        <h1 className="text-2xl font-semibold text-center mb-2">パスワード変更</h1>
        <div className="text-sm text-gray-700 mb-6">
          初回ログインのため、パスワード変更が必要です。
          <br />
          初回PW：ユーザーID（社員CD）
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">現在のパスワード</label>
            <input
              type="password"
              className="w-full border px-3 py-2"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="初回は社員CD"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm mb-1">新しいパスワード（8文字以上）</label>
            <input
              type="password"
              className="w-full border px-3 py-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="任意"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">新しいパスワード（確認）</label>
            <input
              type="password"
              className="w-full border px-3 py-2"
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
              placeholder="もう一度入力"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full px-6 py-2 border border-black bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-60"
          >
            {busy ? "変更中..." : "変更する"}
          </button>
        </form>
      </div>
    </div>
  );
}
