import * as vscode from 'vscode'
import { TagStylerConfig } from './tagStyler'

const extensionId = 'highlight-matching-tag'
const defaultEmptyElements = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
]

interface ConfigurationOptions {
  context: vscode.ExtensionContext
  onEditorChange: (e: vscode.TextEditor) => void
}

class Configuration {
  private get config() {
    const editor = vscode.window.activeTextEditor
    return vscode.workspace.getConfiguration(extensionId, editor && editor.document.uri)
  }

  get isEnabled() {
    return !!this.config.get('enabled')
  }

  get highlightSelfClosing() {
    return !!this.config.get('highlightSelfClosing')
  }

  get highlightFromContent() {
    return !!this.config.get('highlightFromContent')
  }

  get highlightFromName() {
    return !!this.config.get('highlightFromName')
  }

  get highlightFromAttributes() {
    return !!this.config.get('highlightFromAttributes')
  }

  get showPath() {
    return !!this.config.get('showPath')
  }

  get showRuler() {
    return !!this.config.get('showRuler')
  }

  get emptyElements() {
    const defaultEmptyTags = this.config.get('noDefaultEmptyElements') ? [] : defaultEmptyElements
    const customEmptyTags = this.config.get<string[]>('customEmptyElements') || []
    return [...defaultEmptyTags, ...customEmptyTags]
  }

  get styles() {
    return this.config.get<TagStylerConfig>('styles')
  }

  get hasOldSettings() {
    return !!(
      this.config.get('style') ||
      this.config.get('leftStyle') ||
      this.config.get('rightStyle') ||
      this.config.get('beginningStyle') ||
      this.config.get('endingStyle')
    )
  }

  public configure({ context, onEditorChange }: ConfigurationOptions) {
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(onEditorChange, this))
  }

  /**
   * Migrates styling settings from version 0.7.1 -> 0.8.0
   */
  public async migrate(keepSettings: boolean) {
    if (keepSettings) {
      this.migrateStyle('style', 'full')
      this.migrateStyle('leftStyle', 'left')
      this.migrateStyle('rightStyle', 'right')
      this.migrateStyle('beginningStyle', 'full')
      this.migrateStyle('endingStyle', 'full')
    }

    this.deleteSetting('style')
    this.deleteSetting('leftStyle')
    this.deleteSetting('rightStyle')
    this.deleteSetting('beginningStyle')
    this.deleteSetting('endingStyle')
  }

  private deleteSetting = (section: string) => {
    this.config.update(section, undefined, vscode.ConfigurationTarget.WorkspaceFolder)
    this.config.update(section, undefined, vscode.ConfigurationTarget.Workspace)
    this.config.update(section, undefined, vscode.ConfigurationTarget.Global)
  }

  private migrateStyle(oldSection: string, newOpeningSection: string) {
    const old = this.config.inspect<any>(oldSection)
    const current = this.config.inspect<any>('styles')
    if (!old || !current) {
      return
    }
    if (old.workspaceFolderValue) {
      const newValue = current.workspaceFolderValue || { opening: {} }
      newValue.opening[newOpeningSection] = { custom: old.workspaceFolderValue }
      this.config.update('styles', newValue, vscode.ConfigurationTarget.WorkspaceFolder)
    }
    if (old.workspaceValue) {
      const newValue = current.workspaceValue || { opening: {} }
      newValue.opening[newOpeningSection] = { custom: old.workspaceValue }
      this.config.update('styles', newValue, vscode.ConfigurationTarget.Workspace)
    }
    if (old.globalValue) {
      const newValue = current.globalValue || { opening: {} }
      newValue.opening[newOpeningSection] = { custom: old.globalValue }
      this.config.update('styles', newValue, vscode.ConfigurationTarget.Global)
    }
  }
}

const configuration = new Configuration()
export { defaultEmptyElements }
export default configuration
