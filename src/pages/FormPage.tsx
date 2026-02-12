import { useState } from "react";
import { toast } from "react-toastify";

import { PropertyOverviewBlock } from "../components/PropertyOverviewBlock";
import { KasetsuKakuninTable } from "../components/KasetsuKakuninTable";
import { TodokedeChosaKakuninTable } from "../components/TodokedeChosaKakuninTable";
import { TenpuShiryoTable } from "../components/TenpuShiryoTable";
// import { useAuth } from "../auth/AuthContext";

import "react-toastify/dist/ReactToastify.css";

import { FullForm, initialForm } from "../form/formTypes";
// import { buildMultipartFormData } from "../form/payload_multipart";
// import { postMultipart } from "../form/api";

function FormPage() {
  const [form, setForm] = useState<FullForm>(initialForm);
    // const { logout } = useAuth();

  // const json = useMemo(() => toJson(form), [form]);

  const handleRegister = async () => {
  try {
    // const fd = buildMultipartFormData(form);
    // const saved = await postMultipart("http://localhost:8080/api/forms", fd);
    // console.log("saved", saved);

    toast.success("登録が完了しました 🎉", { position: "top-center", autoClose: 2000 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    toast.error(e?.message ?? "登録に失敗しました", { position: "top-center" });
  }
};

  // const handleRegister = async () => {
  //   try {
  //     console.log("json ", json);
  //     console.log(JSON.stringify(json, null, 2));

  //     // Build multipart
  //     const fd = buildMultipartFormData(form);

  //     // (Optional) Debug what keys are inside FormData
  //     // NOTE: You cannot directly print file contents, but you can log keys.
  //     for (const [k, v] of fd.entries()) {
  //       console.log("FormData:", k, v instanceof File ? `File(${v.name})` : v);
  //     }

  //     console.log('fd ', fd);

  //     // Send
  //     // const resp = await postMultipart("/api/register", fd, {
  //     //   // headers: { Authorization: `Bearer ${token}` },
  //     //   // credentials: "include",
  //     // });

  //     // console.log("API response:", resp);

  //     // toast.success("登録が完了しました 🎉", {
  //     //   position: "top-center",
  //     //   autoClose: 2000,
  //     // });
  //   } catch (e) {
  //     console.error(e);
  //     toast.error(
  //       e instanceof Error ? e.message : "送信に失敗しました",
  //       { position: "top-center", autoClose: 4000 }
  //     );
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-100 py-10 form-text">
      <div className="mx-auto max-w-7xl bg-white p-6 shadow border">
        <p className="text-3xl font-semibold text-center mb-14">
          営繕工事 事前確認依頼書 兼 見積確認依頼書
        </p>

        <div className="mb-14">
          <div className="text-sm mb-2">
            下記営繕工事について、工事内容・仮設工事の検証を依頼致します。
          </div>

          <PropertyOverviewBlock
            value={form.property}
            onChange={(next) => setForm((p) => ({ ...p, property: next }))}
          />
        </div>

        <div className="mb-14">
          <KasetsuKakuninTable
            value={form.kasetsu}
            onChange={(next) => setForm((p) => ({ ...p, kasetsu: next }))}
          />
        </div>

        <div className="mb-14">
          <TodokedeChosaKakuninTable
            value={form.todokede}
            onChange={(next) => setForm((p) => ({ ...p, todokede: next }))}
          />
        </div>

        <div className="bg-white">
          <TenpuShiryoTable
            value={form.tenpu}
            onChange={(next) => setForm((p) => ({ ...p, tenpu: next }))}
          />
        </div>

        <div className="flex items-center justify-center mt-20 mb-14">
          <button
            type="button"
            onClick={handleRegister}
            className="px-6 py-2 border border-black bg-blue-500 hover:bg-blue-600 text-white"
          >
            登録
          </button>

            {/* <button
                type="button"
                onClick={() => logout()}
                className="px-6 py-2 border border-black bg-blue-500 hover:bg-blue-600 text-white"
            >
                logout
            </button> */}
          
        </div>
      </div>
    </div>
  );
}

export default FormPage;
