const { withDangerousMod } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

// PurchasesHybridCommon has @objc enum switch statements without @unknown default.
// In Swift 6 / Xcode 26 this is a compile error. We patch the source files in
// post_install (after pod install downloads them).
//
// Two patterns appear in these files:
//   • Multi-line:  "        case .x:\n            return \"Y\"\n        }"
//   • Single-line: "        case .x: return \"Y\"\n        }"
// We insert @unknown default before the closing } in both cases.
const PATCH = `
  pod_dir = installer.sandbox.pod_dir('PurchasesHybridCommon').to_s
  Dir.glob(pod_dir + '/**/*.swift').each do |file|
    content = File.read(file)
    next if content.include?('@unknown default')
    modified = content
    # Multi-line case: 12-space return followed by 8-space }
    modified = modified.gsub(/(            return "[^"]+")\\n(        \\})/) do
      "#{$1}\\n        @unknown default: return \\"UNKNOWN\\"\\n#{$2}"
    end
    # Single-line case: 8-space "case .x: return" followed by 8-space }
    modified = modified.gsub(/(        case [^\\n]+: return "[^"]+")\\n(        \\})/) do
      "#{$1}\\n        @unknown default: return \\"UNKNOWN\\"\\n#{$2}"
    end
    if modified != content
      File.write(file, modified)
      puts "Patched #{File.basename(file)} for Xcode 26"
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
