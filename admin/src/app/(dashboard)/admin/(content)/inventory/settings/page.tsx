"use client";
import SettingsTable from "./components/SettingsTable";
import { useIntl } from "react-intl";

const SettingsPage = () => {
  const intl = useIntl();

  return (
    <div className="relative mb-4 rounded-lg bg-white px-4 py-2">
      <h2 className="text-lg font-medium">
        {intl.formatMessage({ id: "inventory_low_stock_threshold_settings" })}
      </h2>
      <div className="relative mt-4 h-full">
        <SettingsTable />
      </div>
    </div>
  );
};

export default SettingsPage;
