<h3 align="center">
	<img src="https://raw.githubusercontent.com/wavim/vscode-better-memo/master/media/icon.png" width="120" alt="Better Memo icon" />
   <p></p>
	Better Memo for VSCode
</h3>
<h4 align="center">Automatic Comment Curation for Developers</h4>

## Usage

### Syntax

Comments would be curated if they start with `MO` (case-insensitive) e.g. in JavaScript:

![Memo](https://github.com/wavim/vscode-better-memo/blob/master/media/usage-guide/memo.png?raw=true)

> Supports all preset VSCode languages out of the box. Support for other languages could be added
> via settings.

> The format of memos doesn't matter as long as it's valid. The extension will format them for you
> automatically when a tab is closed.

#### Memo Priority

To prioritize more urgent actions, you can add `!` before the content, e.g.
`//MO FIX !breaks middleware` has a higher priority than `//MO FIX missing logs`. The more `!` you
add, the higher the priority.

Those memos would be pinned on top in the Memo Explorer with distinct appearance.

#### New Memo

Typing a memo by hand can be tedious and inefficient. Instead, you can utilize a command:

1. Place your cursor on a line
2. Hit the `Alt+M` command
3. Select/Enter the desired memo tag in the quick pick  
   (enter a tag that is absent in the menu and it would be inserted)
4. And... _voilà_! A memo is instantly inserted for you to type in the content

> To mark a memo as completed, hit `Alt+Shift+M`.

### The Explorer

Memos in the workspace are organized and displayed in an explorer panel offering two view types.

#### The Tag View

![Tag View](https://github.com/wavim/vscode-better-memo/blob/master/media/usage-guide/tag-view.png?raw=true)

#### The File View

![File View](https://github.com/wavim/vscode-better-memo/blob/master/media/usage-guide/file-view.png?raw=true)

#### Actions

##### Head

- Switch view  
  (`Ctrl+Shift+V`)
- Refresh view  
  (`Ctrl+R`)
- Toggle tree fold

##### Context

- Navigate to file
- Complete memo
- Navigate to memo  
  (**Click Memo**)

### Commands

The extension provides several utility commands to help users work more efficiently:

- (`Alt+M`) New memo on line ([details](#new-memo))
- (`Alt+Shift+M`) Complete memo near cursor

- (`Ctrl+Alt+M` + `Ctrl+Alt+<`) Navigate to prev memo
- (`Ctrl+Alt+M` + `Ctrl+Alt+>`) Navigate to next memo

## Status

The codebase is in a maintenance-only state. It is stable but uses legacy patterns (many literally
stupid coupling code, I was very dumb in the early days).

Development is concluded. Unimplemented features are considered out of scope and will not be added.
This is primarily due to a shift in interests, and having an obsolete codebase. Critical bugs may be
addressed, but no ongoing support or development is guaranteed.

Thank you for your support.

---

&emsp;The palest ink is better than the most retentive memory.
