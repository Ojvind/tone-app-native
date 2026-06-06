const { withDangerousMod } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

// Multiple pods have @objc enum switch statements without @unknown default.
// In Swift 6 / Xcode 26 this is a compile error.
//
// Affected: PurchasesHybridCommon, RevenueCat (8-space indent),
//           expo-localization LocalizationModule.swift (4-space indent).
//
// Fix strategy:
// 1. File patching with indentation-aware regexes (backreference \\2 matches
//    the same indent on the closing }) — works for any indent depth.
// 2. SWIFT_VERSION=5 build setting for PurchasesHybridCommon as fallback.
const PATCH = `
  def rc_patch_swift_files(swift_files)
    swift_files.each do |file|
      content = File.read(file)
      modified = content
      # Single-line: "<indent>case .x: return anything" + same-indent }
      modified = modified.gsub(/(( +)case [^\\n]+: return [^\\n]+)\\n(\\2\\})/) do
        "#{$1}\\n#{$2}@unknown default: fatalError(\\"Unhandled case\\")\\n#{$3}"
      end
      # Multi-line: "<indent>case .x:" + "<deeper-indent>return anything" + same-indent }
      modified = modified.gsub(/(( +)case [^\\n]+:\\n +return [^\\n]+)\\n(\\2\\})/) do
        "#{$1}\\n#{$2}@unknown default: fatalError(\\"Unhandled case\\")\\n#{$3}"
      end
      if modified != content
        File.write(file, modified)
        puts "RC Swift fix: patched #{File.basename(file)}"
      end
    end
  end

  # Patch pod directories (PurchasesHybridCommon, RevenueCat)
  ['PurchasesHybridCommon', 'RevenueCat'].each do |pod_name|
    pod_dir = installer.sandbox.pod_dir(pod_name).to_s
    swift_files = Dir.glob(pod_dir + '/**/*.swift')
    puts "RC Swift fix: #{swift_files.length} files in pod #{pod_name}"
    rc_patch_swift_files(swift_files)
  end

  # Patch expo-localization (compiled directly from node_modules, not from Pods dir)
  project_root = File.expand_path('..', Pod::Config.instance.installation_root)
  expo_loc_dir = File.join(project_root, 'node_modules', 'expo-localization', 'ios')
  expo_loc_files = Dir.glob(expo_loc_dir + '/**/*.swift')
  puts "RC Swift fix: #{expo_loc_files.length} files in expo-localization"
  rc_patch_swift_files(expo_loc_files)

  # Build settings fallback: force Swift 5 language mode for PurchasesHybridCommon
  installer.pods_project.targets.each do |target|
    if target.name == 'PurchasesHybridCommon'
      target.build_configurations.each do |config|
        config.build_settings['SWIFT_VERSION'] = '5'
      end
      puts "RC Swift fix: set SWIFT_VERSION=5 for #{target.name}"
    end
  end

  # DispatchTimeInterval may gain new cases on future OS versions.
  # The original SDK fatalErrors on @unknown default — patch to return 0 instead.
  dispatch_file = File.join(installer.sandbox.pod_dir('RevenueCat').to_s,
    'Sources/FoundationExtensions/DispatchTimeInterval+Extensions.swift')
  if File.exist?(dispatch_file)
    content = File.read(dispatch_file)
    modified = content.gsub(/@unknown default: fatalError\\("Unknown value: \\\\\\(self\\)"\\)/, '@unknown default: return 0')
    if modified != content
      File.write(dispatch_file, modified)
      puts "RC Swift fix: patched DispatchTimeInterval+Extensions.swift"
    end
  end

  # Xcode 26 / Apple Clang enforces consteval strictly — fmt's FMT_COMPILE_STRING
  # fails to compile when called with non-constexpr arguments (folly, RCT-Folly).
  # Setting FMT_USE_CONSTEVAL=0 disables compile-time format string validation.
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      flags = config.build_settings['OTHER_CPLUSPLUSFLAGS'] || '$(inherited)'
      unless flags.include?('FMT_USE_CONSTEVAL')
        config.build_settings['OTHER_CPLUSPLUSFLAGS'] = flags + ' -DFMT_USE_CONSTEVAL=0'
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
