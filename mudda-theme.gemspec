require_relative "lib/mudda_theme/version"

Gem::Specification.new do |spec|
  spec.name = "mudda-theme"
  spec.version = MuddaTheme::VERSION
  spec.authors = [ "Nexus AI" ]
  spec.summary = "The manuscript look shared by Mudda's apps: tokens, fonts and a daisyUI adapter."
  spec.homepage = "https://github.com/nexusaicodes/mudda-theme"
  spec.license = "MIT"
  spec.required_ruby_version = ">= 3.2"

  spec.files = Dir["app/**/*", "lib/**/*", "licenses/*", "README.md", "CHANGELOG.md", "LICENSE"]
  spec.require_paths = [ "lib" ]

  spec.add_dependency "railties", ">= 7.1"
end
