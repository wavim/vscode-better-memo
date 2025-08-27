import { Aux } from "../utils/auxiliary";
import { Config } from "../utils/config";

import PredefinedLangs from "../json/predefined-langs.json";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Lang {
	export let data: {
		langs: string[];

		delimiters: Record<string, { open: string; exit?: string }>;

		closers: string[];
		closersRE: string;
	} = getData();
	export function update(): void {
		data = getData();
	}

	export function includes(lang: string): boolean {
		return !!data.delimiters[lang];
	}

	export function getData(): typeof data {
		const customLangs = Config.get("customLanguages") ?? {};

		const delimiters: (typeof data)["delimiters"] = {
			...PredefinedLangs,
			...customLangs,
		};

		const langs = Object.keys(delimiters);

		const closers = Object.values(delimiters).flatMap((comment) => {
			return comment.exit?.split("") ?? [];
		});
		const closersRE = Aux.re.escape([...new Set(closers)].join(""));

		return { langs, delimiters, closers, closersRE };
	}
}
