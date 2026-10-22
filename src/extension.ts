import Gio from "gi://Gio";
import St from "gi://St";
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import { DockManager } from "./lib/dockManager.js";

export default class MacosDockExtension extends Extension {
  private _dockManager: DockManager | null = null;
  private _theme: St.Theme | null = null;
  private _stylesheet: Gio.File | null = null;

  enable(): void {
    this._theme = St.ThemeContext.get_for_stage(global.stage).get_theme();
    const extensionDirectory = Gio.File.new_for_uri(import.meta.url).get_parent();
    if (!extensionDirectory) throw new Error("Could not find the extension directory.");
    this._stylesheet = extensionDirectory.get_child("stylesheet.css");
    if (!this._theme.load_stylesheet(this._stylesheet)) {
      console.error("MacOS Dock: GNOME Shell could not load stylesheet.css.");
    }

    this._dockManager = new DockManager();
    this._dockManager.enable(this.getSettings());
  }

  disable(): void {
    if (this._dockManager) {
      this._dockManager.disable();
      this._dockManager = null;
    }

    if (this._theme && this._stylesheet) {
      this._theme.unload_stylesheet(this._stylesheet);
      this._theme = null;
      this._stylesheet = null;
    }
  }
}
