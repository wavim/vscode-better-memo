import { commands, TreeItemCollapsibleState, window } from "vscode";
import { Doc } from "../engine/doc";
import { Scan } from "../engine/scan";
import { Aux } from "../utils/auxiliary";
import { EventEmitter } from "../utils/event-emitter";
import { Format } from "../utils/format";
import { Janitor } from "../utils/janitor";
import { TreeItem } from "./tree-item";
import { TreeProvider } from "./tree-provider";

export function initTree() {
	const provider = new TreeProvider();

	const explorer = window.createTreeView("better-memo.memoExplorer", {
		treeDataProvider: provider,
		canSelectMany: false,
	});

	const expand = { primary: true, secondary: true };

	function updateView(): void {
		provider.refresh(expand);
	}

	Janitor.add(
		explorer,

		explorer.onDidChangeVisibility((ev) => {
			if (ev.visible) {
				void Scan.clean().then(() => updateView());
			}
		}),

		EventEmitter.subscribe("Update", updateView),

		commands.registerCommand("better-memo.toggleFold", () => {
			[expand.primary, expand.secondary] = [
				!expand.secondary,
				expand.primary && !expand.secondary,
			];

			for (const item of provider.items) {
				item.collapsibleState = expand.primary
					? TreeItemCollapsibleState.Expanded
					: TreeItemCollapsibleState.Collapsed;

				if (item.label.endsWith("\u200b")) {
					item.label = item.label.slice(0, -1);
				} else {
					item.label = item.label + "\u200b";
				}

				for (const child of item.children) {
					child.collapsibleState = expand.secondary
						? TreeItemCollapsibleState.Expanded
						: TreeItemCollapsibleState.Collapsed;
				}
			}
			provider.flush();
		}),

		commands.registerCommand("better-memo.switchToTagView", () => {
			provider.view = "tag";
			updateView();
		}),
		commands.registerCommand("better-memo.switchToFileView", () => {
			provider.view = "file";
			updateView();
		}),

		commands.registerCommand(
			"better-memo.navigateToFile",
			(fileItem: TreeItem.FileItem<"primary" | "secondary">) => {
				void fileItem.navigate();
			},
		),

		commands.registerCommand("better-memo.navigateToMemo", (navigate: () => void) =>
			navigate(),
		),

		commands.registerCommand(
			"better-memo.completeMemo",
			async (memoItem: TreeItem.MemoItem<"tag" | "file">) => {
				await memoItem.complete().apply();

				await Scan.doc(memoItem.memo.meta.doc, { flush: true });
				updateView();
			},
		),

		window.onDidChangeTextEditorSelection((ev) => {
			if (!explorer.visible) return;

			const editor = ev.textEditor;
			const doc = editor.document;
			if (!Doc.includes(doc)) return;

			const memos = provider.memos.filter((item) => item.memo.meta.doc === doc);
			if (memos.length === 0) return;

			memos.sort((itemA, itemB) =>
				itemA.memo.meta.start.compareTo(itemB.memo.meta.start),
			);

			let active = editor.selection.active;
			if (Format.getTemplate(doc.languageId).tail) {
				active = active.translate(0, -1);
			}

			let i = Aux.algorithm.predecessorSearch(
				active,
				memos,
				(item) => item.memo.meta.start,
				(a, b) => a.compareTo(b),
			);
			if (i === -1) i = 0;

			explorer.reveal(memos[i!]);
		}),
	);

	updateView();
	commands.executeCommand("setContext", "better-memo.init", true);
}
