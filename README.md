# MoveMyTasks

MoveMyTasks is an Obsidian plugin that helps you keep your notes tidy by automatically moving completed tasks to a designated section. You can also create custom commands to quickly move any task to user-defined sections.

---

## ✨ Features

- ✅ **Auto-move checked tasks**  
  When you check off a task (`- [x] Task`), it is automatically moved to your configured *Completed* section.

- 🎯 **Custom commands for sections**  
  Define as many custom section headings as you want. Each section gets its own command that lets you move the current task there instantly.

- ⚙️ **Flexible settings**  
  - Choose the heading where completed tasks should go (default: `### Completed`).  
  - Add or remove custom section commands directly from the settings tab.  
  - Disable auto-moving if you only want manual commands.

---

## 📥 Installation

### From Obsidian Community Plugins
> (Once published, this section will be updated with a direct link.)

1. Open **Settings → Community plugins**.  
2. Make sure *Safe mode* is off.  
3. Click **Browse**, search for **MoveMyTasks**, and install.  
4. Enable the plugin.

### Manual Installation

1. Download the latest release from the [Releases](https://github.com/tirthd16/obsidian-movemytasks/releases) page.  
2. Extract the files into your vault’s `.obsidian/plugins/obsidian-movemytasks` folder.  
3. Reload Obsidian and enable the plugin.

---

## 🔧 Usage

### 1. Automatic Move
- Create a heading (default: `### Completed`) somewhere in your note.  
- When you check off a task, MoveMyTasks moves it under that heading.  

### 2. Custom Commands
- In **Settings → MoveMyTasks**, add new section titles (e.g., `### Open`, `### Close`, `### Someday`).  
- Each section gets its own Obsidian command:  
  > *Move to ### Open*, *Move to ### Close*, etc.  
- Assign hotkeys to these commands for quick use.

---

## ⚙️ Settings

- **Completed Section Heading**  
  The section where checked tasks should go. Leave empty to disable auto-moving.  

- **Custom Section Commands**  
  Add as many custom section headings as you like. Each becomes a command in Obsidian’s command palette.  

---

## 📸 Example

Before checking off a task:

```markdown
- [ ] Write project proposal
```

After checking it off:

```markdown
### Completed
- [x] Write project proposal
```

---

## 🚧 Limitations

- The section heading must already exist in the note.  
- Tasks are only moved within the current file (not across files).  

---

## 📜 License

This plugin is licensed under the [MIT License](LICENSE).
