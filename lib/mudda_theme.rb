require "mudda_theme/version"
require "mudda_theme/palette"
require "mudda_theme/engine"

module MuddaTheme
  ROOT = File.expand_path("..", __dir__)
  STYLESHEETS = File.join(ROOT, "app/assets/stylesheets/mudda_theme")
  FONTS = File.join(ROOT, "app/assets/fonts/mudda_theme")
  IMAGES = File.join(ROOT, "app/assets/images/mudda_theme")

  # What public/ pages, served without the asset pipeline, link: the self-contained token files,
  # the favicon and the mark. mudda_theme:sync_static copies them to public/mudda-theme/.
  STATIC_FILES = %w[ tokens.css dark.css favicon.ico mark.svg ].freeze

  # The absolute path of one of the theme's font files, for embedding (an SVG's @font-face).
  def self.font_path(file)
    path = File.join(FONTS, file)
    raise ArgumentError, "mudda-theme has no font #{file}" unless File.basename(file) == file && File.file?(path)

    path
  end

  # Where the gem keeps one of the STATIC_FILES.
  def self.static_source(file)
    File.join(file.end_with?(".css") ? STYLESHEETS : IMAGES, file)
  end

  # The static files under dir (public/mudda-theme) that are missing or differ from the gem's, so
  # an app's test can catch a theme bump without a re-sync.
  def self.stale_static_files(dir)
    STATIC_FILES.reject do |file|
      copy = File.join(dir, file)
      File.file?(copy) && File.binread(copy) == File.binread(static_source(file))
    end
  end
end
