import EN from "./lang/EN.js";
import CN from "./lang/CN.js";
const allLangs = {
	EN,
	CN
};
const langs = {
	langs: allLangs,
	langCode: "EN",
	current: allLangs.EN
};
export function setLanguage(lang) {
	if (allLangs[lang]) {
		langs.langCode = lang;
		langs.current = {
			...allLangs["EN"],
			...allLangs[lang]
		}
	}
}
export default langs;
