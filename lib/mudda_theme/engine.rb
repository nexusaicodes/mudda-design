require "rails"

module MuddaTheme
  # Puts app/assets/{stylesheets,fonts} on the host app's Propshaft load path, so the theme's
  # files resolve as mudda_theme/<file>, lets tailwindcss-rails find
  # app/assets/tailwind/mudda_theme/engine.css, and loads lib/tasks/ into the host's rake.
  class Engine < ::Rails::Engine
    engine_name "mudda_theme"
  end
end
