require "rails"

module MuddaTheme
  # Puts app/assets/{stylesheets,fonts,images} on the host app's Propshaft load path, so the
  # theme's files resolve as mudda_theme/<file>, lets tailwindcss-rails find
  # app/assets/tailwind/mudda_theme/engine.css, and loads lib/tasks/ into the host's rake.
  class Engine < ::Rails::Engine
    engine_name "mudda_theme"

    # Propshaft adds every folder under app/assets, but app/assets/tailwind is Tailwind source that
    # only the Tailwind build reads, so it stays out of the published assets.
    initializer "mudda_theme.exclude_tailwind_source" do |app|
      if app.config.respond_to?(:assets) && app.config.assets.respond_to?(:excluded_paths)
        app.config.assets.excluded_paths << root.join("app/assets/tailwind")
      end
    end
  end
end
