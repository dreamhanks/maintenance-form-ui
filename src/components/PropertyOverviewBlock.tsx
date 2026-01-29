import { Th, Td, Label, TextInput, TextArea } from "./PaperTable";

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


export function PropertyOverviewBlock() {
  return (
    <div className="border border-black">
      {/* Section header */}
      <div className="bg-gray-200 font-bold px-3 py-2 border-b text-lg border-black">
        【物件概要】
      </div>

      {/* Row: フリガナ */}
      <div className="grid grid-cols-[180px_1fr]">
        <Th className="border-r border-black text-center text-lg">フリガナ</Th>
        <Td>
          <TextInput placeholder="" />
        </Td>
      </div>

      {/* Row: お客様名 */}
      <div className="grid grid-cols-[180px_1fr]">
        <Th className="border-r border-black text-center text-lg">お客様名</Th>
        <Td>
          <TextInput />
        </Td>
      </div>

      {/* 建物情報 block (merged left cell like rowspan) */}
      <div className="grid grid-cols-[180px_1fr]">
        <Th className="border-r border-black text-center text-lg flex items-center justify-center">
          建物情報
        </Th>

        {/* Right side contains multiple inner rows */}
        <div className="border-l-0">
          {/* 住所 */}
          <div className="grid grid-cols-[120px_1fr]">
            <Th className="border-r border-black bg-white font-semibold">
              <Label>住所</Label>
            </Th>
            <Td>
              <TextInput />
            </Td>
          </div>

          {/* 物件コード + 建物名称 (split like your image) */}
          <div className="grid grid-cols-[120px_1fr_120px_1fr]">
            <Th className="border-r border-black bg-white font-semibold">
              <Label>物件コード</Label>
            </Th>
            <Td>
              <TextInput />
            </Td>
            <Th className="border-r border-black bg-white font-semibold">
              <Label>建物名称</Label>
            </Th>
            <Td>
              <TextInput />
            </Td>
          </div>

          {/* 完成年月 */}
          <div className="grid grid-cols-[120px_1fr]">
            <Th className="border-r border-black bg-white font-semibold">
              <Label>完成年月</Label>
            </Th>
            <Td>
              <TextInput placeholder="例: 2020/03" />
            </Td>
          </div>

          {/* 過去の改修履歴 */}
          <div className="grid grid-cols-[120px_1fr]">
            <Th className="border-r border-black bg-white font-semibold">
              <Label>過去の改修履歴</Label>
            </Th>
            <Td>
              <TextArea />
            </Td>
          </div>
        </div>
      </div>

      {/* 改修工事内容 */}
      <div className="grid grid-cols-[180px_1fr]">
        <Th className="border-r border-black text-center text-lg flex items-center justify-center">
          改修工事内容
        </Th>
        <Td>
          <TextArea />
        </Td>
      </div>

      {/* 要望注意点等 block (merged left cell) */}
      <div className="grid grid-cols-[180px_1fr]">
        <Th className="border-r border-black text-center text-lg flex items-center justify-center">
          要望<br />注意点等
        </Th>
        <div>
          {/* オーナー様 */}
          <div className="grid grid-cols-[180px_1fr]">
            <Th className="border-r border-black bg-gray-100 text-center">オーナー様</Th>
            <Td className="space-y-2">
              <R name="owner" value="0" label="なし" />
              <R name="owner" value="1" label="あり：" />
              <TextInput />
            </Td>
          </div>

          {/* 入居者様 */}
          <div className="grid grid-cols-[180px_1fr]">
            <Th className="border-r border-black bg-gray-100 text-center">入居者様</Th>
            <Td className="space-y-2">
              <R name="resident" value="0" label="なし" />
              <R name="resident" value="1" label="あり：" />
              <TextInput />
            </Td>
          </div>

          {/* 近隣様 */}
          <div className="grid grid-cols-[180px_1fr]">
            <Th className="border-r border-black bg-gray-100 text-center">近隣様</Th>
            <Td className="space-y-2">
              <R name="neighbors" value="0" label="なし" />
              <R name="neighbors" value="1" label="あり：" />
              <TextInput />
            </Td>
          </div>
        </div>
      </div>

      {/* 業者情報 */}
      <div className="grid grid-cols-[180px_1fr]">
        <Th className="border-r border-black text-center text-lg flex items-center justify-center">
          業者情報
        </Th>
        <Td className="space-y-3">
          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <Label>予定業者名</Label>
            <TextInput />
          </div>

          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <Label>確定業者名</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm">
                  <span className="w-36"><R name="confirmedVendorName" value="0" label="変更なし" /></span>
                  <R name="confirmedVendorName" value="1" label="" />
                  <TextInput />
              </div> 
            </div>
          </div>
        </Td>
      </div>

      {/* Bottom schedule row with 年 月 日 (column names you asked for) */}
      <div className="grid grid-cols-[180px_1fr]">
        <Th className="border-r border-black text-center text-lg">営繕提案予定日</Th>
        <Td>
          <div className="grid grid-cols-[1fr_120px_1fr_120px_1fr] gap-0">
            {/* 年月日 columns */}
            <div className="flex items-center gap-2">
              <TextInput className="w-14"/><Label>年</Label>
              <TextInput className="w-10"/><Label>月</Label>
              <TextInput className="w-10"/><Label>日</Label>
            </div>

            <Th className="text-center bg-gray-200">契約予定日</Th>

            <div className="flex items-center gap-2 pl-4">
              <TextInput className="w-14"/><Label>年</Label>
              <TextInput className="w-10"/><Label>月</Label>
              <TextInput className="w-10"/><Label>日</Label>
            </div>

            <Th className="text-center bg-gray-200">着工予定日</Th>

            <div className="flex items-center gap-2 pl-4" >
              <TextInput className="w-14"/><Label>年</Label>
              <TextInput className="w-10"/><Label>月</Label>
              <TextInput className="w-10"/><Label>日</Label>
            </div>
          </div>
        </Td>
      </div>
    </div>
  );
}
