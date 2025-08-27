import { TextDocument, window } from "vscode";
import { Doc } from "./doc";
import { Lang } from "./lang";
import { Memo } from "./memo";
import { Tag } from "./tag";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Scan {
	export async function clean(): Promise<void> {
		Lang.update();
		await Doc.update();
		await Memo.update({ flush: true });
		Tag.update();
	}

	export async function filesChanged(): Promise<void> {
		const newDocData = await Doc.getData();

		const docs = Doc.data.docs;
		const newDocs = newDocData.docs;
		Doc.data = newDocData;

		const createdDocs = newDocs.filter((doc) => !docs.includes(doc));
		const deletedDocs = docs.filter((doc) => !newDocs.includes(doc));

		await Memo.update({ rescan: createdDocs.concat(deletedDocs) });
		Tag.update();
	}

	export async function doc(
		doc: TextDocument,
		options?: { flush?: boolean },
	): Promise<boolean> {
		if (!options?.flush && !Doc.isChanged(doc)) return false;

		await Memo.update({ rescan: [doc], flush: options?.flush });
		Tag.update();

		return true;
	}

	export async function docs(
		docs: TextDocument[],
		options?: { flush?: boolean },
	): Promise<void> {
		for (const doc of docs) {
			await Memo.update({ rescan: [doc], flush: options?.flush });
		}
		Tag.update();
	}

	export async function activeDoc(options?: { flush?: boolean }): Promise<boolean> {
		const active = window.activeTextEditor?.document;
		if (!active) return false;

		return await Scan.doc(active, options);
	}
}
