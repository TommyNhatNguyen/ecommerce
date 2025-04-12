import en from "@/app/shared/translation/en";
import vi from "@/app/shared/translation/vi";
import { LOCALES } from "@/app/shared/translation/locales";
import { useEffect, useState } from "react";

type LocaleType = typeof LOCALES.ENGLISH | typeof LOCALES.VIETNAMESE;

export const useLanguage = () => {
  const [messages, setMessages] = useState(en[LOCALES.ENGLISH]);
  const [locale, setLocale] = useState<LocaleType>(LOCALES.ENGLISH);
  useEffect(() => {
    // Get saved language from localStorage
    const savedLanguage = localStorage.getItem("language") as LocaleType;

    if (savedLanguage) {
      // If there's a saved language preference, use it
      if (savedLanguage === LOCALES.VIETNAMESE) {
        setLocale(LOCALES.VIETNAMESE);
        setMessages(vi[LOCALES.VIETNAMESE]);
      } else {
        setLocale(LOCALES.ENGLISH);
        setMessages(en[LOCALES.ENGLISH]);
      }
    } else {
      // If no saved preference, check browser language
      const browserLang = navigator.language.split(/[-_]/)[0];
      if (browserLang === LOCALES.VIETNAMESE) {
        setLocale(LOCALES.VIETNAMESE);
        setMessages(vi[LOCALES.VIETNAMESE]);
        localStorage.setItem("language", LOCALES.VIETNAMESE);
      } else {
        setLocale(LOCALES.ENGLISH);
        setMessages(en[LOCALES.ENGLISH]);
        localStorage.setItem("language", LOCALES.ENGLISH);
      }
    }
  }, []);

  const switchLanguage = (language: LocaleType) => {
    if (language === LOCALES.VIETNAMESE) {
      setLocale(LOCALES.VIETNAMESE);
      setMessages(vi[LOCALES.VIETNAMESE]);
      localStorage.setItem("language", LOCALES.VIETNAMESE);
    } else {
      setLocale(LOCALES.ENGLISH);
      setMessages(en[LOCALES.ENGLISH]);
      localStorage.setItem("language", LOCALES.ENGLISH);
    }
    // Reload the page while keeping the current URL
    window.location.reload();
  };

  return { messages, locale, switchLanguage };
};
