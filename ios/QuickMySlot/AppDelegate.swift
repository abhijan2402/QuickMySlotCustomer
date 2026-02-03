import UIKit
import FirebaseCore
import GoogleMaps
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import UserNotifications
import RNCPushNotificationIOS
@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    UNUserNotificationCenter.current().delegate = self
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()
    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "QuickMySlot",
      in: window,
      launchOptions: launchOptions
      
    )
    GMSServices.provideAPIKey("AIzaSyDsRXO8vkZFS6TnnNs6i0MD_d_De7d5xqo")
    FirebaseApp.configure()
      RNSplashScreen.show() // 👈 THIS IS REQUIRED
    return true
  }
}

extension AppDelegate: UNUserNotificationCenterDelegate {

  // App in foreground → show banner/sound
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
  ) {
    completionHandler([.banner, .sound, .badge])
  }

  // When user taps notification
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    didReceive response: UNNotificationResponse,
    withCompletionHandler completionHandler: @escaping () -> Void
  ) {
    // RNCPushNotificationIOS.handleNotificationResponse(response)
    completionHandler()
  }
}


class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
