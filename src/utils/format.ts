import { TextDocument } from "vscode";
import { Lang } from "../engine/lang";
import { Memo } from "../engine/memo";
import { FileEdit } from "./file-edit";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Format {
	export async function formatDoc(doc: TextDocument): Promise<void> {
		const list = Memo.inDoc(doc);
		if (list.length === 0) return;

		const edit = new FileEdit.Edit();

		for (const memo of list) {
			edit.replace(doc, [memo.meta.start, memo.meta.end], toFormatted(memo));
		}

		await edit.apply();
	}

	function toFormatted(memo: Memo.Memo): string {
		const template = getTemplate(memo.meta.lang);

		return `${template.head}${memo.tag}${
			memo.priority !== 0 || memo.content ? " " : ""
		}${"!".repeat(memo.priority)}${memo.content}${template.tail}`;
	}

	export function getTemplate(lang: string): { head: string; tail: string } {
		if (!Lang.includes(lang)) return { head: "", tail: "" };

		const delimiters = Lang.data.delimiters[lang];

		const headPad = delimiters.open.endsWith(" ") ? "" : " ";
		const tailPad = delimiters.exit ? " " : "";

		return {
			head: `${delimiters.open}${headPad}MO `,
			tail: `${tailPad}${delimiters.exit ?? ""}`,
		};
	}
}
