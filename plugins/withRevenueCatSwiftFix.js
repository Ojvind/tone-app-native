const { withDangerousMod } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

// Pods that fail to compile under Swift 6 / Xcode 26 due to missing
// @unknown default in enum switches. Swift 5 mode treats these as warnings,
// not errors, so the source ships unmodified and nothing fatalErrors at runtime.
const SWIFT5_PODS = ['RevenueCat', 'PurchasesHybridCommon', 'ExpoLocalization'];

const PATCH = `
  # Force Swift 5 language mode for pods that don't compile cleanly under Swift 6.
  # Swift 5 treats missing @unknown default as a warning, not an error.
  ['RevenueCat', 'PurchasesHybridCommon', 'ExpoLocalization'].each do |pod_name|
    installer.pods_project.targets.each do |target|
      next unless target.name == pod_name
      target.build_configurations.each do |config|
        config.build_settings['SWIFT_VERSION'] = '5'
      end
      puts "RC Swift fix: set SWIFT_VERSION=5 for #{pod_name}"
    end
  end

  # DispatchTimeInterval (Apple SDK enum) already has @unknown default: fatalError
  # in the RevenueCat source. Patch it to return 0 so new OS cases don't crash.
  dispatch_file = File.join(installer.sandbox.pod_dir('RevenueCat').to_s,
    'Sources/FoundationExtensions/DispatchTimeInterval+Extensions.swift')
  if File.exist?(dispatch_file)
    content = File.read(dispatch_file)
    original = '@unknown default: fatalError("Unknown value: \\(self)")'
    if content.include?(original)
      File.write(dispatch_file, content.gsub(original, '@unknown default: return 0'))
      puts "RC Swift fix: patched DispatchTimeInterval+Extensions.swift"
    end
  end
`;

// fmt 11's detection block unconditionally redefines FMT_USE_CONSTEVAL — no #ifndef guard.
// Under Xcode 26 this enables consteval, whose constructor rejects runtime args.
const FMT_PATCH = `
  fmt_candidates = [
    File.join(installer.sandbox.pod_dir('fmt').to_s, 'include/fmt/base.h'),
    File.join(installer.sandbox.root.to_s, 'fmt/include/fmt/base.h'),
  ] + Dir.glob(File.join(installer.sandbox.root.to_s, '**/fmt/base.h'))
  fmt_base = fmt_candidates.find { |f| File.exist?(f) }
  puts "RC Swift fix: fmt/base.h => #{fmt_base || 'NOT FOUND'}"
  if fmt_base
    content = File.read(fmt_base)
    needle   = /#if FMT_USE_CONSTEVAL\\n#  define FMT_CONSTEVAL consteval/
    patch_hdr = "// rc-patch: force FMT_USE_CONSTEVAL=0 for Xcode 26\\n" \\
                "#undef FMT_USE_CONSTEVAL\\n" \\
                "#define FMT_USE_CONSTEVAL 0\\n"
    if content.match?(needle) && !content.include?('rc-patch')
      File.write(fmt_base, content.sub(needle, patch_hdr + "#if FMT_USE_CONSTEVAL\\n#  define FMT_CONSTEVAL consteval"))
      puts "RC Swift fix: patched fmt/base.h"
    elsif content.include?('rc-patch')
      puts "RC Swift fix: fmt/base.h already patched"
    else
      puts "RC Swift fix: fmt/base.h needle not found"
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
        podfile = podfile.replace(
          /\n    react_native_post_install\(/,
          `\n${FMT_PATCH}    react_native_post_install(`
        );
      }

      fs.writeFileSync(podfilePath, podfile);
      return config;
    },
  ]);
};
