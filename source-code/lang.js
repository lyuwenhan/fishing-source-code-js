import * as EN from "./lang/EN.js";
import * as CN from "./lang/CN.js";
export default function createLang(functions, code) {
	const langs = {
		EN: EN.getCopy(),
		CN: CN.getCopy()
	};
	const langCodes = Object.keys(langs);
	let langCode = "EN";
	let current = langs.EN;

	function setLanguage(lang) {
		if (langs[lang]) {
			langCode = lang;
			current = functions.deepMerge(langs[lang], langs.EN)
		}
	}
	if (code) {
		setLanguage(code)
	}
	return Object.seal({
		langs,
		langCodes,
		get langCode() {
			return langCode
		},
		get current() {
			return current
		},
		setLanguage
	})
}
