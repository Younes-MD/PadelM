"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Lang, translations, Translations } from "@/lib/i18n";

interface LangCtx { lang: Lang; setLang: (l: Lang) => void; t: Translations; }

const LangContext = createContext<LangCtx>({ lang: "fr", setLang: () => {}, t: translations.fr });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const saved = localStorage.getItem("padelLang") as Lang;
    if (saved === "fr" || saved === "en") setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("padelLang", l);
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);