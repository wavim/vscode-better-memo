import { TextDocument, workspace } from "vscode";
import { Aux } from "../utils/auxiliary";
import { Config } from "../utils/config";
import { Lang } from "./lang";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Doc {
	interface DocMeta {
		version: number;
		lang: string;
	}

	export let data: { docs: TextDocument[]; metas: Map<string, DocMeta> } = {
		docs: [],
		metas: new Map(),
	};
	export async function update(): Promise<void> {
		data = await getData();
	}

	export function includes(doc: TextDocument): boolean {
		return data.metas.has(doc.fileName);
	}

	export function isChanged(doc: TextDocument): boolean {
		const meta = data.metas.get(doc.fileName);
		if (!meta) return false;

		const { version, languageId: lang } = doc;
		data.metas.set(doc.fileName, { version, lang });

		const isChanged = version !== meta.version || lang !== meta.lang;

		return isChanged;
	}

	export async function getData(): Promise<typeof data> {
		const ignore = `{${Config.get<string[]>("ignore").join(",")}}`;

		const uris = await workspace.findFiles("**/*", ignore);
		const textDocs = (
			await Aux.async.map(uris, async (uri) => {
				try {
					return await workspace.openTextDocument(uri);
				} catch {
					/* empty */
				}
			})
		).filter((opened) => opened !== undefined);

		const docs = textDocs.filter((doc) => Lang.includes(doc.languageId));

		const metas: (typeof data)["metas"] = new Map();
		for (const doc of docs) {
			metas.set(doc.fileName, { version: doc.version, lang: doc.languageId });
		}

		return { docs, metas };
	}
}
