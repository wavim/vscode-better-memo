import { commands, Uri, window, workspace } from "vscode";
import { Config } from "../utils/config";
import { EventEmitter } from "../utils/event-emitter";
import { Format } from "../utils/format";
import { Janitor } from "../utils/janitor";
import { Doc } from "./doc";
import { Lang } from "./lang";
import { Scan } from "./scan";
import { Tag } from "./tag";

export async function initEngine(): Promise<void> {
	Config.onChange("customTags", () => {
		Tag.update();
		updateView();
	});

	Config.onChange("customLanguages", async () => {
		Lang.update();
		await Scan.filesChanged();
		updateView();
	});

	Config.onChange("ignore", async () => {
		await Scan.filesChanged();
		updateView();
	});

	Janitor.add(
		commands.registerCommand("better-memo.refresh", async () => {
			await Scan.clean();
			updateView();
		}),

		workspace.onDidChangeWorkspaceFolders(async () => {
			await Scan.filesChanged();
			updateView();
		}),

		workspace.onDidCreateFiles(async () => {
			await Scan.filesChanged();
			updateView();
		}),
		workspace.onDidDeleteFiles(async () => {
			await Scan.filesChanged();
			updateView();
		}),

		workspace.onDidSaveTextDocument(async (doc) => {
			const scanned = await Scan.doc(doc);
			if (scanned) updateView();
		}),

		window.onDidChangeActiveColorTheme(() => {
			Tag.update();
			updateView();
		}),

		window.tabGroups.onDidChangeTabs(async (ev) => {
			for (const tab of ev.closed) {
				const uri = (tab.input as { uri: Uri } | undefined)?.uri;
				if (!uri || uri.scheme === "untitled") continue;

				let doc;
				try {
					doc = await workspace.openTextDocument(uri);
				} catch {
					continue;
				}

				if (Doc.includes(doc)) await Format.formatDoc(doc);
			}
		}),
	);

	await Scan.filesChanged();
}

function updateView(): void {
	EventEmitter.emit("Update");
}
