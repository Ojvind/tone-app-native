const { withDangerousMod } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

// PurchasesHybridCommon and RevenueCat have @objc enum switch statements without
// @unknown default. In Swift 6 / Xcode 26 this is a compile error.
//
// Two-layer fix:
// 1. File patching: add @unknown default to @objc enum switches in source files
// 2. Build settings: force SWIFT_VERSION=5 for PurchasesHybridCommon target
//    (Swift 5 mode treats missing @unknown default as a warning, not an error)
//    This is the fallback in case file patching misses a pattern on EAS.
const PATCH = `
  ['PurchasesHybridCommon', 'RevenueCat'].each do |pod_name|
    pod_dir = installer.sandbox.pod_dir(pod_name).to_s
    puts "RC Swift fix: scanning #{pod_dir} (#{pod_name})"
    swift_files = Dir.glob(pod_dir + '/**/*.swift')
    puts "RC Swift fix: found #{swift_files.length} Swift files in #{pod_name}"
    swift_files.each do |file|
      content = File.read(file)
      modified = content
      # Single-line: 8-space "case .x: return anything" followed by 8-space }
      modified = modified.gsub(/(        case [^\\n]+: return [^\\n]+)\\n(        \\})/) do
        "#{$1}\\n        @unknown default: fatalError(\\"Unhandled case\\")\\n#{$2}"
      end
      # Multi-line: 8-space "case .x:" then 12-space "return anything" followed by 8-space }
      modified = modified.gsub(/(        case [^\\n]+:\\n            return [^\\n]+)\\n(        \\})/) do
        "#{$1}\\n        @unknown default: fatalError(\\"Unhandled case\\")\\n#{$2}"
      end
      if modified != content
        File.write(file, modified)
        puts "RC Swift fix: patched #{File.basename(file)}"
      end
    end
  end

  installer.pods_project.targets.each do |target|
    if target.name == 'PurchasesHybridCommon'
      target.build_configurations.each do |config|
        config.build_settings['SWIFT_VERSION'] = '5'
      end
      puts "RC Swift fix: set SWIFT_VERSION=5 for #{target.name}"
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
