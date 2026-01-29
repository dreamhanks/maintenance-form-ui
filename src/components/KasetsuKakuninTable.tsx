import { TextArea } from "./PaperTable";

const thL = "border border-black bg-sky-100 text-sm px-2 py-2 text-left font-semibold";
const thR = "border border-black bg-gray-200 text-sm px-2 py-2 text-center font-semibold";
const td = "border border-black text-sm px-2 py-2 align-middle";
const tdTop = "border border-black text-sm px-2 py-2 align-top";
const center = "text-center align-middle";
const sepL = "border-l-2 border-black"; 
const sepT = "border-t-2 border-black"; 
const outer = "border-2 border-black";

const UnderlineInput = ({ w = "w-20" }: { w?: string }) => (
    <input
        className={`${w} border-b border-black outline-none bg-transparent`}
        type="text"
    />
);

export function KasetsuKakuninTable() {
  
    const R = ({
    name,
    value,
    label,
    }: {
    name: string;
    value: string;
    label: React.ReactNode;
    }) => (
    <label className="inline-flex items-center gap-2 mr-6">
        <input type="radio" name={name} value={value} className="h-4 w-4" />
        <span>{label}</span>
    </label>
    );

    return (
    <div className="overflow-x-auto form-text">
        <p className="text-base mb-2">
            以下、工事・メンテナンスセンターにて記入（該当項目にチェックし、詳細記入願います）
        </p>

        <table className={`border-collapse w-full min-w-[1100px] ${outer}`}>
        <thead>
            <tr>
            <th className={`${thL} text-lg`} colSpan={4}>
                ◆仮設確認
            </th>
            <th className={`${thR} ${sepL} text-lg`}>大元回答</th>
            </tr>
        </thead>

        <tbody>
            {/* ===================== 仮設 ===================== */}
            <tr>
            <td className={`${td} ${center} ${sepT} `} rowSpan={7}>
                <input type="checkbox" name="section_select" className="h-4 w-4" />
            </td>
            <td className={`${td} ${center} ${sepT} text-base`} rowSpan={7}>
                仮設
            </td>
            <td className={`${tdTop} ${sepT}`}>第三者侵入防止</td>
            <td className={`${tdTop} ${sepT}`}>
                <div>
                <R name="kasetsu_intrusion_need" value="0" label="不要" />
                </div>
                <div className="mt-1">
                <R
                  name="kasetsu_intrusion_need"
                  value="1"
                  label={
                    <span>
                      <span className="mr-5">必要</span>    ( <UnderlineInput w="w-36" /> )
                    </span>
                  }
                />
                <span>→</span>
                </div>
            </td>
            <td className={`${tdTop} ${sepT} ${sepL} form-text`}>
                <R name="kasetsu_intrusion_ans" value="1" label="仮囲い" />
                <R name="kasetsu_intrusion_ans" value="2" label="カラーコーン" />
                <R
                  name="kasetsu_intrusion_ans"
                  value="3"
                  label={
                    <span>
                      <span className="mr-5">その他</span>    ( <UnderlineInput w="w-36" /> )
                    </span>
                  }
                />
            </td>
            </tr>

            <tr>
            <td className={tdTop}>仮設電気</td>
            <td className={tdTop}>
                <div>
                    <R name="kasetsu_denki_need" value="0" label="不要" />
                </div>
                <div className="mt-1">
                <R
                  name="kasetsu_denki_need"
                  value="1"
                  label={
                    <span>
                      <span className="mr-5">必要</span>    ( <UnderlineInput w="w-36" /> )
                    </span>
                  }
                />
                <span>→</span>
                </div>
            </td>
            <td className={`${tdTop} ${sepL} form-text`}>
                <R name="kasetsu_denki_ans" value="1" label="既存無償利用可" />
                <R
                  name="kasetsu_denki_ans"
                  value="2"
                  label={
                    <span>
                      <span className="mr-5">その他</span>    ( <UnderlineInput w="w-36" /> )
                    </span>
                  }
                />
            </td>
            </tr>

            <tr>
            <td className={tdTop}>仮設水道</td>
            <td className={tdTop}>
                <div>
                <R name="kasetsu_suido_need" value="0" label="不要" />
                </div>
                <div className="mt-1">
                <R
                  name="kasetsu_suido_need"
                  value="1"
                  label={
                    <span>
                      <span className="mr-5">必要</span>    ( <UnderlineInput w="w-36" /> )
                    </span>
                  }
                />
                <span>→</span>
                </div>
            </td>
            <td className={`${tdTop} ${sepL} form-text`}>
                <R name="kasetsu_suido_ans" value="1" label="既存無償利用可" />
                <R
                  name="kasetsu_suido_ans"
                  value="2"
                  label={
                    <span>
                      <span className="mr-5">その他</span>    ( <UnderlineInput w="w-36" /> )
                    </span>
                  }
                />
            </td>
            </tr>

            <tr>
            <td className={tdTop}>仮設トイレ</td>
            <td className={tdTop}>
                <div>
                <R name="kasetsu_toilet_need" value="0" label="不要" />
                </div>
                <div className="mt-1">
                <R
                  name="kasetsu_toilet_need"
                  value="1"
                  label={
                    <span>
                      <span className="mr-5">必要</span>    ( <UnderlineInput w="w-36" /> )
                    </span>
                  }
                />
                <span>→</span>
                </div>
            </td>
            <td className={`${tdTop} ${sepL} form-text`}>
                <R name="kasetsu_toilet_ans" value="1" label="既存無償利用可" />
                <R
                  name="kasetsu_toilet_ans"
                  value="2"
                  label={
                    <span>
                      <span className="mr-5">その他</span>    ( <UnderlineInput w="w-36" /> )
                    </span>
                  }
                />
            </td>
            </tr>

            <tr>
            <td className={tdTop}>電線防護管</td>
            <td className={tdTop}>
                <div>
                <R name="kasetsu_densen_need" value="0" label="不要" />
                </div>
                <div className="mt-1">
                <R
                  name="kasetsu_densen_need"
                  value="1"
                  label={
                    <span>
                      <span className="mr-5">必要</span>    ( <UnderlineInput w="w-36" /> )
                    </span>
                  }
                />
                <span>→</span>
                </div>
            </td>
            <td className={`${tdTop} ${sepL} form-text`}>
                <R name="kasetsu_densen_ans" value="1" label="予算計上" />
                <R
                  name="kasetsu_densen_ans"
                  value="2"
                  label={
                    <span>
                      <span className="mr-5">その他</span>    ( <UnderlineInput w="w-36" /> )
                    </span>
                  }
                />
            </td>
            </tr>

            <tr>
            <td className={tdTop}>工事駐車場</td>
            <td className={tdTop}>
                <div>
                <R name="kasetsu_parking_need" value="0" label="不要" />
                </div>
                <div className="mt-1">
                <R
                  name="kasetsu_parking_need"
                  value="1"
                  label={
                    <span>
                      <span className="mr-5">必要</span>    ( <UnderlineInput w="w-32" /> 台)
                    </span>
                  }
                />
                <span>→</span>
                </div>
            </td>
            <td className={`${tdTop} ${sepL} form-text`}>
                <R name="kasetsu_parking_ans" value="1" label="場内確保" />
                <R name="kasetsu_parking_ans" value="2" label="場内なし・予算対応" />
                <R
                  name="kasetsu_parking_ans"
                  value="2"
                  label={
                    <span>
                      <span className="mr-5">その他</span>    ( <UnderlineInput w="w-32" /> )
                    </span>
                  }
                />
            </td>
            </tr>

            <tr>
            <td className={`${td}`} colSpan={3}>
                （別途指示事項）<TextArea  className="min-h-12"/>
            </td>
            </tr>

            {/* ===================== 足場 ===================== */}
            <tr>
            <td className={`${td} ${center} ${sepT}`} rowSpan={6}>
                <input type="checkbox" name="ashiba" className="h-4 w-4" />
            </td>
            <td className={`${td} ${center} ${sepT}`} rowSpan={6}>
                足場
            </td>
            <td className={`${tdTop} ${sepT}`}>足場設置</td>
            <td className={`${tdTop} ${sepT}`}>
                <div>
                <R name="ashiba_setchi_need" value="1" label="全周" />
                </div>
                <div className="mt-1">
                <R name="ashiba_setchi_need" value="2" label="一部設置（図示）" />
                <span>→</span>
                </div>
            </td>
            <td className={`${tdTop} ${sepT} ${sepL}`}>
                <R name="ashiba_setchi_ans" value="1" label="全周" />
                <R value="2"
                name="ashiba_setchi_ans"
                label="一部設置（技術部門指示の通り）"
                />
                <R
                  name="ashiba_setchi_ans"
                  value="3"
                  label={
                    <span>
                      <span className="mr-5">その他</span>    ( <UnderlineInput w="w-28" /> )
                    </span>
                  }
                />
            </td>
            </tr>

            <tr>
            <td className={tdTop}>足場届出（機械設置届）</td>
            <td className={tdTop}>
                <div>
                <R name="ashiba_todokede_need" value="0" label="不要" />
                </div>
                <div className="mt-1">
                <R
                  name="ashiba_todokede_need"
                  value="1"
                  label={
                    <span>
                      <span className="mr-5">必要</span>    ( <UnderlineInput w="w-32" />)
                    </span>
                  }
                />
                <span>→</span>
                </div>
            </td>
            <td className={`${tdTop} ${sepL}`}>
                <R name="ashiba_todokede_ans" value="1" label="予算計上" />
                <R
                  name="ashiba_todokede_ans"
                  value="2"
                  label={
                    <span>
                      <span className="mr-5">その他</span>    ( <UnderlineInput w="w-36" /> )
                    </span>
                  }
                />
            </td>
            </tr>

            <tr>
            <td className={tdTop}>隣地足場越境時の承諾</td>
            <td className={tdTop}>
                <div>
                <R name="ashiba_kyoukai_need" value="0" label="不要" />
                </div>
                <div className="mt-1">
                <R
                  name="ashiba_kyoukai_need"
                  value="1"
                  label={
                    <span>
                      <span className="mr-5">必要</span>    ( <UnderlineInput w="w-32" />)
                    </span>
                  }
                />
                <span>→</span>
                </div>
            </td>
            <td className={`${tdTop} ${sepL}`}>
                <R name="ashiba_kyoukai_ans" value="1" label="承諾取得済" />
                <R
                  name="ashiba_kyoukai_ans"
                  value="2"
                  label={
                    <span>
                      <span className="mr-5">その他</span>    ( <UnderlineInput w="w-36" /> )
                    </span>
                  }
                />
            </td>
            </tr>

            <tr>
            <td className={`${tdTop} form-text`}>巾木、中桟、手すり等</td>
            <td className={tdTop}>
                <div className="form-text">
                <R name="ashiba_te_suri_need" value="1" label="巾木" />
                <R name="ashiba_te_suri_need" value="2" label="中桟" />
                </div>
                <div className="mt-1">
                <R name="ashiba_te_suri_need" value="3" label="手摺" />
                {/* <R name="ashiba_te_suri_need" label="(  )" /> */}
                <R
                  name="ashiba_te_suri_need"
                  value="4"
                  label={
                    <span>
                        (<UnderlineInput w="w-28" />)
                    </span>
                  }
                />
                </div>
            </td>
            <td className={`${tdTop} ${sepL} form-text`}>
                <R name="ashiba_te_suri_ans" value="1" label="巾木" />
                <R name="ashiba_te_suri_ans" value="2" label="中桟" />
                <R name="ashiba_te_suri_ans" value="3" label="手摺" />
                <R
                  name="ashiba_te_suri_ans"
                  value="4"
                  label={
                    <span>
                      <span className="mr-5">その他</span>    ( <UnderlineInput w="w-36" /> )
                    </span>
                  }
                />
            </td>
            </tr>

            <tr>
            <td className={tdTop}>飛散防止措置</td>
            <td className={tdTop}>
                <div>
                <R name="ashiba_hisan_need" value="0" label="不要" />
                </div>
                <div className="mt-1">
                <R
                  name="ashiba_hisan_need"
                  value="1"
                  label={
                    <span>
                      <span className="mr-5">必要</span>    ( <UnderlineInput w="w-32" />)
                    </span>
                  }
                />
                <span>→</span>
                </div>
            </td>
            <td className={`${tdTop} ${sepL}`}>
                <R name="ashiba_hisan_ans" value="1" label="朝顔" />
                <R
                  name="ashiba_hisan_ans"
                  value="2"
                  label={
                    <span>
                      <span className="mr-5">その他</span>    ( <UnderlineInput w="w-36" /> )
                    </span>
                  }
                />
            </td>
            </tr>

            <tr>
            <td className={`${td}`} colSpan={3}>
                （別途指示事項）<TextArea  className="min-h-12"/>
            </td>
            </tr>

            {/* ===================== 防犯 ===================== */}
            <tr>
            <td className={`${td} ${center} ${sepT}`}>
                <input type="checkbox" name="bouhan" className="h-4 w-4" />
            </td>
            <td className={`${td} ${center} ${sepT}`}>防犯</td>
            <td className={`${tdTop} ${sepT}`}>夜間照明・防犯カメラ</td>
            <td className={`${tdTop} ${sepT}`}>
                <R name="bouhan_need" value="1" label="夜間灯" />
                <R name="bouhan_need" value="2" label="防犯カメラ" />
            </td>
            <td className={`${tdTop} ${sepT} ${sepL}`}>
                <R name="bouhan_ans" value="1" label="夜間灯" />
                <R name="bouhan_ans" value="2" label="防犯カメラ" />
                <R
                  name="bouhan_ans"
                  value="3"
                  label={
                    <span>
                      <span className="mr-5">その他</span>    ( <UnderlineInput w="w-36" /> )
                    </span>
                  }
                />
            </td>
            </tr>

            {/* ===================== 予算 ===================== */}
            <tr>
            <td className={`${td} ${center} ${sepT}`} rowSpan={2}>
                <input type="checkbox" name="yosan" className="h-4 w-4" />
            </td>
            <td className={`${td} ${center} ${sepT}`} rowSpan={2}>
                予算
            </td>
            <td className={`${tdTop} ${sepT}`}>産廃費用</td>
            <td className={`${tdTop} ${sepT}`}>
                <R name="yosan_sanpai_need" value="1" label="必要" />
            </td>
            <td className={`${tdTop} ${sepT} ${sepL}`}>
                <R name="yosan_sanpai_ans" value="1" label="予算計上" />
                <R
                  name="yosan_sanpai_ans"
                  value="2"
                  label={
                    <span>
                      <span className="mr-5">その他</span>    ( <UnderlineInput w="w-36" /> )
                    </span>
                  }
                />
            </td>
            </tr>

            <tr>
            <td className={tdTop}>荷揚げ費用</td>
            <td className={tdTop}>
                <div>
                <R name="yosan_niaage_need" value="0" label="不要" />
                </div>
                <div className="mt-1">
                <R
                  name="yosan_niaage_need"
                  value="1"
                  label={
                    <span>
                      <span className="mr-5">必要</span>    ( <UnderlineInput w="w-32" />)
                    </span>
                  }
                />
                <span>→</span>
                </div>
            </td>
            <td className={`${tdTop} ${sepL}`}>
                <R name="yosan_niaage_ans" value="1" label="予算計上" />
                <R
                  name="yosan_niaage_ans"
                  value="2"
                  label={
                    <span>
                      <span className="mr-5">その他</span>    ( <UnderlineInput w="w-36" /> )
                    </span>
                  }
                />
            </td>
            </tr>

            {/* ===================== 現場指示事項 ===================== */}
            <tr>
            <td
                className={`${td} bg-sky-100 font-semibold ${sepT}`}
                colSpan={2}
            >
                【現場指示事項】
            </td>
            <td className={`${td} ${sepT}`} colSpan={3}>
                <TextArea />
            </td>
            </tr>
        </tbody>
        </table>
    </div>
    );
}
