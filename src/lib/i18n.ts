export type Language = "en" | "my";

export const copy = {
  en: {
    explore: "Explore causes",
    support: "Support this cause",
    raised: "raised",
    supporters: "supporters",
    daysLeft: "days left",
    pending: "Pending verification",
  },
  my: {
    explore: "အကြောင်းအရာများ ရှာဖွေပါ",
    support: "ဤအကြောင်းအရာကို ကူညီပါ",
    raised: "ရရှိပြီး",
    supporters: "ကူညီသူများ",
    daysLeft: "ကျန်သေးသောရက်",
    pending: "စစ်ဆေးရန် စောင့်ဆိုင်းနေသည်",
  },
} satisfies Record<Language, Record<string, string>>;

export function getCopy(language: Language = "en") {
  return copy[language];
}
