require "test_helper"
require "rails"
require "action_controller/railtie"
require "propshaft"

# A bare Rails app with the engine loaded, to prove the host's Propshaft finds the theme's files.
class DummyApp < Rails::Application
  config.root = File.expand_path("dummy", __dir__)
  config.eager_load = false
  config.logger = Logger.new(nil)
  config.secret_key_base = "test"
end
DummyApp.initialize!

class AssetsTest < Minitest::Test
  def assembly
    Rails.application.assets
  end

  def test_stylesheets_resolve
    %w[ tokens dark fonts base ].each do |name|
      assert assembly.load_path.find("mudda_theme/#{name}.css"), "mudda_theme/#{name}.css"
    end
  end

  def test_font_urls_compile_to_digested_paths
    css = assembly.compilers.compile(assembly.load_path.find("mudda_theme/fonts.css"))
    urls = css.scan(/url\("([^"]+)"\)/).flatten

    assert_equal 18, urls.size
    urls.each { |url| assert_match %r{\A/assets/mudda_theme/[a-z0-9-]+-[a-zA-Z0-9]{8}\.woff2\z}, url }
  end

  def test_tailwind_entry_is_where_tailwindcss_rails_looks
    engine = MuddaTheme::Engine
    assert_equal "mudda_theme", engine.engine_name
    assert engine.root.join("app/assets/tailwind/mudda_theme/engine.css").file?
  end

  def test_tailwind_source_is_not_published
    assert_nil assembly.load_path.find("mudda_theme/engine.css")
  end
end
