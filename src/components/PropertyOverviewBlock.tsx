import React from "react";
import { Th, Td, Label, TextInput, TextArea } from "./PaperTable";
import { PropertyOverviewForm } from "../form/formTypes";

const R = ({
  name,
  value,
  label,
  checked,
  onChange,
}: {
  name: string;
  value: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: (v: string) => void;
}) => (
  <label className="inline-flex items-center gap-2 mr-6">
    <input
      type="radio"
      name={name}
      value={value}
      className="h-4 w-4"
      checked={checked}
      onChange={() => onChange(value)}
    />
    <span>{label}</span>
  </label>
);

export function PropertyOverviewBlock({
  value,
  onChange,
}: {
  value: PropertyOverviewForm;
  onChange: (next: PropertyOverviewForm) => void;
}) {
  const set = (patch: Partial<PropertyOverviewForm>) => onChange({ ...value, ...patch });

  return (
    <div className="border border-black">
      <div className="bg-gray-200 font-medium px-3 py-2 border-b text-lg border-black">
        【物件概要】
      </div>

      <div className="grid grid-cols-[180px_1fr]">
        <Th className="border-r border-black text-center text-base">フリガナ</Th>
        <Td>
          <TextInput value={value.furigana} onChange={(e) => set({ furigana: e.target.value })} />
        </Td>
      </div>

      <div className="grid grid-cols-[180px_1fr]">
        <Th className="border-r border-black text-center text-lg">お客様名</Th>
        <Td>
          <TextInput value={value.customerName} onChange={(e) => set({ customerName: e.target.value })} />
        </Td>
      </div>

      <div className="grid grid-cols-[180px_1fr]">
        <Th className="border-r border-black text-center text-lg flex items-center justify-center">
          建物情報
        </Th>

        <div className="border-l-0">
          <div className="grid grid-cols-[120px_1fr]">
            <Th className="border-r border-black bg-white">
              <Label>住所</Label>
            </Th>
            <Td>
              <TextInput
                value={value.building.address}
                onChange={(e) => set({ building: { ...value.building, address: e.target.value } })}
              />
            </Td>
          </div>

          <div className="grid grid-cols-[120px_1fr_120px_1fr]">
            <Th className="border-r border-black bg-white">
              <Label>物件コード</Label>
            </Th>
            <Td>
              <TextInput
                value={value.building.propertyCode}
                onChange={(e) =>
                  set({ building: { ...value.building, propertyCode: e.target.value } })
                }
              />
            </Td>

            <Th className="border-r border-black bg-white">
              <Label>建物名称</Label>
            </Th>
            <Td>
              <TextInput
                value={value.building.buildingName}
                onChange={(e) =>
                  set({ building: { ...value.building, buildingName: e.target.value } })
                }
              />
            </Td>
          </div>

          <div className="grid grid-cols-[120px_1fr_120px_1fr]">
            <Th className="border-r border-black bg-white">
              <Label>完成年月</Label>
            </Th>
            <Td>
              <TextInput
                value={value.building.completionYm}
                onChange={(e) =>
                  set({ building: { ...value.building, completionYm: e.target.value } })
                }
              />
            </Td>

            <Th className="border-r border-black bg-white">
              <Label>営業所名</Label>
            </Th>
            <Td>
              <TextInput
                value={value.building.branchName}
                onChange={(e) =>
                  set({ building: { ...value.building, branchName: e.target.value } })
                }
              />
            </Td>
          </div>

          <div className="grid grid-cols-[120px_1fr]">
            <Th className="border-r border-black bg-white">
              <Label>過去の改修履歴</Label>
            </Th>
            <Td>
              <TextArea
                value={value.building.renovationHistory}
                onChange={(e) =>
                  set({ building: { ...value.building, renovationHistory: e.target.value } })
                }
              />
            </Td>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[180px_1fr]">
        <Th className="border-r border-black text-center text-lg flex items-center justify-center">
          改修工事内容
        </Th>
        <Td>
          <TextArea
            value={value.renovationContent}
            onChange={(e) => set({ renovationContent: e.target.value })}
          />
        </Td>
      </div>

      <div className="grid grid-cols-[180px_1fr]">
        <Th className="border-r border-black text-center text-lg flex items-center justify-center">
          要望<br />注意点等
        </Th>
        <div>
          <div className="grid grid-cols-[180px_1fr]">
            <Th className="border-r border-black bg-gray-100 text-center">オーナー様</Th>
            <Td className="space-y-2">
              <R
                name="owner"
                value="0"
                label="なし"
                checked={value.requests.owner.has === "0"}
                onChange={(v) =>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  set({ requests: { ...value.requests, owner: { ...value.requests.owner, has: v as any } } })
                }
              />
              <R
                name="owner"
                value="1"
                label="あり："
                checked={value.requests.owner.has === "1"}
                onChange={(v) =>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  set({ requests: { ...value.requests, owner: { ...value.requests.owner, has: v as any } } })
                }
              />
              <TextInput
                value={value.requests.owner.note}
                onChange={(e) =>
                  set({ requests: { ...value.requests, owner: { ...value.requests.owner, note: e.target.value } } })
                }
              />
            </Td>
          </div>

          <div className="grid grid-cols-[180px_1fr]">
            <Th className="border-r border-black bg-gray-100 text-center">入居者様</Th>
            <Td className="space-y-2">
              <R
                name="resident"
                value="0"
                label="なし"
                checked={value.requests.resident.has === "0"}
                onChange={(v) =>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  set({ requests: { ...value.requests, resident: { ...value.requests.resident, has: v as any } } })
                }
              />
              <R
                name="resident"
                value="1"
                label="あり："
                checked={value.requests.resident.has === "1"}
                onChange={(v) =>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  set({ requests: { ...value.requests, resident: { ...value.requests.resident, has: v as any } } })
                }
              />
              <TextInput
                value={value.requests.resident.note}
                onChange={(e) =>
                  set({ requests: { ...value.requests, resident: { ...value.requests.resident, note: e.target.value } } })
                }
              />
            </Td>
          </div>

          <div className="grid grid-cols-[180px_1fr]">
            <Th className="border-r border-black bg-gray-100 text-center">近隣様</Th>
            <Td className="space-y-2">
              <R
                name="neighbors"
                value="0"
                label="なし"
                checked={value.requests.neighbors.has === "0"}
                onChange={(v) =>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  set({ requests: { ...value.requests, neighbors: { ...value.requests.neighbors, has: v as any } } })
                }
              />
              <R
                name="neighbors"
                value="1"
                label="あり："
                checked={value.requests.neighbors.has === "1"}
                onChange={(v) =>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  set({ requests: { ...value.requests, neighbors: { ...value.requests.neighbors, has: v as any } } })
                }
              />
              <TextInput
                value={value.requests.neighbors.note}
                onChange={(e) =>
                  set({ requests: { ...value.requests, neighbors: { ...value.requests.neighbors, note: e.target.value } } })
                }
              />
            </Td>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[180px_1fr]">
        <Th className="border-r border-black text-center text-lg flex items-center justify-center">
          業者情報
        </Th>
        <Td className="space-y-3">
          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <Label>予定業者名</Label>
            <TextInput
              value={value.vendor.plannedVendorName}
              onChange={(e) => set({ vendor: { ...value.vendor, plannedVendorName: e.target.value } })}
            />
          </div>

          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <Label>確定業者名</Label>

            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm">
                <span className="w-36">
                  <R
                    name="confirmedVendorName"
                    value="0"
                    label="変更なし"
                    checked={value.vendor.confirmed.mode === "0"}
                    onChange={(v) =>
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      set({ vendor: { ...value.vendor, confirmed: { ...value.vendor.confirmed, mode: v as any } } })
                    }
                  />
                </span>

                <R
                  name="confirmedVendorName"
                  value="1"
                  label=""
                  checked={value.vendor.confirmed.mode === "1"}
                  onChange={(v) =>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    set({ vendor: { ...value.vendor, confirmed: { ...value.vendor.confirmed, mode: v as any } } })
                  }
                />

                <TextInput
                  value={value.vendor.confirmed.name}
                  onChange={(e) =>
                    set({ vendor: { ...value.vendor, confirmed: { ...value.vendor.confirmed, name: e.target.value } } })
                  }
                />
              </div>
            </div>
          </div>
        </Td>
      </div>

      <div className="grid grid-cols-[180px_1fr]">
        <Th className="border-r border-black text-center text-lg">営繕提案予定日</Th>
        <Td>
          <div className="grid grid-cols-[1fr_120px_1fr_120px_1fr] gap-0">
            <div className="flex items-center gap-2">
              <TextInput
                className="w-14"
                value={value.schedule.proposal.y}
                onChange={(e) => set({ schedule: { ...value.schedule, proposal: { ...value.schedule.proposal, y: e.target.value } } })}
              />
              <Label>年</Label>
              <TextInput
                className="w-10"
                value={value.schedule.proposal.m}
                onChange={(e) => set({ schedule: { ...value.schedule, proposal: { ...value.schedule.proposal, m: e.target.value } } })}
              />
              <Label>月</Label>
              <TextInput
                className="w-10"
                value={value.schedule.proposal.d}
                onChange={(e) => set({ schedule: { ...value.schedule, proposal: { ...value.schedule.proposal, d: e.target.value } } })}
              />
              <Label>日</Label>
            </div>

            <Th className="text-center bg-gray-200">契約予定日</Th>

            <div className="flex items-center gap-2 pl-4">
              <TextInput
                className="w-14"
                value={value.schedule.contract.y}
                onChange={(e) => set({ schedule: { ...value.schedule, contract: { ...value.schedule.contract, y: e.target.value } } })}
              />
              <Label>年</Label>
              <TextInput
                className="w-10"
                value={value.schedule.contract.m}
                onChange={(e) => set({ schedule: { ...value.schedule, contract: { ...value.schedule.contract, m: e.target.value } } })}
              />
              <Label>月</Label>
              <TextInput
                className="w-10"
                value={value.schedule.contract.d}
                onChange={(e) => set({ schedule: { ...value.schedule, contract: { ...value.schedule.contract, d: e.target.value } } })}
              />
              <Label>日</Label>
            </div>

            <Th className="text-center bg-gray-200">着工予定日</Th>

            <div className="flex items-center gap-2 pl-4">
              <TextInput
                className="w-14"
                value={value.schedule.start.y}
                onChange={(e) => set({ schedule: { ...value.schedule, start: { ...value.schedule.start, y: e.target.value } } })}
              />
              <Label>年</Label>
              <TextInput
                className="w-10"
                value={value.schedule.start.m}
                onChange={(e) => set({ schedule: { ...value.schedule, start: { ...value.schedule.start, m: e.target.value } } })}
              />
              <Label>月</Label>
              <TextInput
                className="w-10"
                value={value.schedule.start.d}
                onChange={(e) => set({ schedule: { ...value.schedule, start: { ...value.schedule.start, d: e.target.value } } })}
              />
              <Label>日</Label>
            </div>
          </div>
        </Td>
      </div>
    </div>
  );
}
