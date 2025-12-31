require "json"

package = JSON.parse(
  File.read(File.join(__dir__, "package.json"))
)

Pod::Spec.new do |s|
  s.name         = "NitroList"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  # ⚠️ min_ios_version_supported must exist
  s.platforms = { :ios => '15.1' }
  s.source       = {
    :git => "https://github.com/shivshankartiwari/react-native-nitro-list.git",
    :tag => s.version.to_s
  }

  s.source_files = [
    # Swift implementations
    "ios/**/*.{swift}",
    # ObjC++ / autolinking glue
    "ios/**/*.{m,mm}",
    # C++ HybridObjects
    "cpp/**/*.{hpp,cpp}"
  ]

  # ✅ MUST exist and MUST match iosModuleName
  load File.join(__dir__, "nitrogen/generated/ios/NitroList+autolinking.rb")
  add_nitrogen_files(s)

  # Nitro / RN dependencies
  s.dependency "React-jsi"
  s.dependency "React-callinvoker"

  install_modules_dependencies(s)
end
