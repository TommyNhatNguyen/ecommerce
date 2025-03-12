import { useLanguage } from "@/app/shared/hooks/useLanguage";
import { LOCALES } from "@/app/shared/translation/locales";
import { Select } from "antd";
import { Header } from "antd/es/layout/layout";

export const HeaderSection = () => {
  const { locale, switchLanguage } = useLanguage();

  return (
    <Header className="flex items-center justify-end gap-4 bg-white px-4">
      <Select
        value={locale}
        onChange={switchLanguage}
        options={[
          { value: LOCALES.ENGLISH, label: "English" },
          { value: LOCALES.VIETNAMESE, label: "Tiếng Việt" },
        ]}
      />
      {/* Other header content */}
    </Header>
  );
};
