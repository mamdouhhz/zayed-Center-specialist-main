import { createI18n } from "vue-i18n";

const messages = {
  en: {},
  es: {},
  de: {},
  ja: {},
  fr: {},
};

const i18n = createI18n({
  legacy: false,
  locale: "en",
  globalInjection: true,
  messages,
});

export default i18n;
