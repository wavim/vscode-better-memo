import { workspace } from "vscode";
import { Janitor } from "./janitor";

/**
 * Simplified functions for config related tasks
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Config {
	let userConfigs = workspace.getConfiguration("betterMemo");

	/**
	 * `configName` should omit "better-memo." field prefix
	 */
	export function get<T>(configName: string): T {
		return userConfigs.get(configName) as T;
	}

	/**
	 * @param callback supplied with the new config values in order of appearance in `configs`
	 * @returns `id` for {@link Janitor.clear()}
	 */
	export function onChange(config: string, callback: (updated: unknown) => unknown): number {
		const onChangeConfig = workspace.onDidChangeConfiguration((ev) => {
			if (!ev.affectsConfiguration(`betterMemo.${config}`)) {
				return;
			}

			userConfigs = workspace.getConfiguration("betterMemo");
			callback(get(config));
		});

		return Janitor.add(onChangeConfig);
	}

	Janitor.add(
		workspace.onDidChangeConfiguration((ev) => {
			if (!ev.affectsConfiguration("betterMemo")) return;

			userConfigs = workspace.getConfiguration("betterMemo");
		}),
	);
}
