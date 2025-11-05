import ExpoModulesCore
import SwiftUI

struct GlassButtonView: View {
  let label: String
  let icon: String?
  let variant: String
  let onPress: () -> Void

  var body: some View {

    Button(action: onPress) {

      HStack(spacing: 8) {
        if let icon = icon {
          Image(systemName: icon).font(.system(size: 16, weight: .medium))
        }
        Text(label).font(.system(size: 16, weight: .semibold))
      }.foregroundStyle(.white)
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)
        .padding(.horizontal, 24)
    }.buttonStyle(.plain)
      .background {
        if #available(iOS 26.0, macOS 26.0, *) {
          RoundedRectangle(cornerRadius: 16)
            .fill(.ultraThinMaterial)
            .glassEffect(.regular)
        } else {
          RoundedRectangle(cornerRadius: 16).fill(.ultraThinMaterial)
        }
      }
  }
}

class GlassButtonManager: ExpoView {
    var label: String = "button"
    var icon: String? = nil
    var variant: String = "regular"
    let onPress = EventDispatcher()
    
    private var hostingController: UIHostingController<GlassButtonView>?
    
    required init(appContext: AppContext? = nil) {
        super.init(appContext: appContext)
        setupView()
    }
    
    private func setupView() {
        let buttonView = GlassButtonView(
            label: label,
            icon: icon,
            variant: variant,
            onPress: onPress.callAsFunction
        )
        
        var controller = UIHostingController(rootView: buttonView)
        controller.view.backgroundColor = .clear
        hostingController = controller
        
        addSubview(controller.view)
        controller.view.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            controller.view.leadingAnchor.constraint(equalTo: leadingAnchor),
            controller.view.trailingAnchor.constraint(equalTo: trailingAnchor),
            controller.view.topAnchor.constraint(equalTo: topAnchor),
            controller.view.bottomAnchor.constraint(equalTo: bottomAnchor),
        ])
    }
    
    func updateButton() {
        hostingController?.rootView = GlassButtonView(
            label: label,
            icon: icon,
            variant: variant,
            onPress: { [weak self] in
                self?.onPress()
            })
    }
}
