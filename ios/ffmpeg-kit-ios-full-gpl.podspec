Pod::Spec.new do |s|
  s.name             = 'ffmpeg-kit-ios-full-gpl'
  s.version          = '6.0' # Matches ffmpeg-kit-react-native expectation
  s.summary          = 'Custom full-gpl FFmpegKit iOS frameworks'
  s.homepage         = 'https://github.com/NooruddinLakhani/ffmpeg-kit-ios-full-gpl'
  s.license          = { :type => 'GPL v3', :text => 'GNU General Public License v3.0' }
  s.author           = { 'NooruddinLakhani' => 'https://github.com/NooruddinLakhani' }
  s.platform         = :ios, '12.1'
  s.static_framework = true

  # Source URL for the zipped binaries
  s.source           = { :http => 'https://github.com/NooruddinLakhani/ffmpeg-kit-ios-full-gpl/archive/refs/tags/latest.zip' }

  # Simplified vendored frameworks, assuming the archive extracts to a folder containing the .xcframeworks
  s.vendored_frameworks = [
    'ffmpeg-kit-ios-full-gpl-latest/ffmpeg-kit-ios-full-gpl/6.0-80adc/libswscale.xcframework',
    'ffmpeg-kit-ios-full-gpl-latest/ffmpeg-kit-ios-full-gpl/6.0-80adc/libswresample.xcframework',
    'ffmpeg-kit-ios-full-gpl-latest/ffmpeg-kit-ios-full-gpl/6.0-80adc/libavutil.xcframework',
    'ffmpeg-kit-ios-full-gpl-latest/ffmpeg-kit-ios-full-gpl/6.0-80adc/libavformat.xcframework',
    'ffmpeg-kit-ios-full-gpl-latest/ffmpeg-kit-ios-full-gpl/6.0-80adc/libavfilter.xcframework',
    'ffmpeg-kit-ios-full-gpl-latest/ffmpeg-kit-ios-full-gpl/6.0-80adc/libavdevice.xcframework',
    'ffmpeg-kit-ios-full-gpl-latest/ffmpeg-kit-ios-full-gpl/6.0-80adc/libavcodec.xcframework',
    'ffmpeg-kit-ios-full-gpl-latest/ffmpeg-kit-ios-full-gpl/6.0-80adc/ffmpegkit.xcframework'
  ]

  # Exclude arm64 for simulator to avoid Xcode warnings
  s.pod_target_xcconfig = { 'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'arm64' }
end