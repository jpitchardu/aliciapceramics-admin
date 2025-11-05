import ExpoModulesCore

public class UIModule: Module {

  public func definition() -> ModuleDefinition {
    Name("UI")

    View(GlassButtonManager.self) {
      Events("onPress")

      Prop("label") {
        (view: GlassButtonManager, label: String) in
        view.label = label
        view.updateButton()
      }

      Prop("icon") {
        (view: GlassButtonManager, icon: String) in
        view.icon = icon
        view.updateButton()
      }

      Prop("variant") {
        (view: GlassButtonManager, variant: String) in
        view.variant = variant
        view.updateButton()
      }
    }
  }
}
