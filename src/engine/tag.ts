import { ThemeColor } from "vscode";
import { Colors } from "../utils/colors";
import { Config } from "../utils/config";
import { Lang } from "./lang";
import { Memo } from "./memo";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Tag {
	type TagColors = Record<string, ThemeColor>;

	export let data: { tags: string[]; colors: TagColors } = getData();
	export function update(): void {
		data = getData();
	}

	export function isValid(tag: string): boolean {
		return RegExp(`^[^\\s${Lang.data.closersRE}!]+$`).test(tag);
	}

	export function getData(): typeof data {
		const colors: (typeof data)["colors"] = {};

		for (const { tag } of Memo.data.memos) colors[tag] = Colors.hash(tag);

		const customTags = Config.get<Record<string, string>>("savedTags");

		for (let [tag, hex] of Object.entries(customTags)) {
			[tag, hex] = [tag.trim().toUpperCase(), hex.trim()];

			if (!isValid(tag)) continue;

			colors[tag] = Colors.interpolate(hex);
		}
		const tags = Object.keys(colors);

		return { tags, colors };
	}
}
