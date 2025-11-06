import ExpoModulesCore
import SwiftUI
import UIKit

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
      onPress: { [weak self] in
        self?.onPress()
      }
    )

    let controller = UIHostingController(rootView: buttonView)
    controller.view.backgroundColor = .clear
    hostingController = controller

    // Always add the view, even if we don't have a parent VC yet
    addSubview(controller.view)
    controller.view.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      controller.view.leadingAnchor.constraint(equalTo: leadingAnchor),
      controller.view.trailingAnchor.constraint(equalTo: trailingAnchor),
      controller.view.topAnchor.constraint(equalTo: topAnchor),
      controller.view.bottomAnchor.constraint(equalTo: bottomAnchor),
    ])

    // Try to find parent view controller and properly add as child if available
    var responder: UIResponder? = self
    while let nextResponder = responder?.next {
      if let viewController = nextResponder as? UIViewController {
        viewController.addChild(controller)
        controller.didMove(toParent: viewController)
        break
      }
      responder = nextResponder
    }
  }

  func updateButton() {
    hostingController?.willMove(toParent: nil)
    hostingController?.view.removeFromSuperview()
    hostingController?.removeFromParent()

    setupView()
  }

  override func didMoveToWindow() {
    super.didMoveToWindow()

    // If we now have a window and the hosting controller isn't attached to a parent VC, try again
    if window != nil && hostingController?.parent == nil {
      var responder: UIResponder? = self
      while let nextResponder = responder?.next {
        if let viewController = nextResponder as? UIViewController {
          hostingController?.willMove(toParent: viewController)
          viewController.addChild(hostingController!)
          hostingController?.didMove(toParent: viewController)
          break
        }
        responder = nextResponder
      }
    }
  }

  deinit {
    hostingController?.willMove(toParent: nil)
    hostingController?.view.removeFromSuperview()
    hostingController?.removeFromParent()
  }
}
