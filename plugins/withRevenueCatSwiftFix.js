const { withDangerousMod } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

// PurchasesHybridCommon uses switch statements that aren't exhaustive under
// Swift 6 (default in Xcode 26). Pinning those pods to Swift 5 fixes the build.
const PATCH = `
  installer.pods_project.targets.each do |target|
    if ['PurchasesHybridCommon', 'RevenueCat', 'RNPurchases'].include?(target.name)
      target.build_configurations.each do |config|
        config.build_settings['SWIFT_VERSION'] = '5.0'
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

      if (!podfile.includes('PurchasesHybridCommon')) {
        podfile = podfile.replace(
          /post_install do \|installer\|/,
          `post_install do |installer|\n${PATCH}`
        );
        fs.writeFileSync(podfilePath, podfile);
      }

      return config;
    },
  ]);
};
