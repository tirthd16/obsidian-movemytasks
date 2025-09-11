import { Editor, EditorPosition, EventRef, Plugin } from 'obsidian';
import { App, PluginSettingTab, Setting } from 'obsidian';

interface commandSetting {
    id: string,
    sectionHeading: string
}
interface PluginSettings {
    completedSectionTitle: string;
    listOfCommands: Array<commandSetting>
}

const DEFAULT_SETTINGS: Partial<PluginSettings> = {
    completedSectionTitle: "### Completed",
    listOfCommands: [
        {
            id: crypto.randomUUID(),
            sectionHeading: '### Open'
        },
        {
            id: crypto.randomUUID(),
            sectionHeading: '### Close'
        }
    ]
};

export default class MyPlugin extends Plugin {
    settings: PluginSettings;
    private ref: EventRef | null = null;
    async onload() {
        await this.loadSettings()
        await this.saveSettings()
        this.addSettingTab(new MySettingTab(this.app, this));
        if (this.settings.completedSectionTitle) {
            this.resumeWatcher()
        }
        this.resumeWatcher()
        this.settings.listOfCommands.forEach((command) => {
            if (!command.sectionHeading) return
            this.addCommand({
                id: command.id,
                name: `Move to ${command.sectionHeading}`,
                editorCallback: (editor: Editor) => {
                    this.pauseWatcher()
                    moveToSection(editor, command.sectionHeading)
                    this.resumeWatcher()
                },
            })
        })
    }

    unload(): void {
        this.pauseWatcher()
    }
    pauseWatcher() {
        if (this.ref) {
            this.app.workspace.offref(this.ref);
            this.ref = null;
        }
    }

    resumeWatcher() {
        if (!this.ref) {
            this.ref = this.app.workspace.on("editor-change", (editor) => {
                this.pauseWatcher()
                moveToSection(editor, this.settings.completedSectionTitle, true)
                this.resumeWatcher()
            });
        }
    }
    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}


export class MySettingTab extends PluginSettingTab {
    plugin: MyPlugin;

    constructor(app: App, plugin: MyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Completed Section Heading')
            .setDesc('Automatically move a line to this section when it is checked. Keep empty to disable')
            .addText((text) =>
                text
                    .setPlaceholder('### Completed')
                    .setValue(this.plugin.settings.completedSectionTitle)
                    .onChange(async (value) => {
                        this.plugin.settings.completedSectionTitle = value;
                        await this.plugin.saveSettings();
                        if (!value) {
                            this.plugin.pauseWatcher()
                        } else this.plugin.resumeWatcher()

                    })
            );

        this.plugin.settings.listOfCommands.forEach((command, index) => {
            new Setting(containerEl)
                .setName(`Section ${index} - Title`)
                .addText((text) =>
                    text
                        .setValue(command.sectionHeading)
                        .onChange(async (value) => {
                            command.sectionHeading = value;
                            await this.plugin.saveSettings();
                        })
                ).addExtraButton(button => button
                    .setIcon('x')
                    .onClick(async () => {
                        this.plugin.settings.listOfCommands.splice(index, 1)
                        await this.plugin.saveSettings()
                        this.display()
                    })
                )
        })

        new Setting(containerEl)
            .setName('Add New Section')
            .setDesc('With extra button')
            .addButton(button => button
                .setButtonText('Add New Section')
                .onClick(async () => {
                    this.plugin.settings.listOfCommands.push({ sectionHeading: "", id: crypto.randomUUID() })
                    await this.plugin.saveSettings();
                    this.display()
                })
            )
    }
}

function findPositionByString(editor: Editor, search: string): number | null {
    const docText = editor.getValue();
    const index = docText.indexOf(search);
    if (index === -1) return null;

    // Convert character index → EditorPosition
    const beforeText = docText.substring(0, index);
    const lines = beforeText.split("\n");
    const line = lines.length - 1;

    return line;
}

function moveToSection(editor: Editor, section: string, checkForCheckbox: boolean = false) {
    console.log(section);
    const cursor: EditorPosition = editor.getCursor()
    const currLine: number = cursor.line
    const currText: string = editor.getLine(currLine)
    if (!checkForCheckbox || /^- \[x\] .*/i.test(currText)) {
        const from: EditorPosition = { ch: 0, line: currLine }
        const to: EditorPosition = { ch: 0, line: currLine + 1 }
        let pasteLine: number | null = findPositionByString(editor, section)
        if (!pasteLine) {
            return
        }
        if (pasteLine < currLine) {   // If where you want to paste is above the
            pasteLine += 1          // current line then you will have to account
        }                           // for a line not being deleted from below
        editor.replaceRange("", from, to)
        editor.replaceRange(currText + "\n", { line: pasteLine, ch: 0 })
    }
}
