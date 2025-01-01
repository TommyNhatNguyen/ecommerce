"use client";
import { Button, TabsProps, Upload, UploadFile } from "antd";
import { ADMIN_ROUTES } from "@/app/constants/routes";
import { Package, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs } from "antd";
import React, { useState } from "react";
import { LucideBoxes } from "lucide-react";
import { useRouter } from "next/navigation";
import InputAdmin from "@/app/shared/components/InputAdmin";
import axios from "axios";

type InventoryProductLayoutPropsType = {
  children: React.ReactNode;
};

const InventoryProductLayout = ({
  children,
}: InventoryProductLayoutPropsType) => {
  const [activeTab, setActiveTab] = useState<string>(ADMIN_ROUTES.inventory);
  const router = useRouter();
  const _onChangeTab = (key: string) => {
    setActiveTab(key);
    router.push(key);
  };
  const tabs: TabsProps["items"] = [
    {
      label: "Inventory",
      key: ADMIN_ROUTES.inventory,
      icon: <Package className="h-4 w-4" />,
    },
    {
      label: "Products",
      key: ADMIN_ROUTES.products,
      icon: <LucideBoxes className="h-4 w-4" />,
    },
  ];
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const _onChangeFileList = (file: UploadFile) => {
    setFileList([...fileList, file]);
  };
  const _onRemoveFileList = (file: UploadFile) => {
    setFileList(fileList.filter((item) => item.uid !== file.uid));
  };
  const _onSubmitFileList = async () => {
    console.log(fileList[0]);
    try {
      const response = await axios.post(
        "http://localhost:3000/v1/image",
        {
          file: fileList[0],
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="mb-4 rounded-lg bg-white px-4 py-2">
        <InputAdmin
          label="Product Image"
          required={true}
          placeholder="Product Image"
          customComponent={() => (
            <Upload
              listType="picture-card"
              accept=".jpg,.jpeg,.png,.gif,.webp"
              beforeUpload={(file) => {
                _onChangeFileList(file);
                return false;
              }}
              onRemove={(file) => {
                _onRemoveFileList(file);
              }}
              // fileList={fileList}
              // onChange={onChange}
              // onPreview={onPreview}
            >
              <PlusIcon className="h-4 w-4" />
            </Upload>
          )}
        />
        <Button type="primary" onClick={_onSubmitFileList}>
          Submit
        </Button>
        <h2 className={cn("text-lg font-semibold")}>Tab Navigation</h2>
        <Tabs items={tabs} onChange={_onChangeTab} activeKey={activeTab} />
      </div>
      {children}
    </>
  );
};

export default InventoryProductLayout;
