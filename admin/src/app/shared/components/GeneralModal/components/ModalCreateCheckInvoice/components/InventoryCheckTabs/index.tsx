import { Tabs, TabsProps } from "antd";
import React from "react";
import { useIntl } from "react-intl";

type Props = {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  allNum: number;
  uncheckNum: number;
  checkNum: number;
};

const InventoryCheckTabs = ({
  selectedTab,
  setSelectedTab,
  allNum,
  uncheckNum,
  checkNum,
}: Props) => {
  const intl = useIntl();
  const tabs: TabsProps["items"] = [
    {
      key: "all_num",
      label: intl.formatMessage({ id: "all_num" }, { num: allNum }),
    },
    {
      key: "uncheck_num",
      label: intl.formatMessage({ id: "uncheck_num" }, { num: uncheckNum }),
    },
    {
      key: "check_num",
      label: intl.formatMessage({ id: "check_num" }, { num: checkNum }),
    },
  ];
  const _onChangeTab = (key: string) => {
    setSelectedTab(key);
  };
  return <Tabs items={tabs} activeKey={selectedTab} onChange={_onChangeTab} />;
};

export default InventoryCheckTabs;
