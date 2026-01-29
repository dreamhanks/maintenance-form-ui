import { ToastContainer, toast } from "react-toastify";

import { PropertyOverviewBlock } from "./components/PropertyOverviewBlock";
import { KasetsuKakuninTable } from "./components/KasetsuKakuninTable";
import { TodokedeChosaKakuninTable } from "./components/TodokedeChosaKakuninTable";
import { TenpuShiryoSection } from "./components/TenpuShiryoSection";

import "react-toastify/dist/ReactToastify.css";

function App() {

  const handleRegister = () => {
    // show notification
    toast.success("登録が完了しました 🎉", {
      position: "top-center",
      autoClose: 2000,
    });

    // reload page after notification
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-7xl bg-white p-6 shadow border">
        <p className="text-3xl font-semibold text-center mb-14">
          営繕工事 事前確認依頼書 兼 見積確認依頼書
        </p>

        <div className="mb-14">
          <div className="text-base mb-2">
            下記営繕工事について、工事内容・仮設工事の検証を依頼致します。
          </div>
          <PropertyOverviewBlock />
        </div>

        <div className="mb-14">
          <KasetsuKakuninTable />
        </div>
        
        <div className="mb-14">
          <TodokedeChosaKakuninTable />
        </div>

        <div className=" bg-white">
          <TenpuShiryoSection />
        </div>

        <div className="flex items-center justify-center mt-20 mb-14">
          <button
            type="button"
            onClick={handleRegister}
            className="px-6 py-2 border border-black bg-blue-500 hover:bg-blue-600 text-white"
          >
            登録
          </button>
        </div>
        
      </div>
      {/* Notification container */}
      <ToastContainer />
    </div>
  );
}

export default App;
