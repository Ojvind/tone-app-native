const { withDangerousMod } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

// PurchasesHybridCommon/RevenueCat use @objc enum switches without @unknown default,
// which is an error in Swift 6 (Xcode 26). Force Swift 5 mode for all pods to keep
// these as warnings, and disable warnings-as-errors for the affected pods.
const PATCH = `
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['SWIFT_VERSION'] = '5.0'
      if ['PurchasesHybridCommon', 'RevenueCat', 'RNPurchases'].include?(target.name)
        config.build_settings['SWIFT_TREAT_WARNINGS_AS_ERRORS'] = 'NO'
        config.build_settings['GCC_WARN_INHIBIT_ALL_WARNINGS'] = 'YES'
      end
    end
  end
`;

module.exports = function withRevenueCatSwiftFix(config) {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');

      if (!podfile.includes('# revenuecat-swift-fix')) {
        podfile = podfile.replace(
          /post_install do \|installer\|/,
          `post_install do |installer| # revenuecat-swift-fix\n${PATCH}`
        );
        fs.writeFileSync(podfilePath, podfile);
      }

      return config;
    },
  ]);
};
