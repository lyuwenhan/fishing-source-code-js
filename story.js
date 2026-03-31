import lang from "./lang.js";
import * as data from "./data.js";
import * as functions from "./functions.js";

export default async function story(){
	await functions.clear();
	for(let text of lang.current.story.main_story){
		await functions.printa(text);
	}
	await functions.clear();
}
