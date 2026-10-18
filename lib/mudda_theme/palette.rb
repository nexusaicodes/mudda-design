module MuddaTheme
  # The colour tokens as Ruby values, for places CSS variables can't reach: inline mailer styles,
  # generated SVGs. They are read from tokens.css and dark.css, so the CSS stays the one source.
  module Palette
    TOKEN = /--(?<name>[a-z0-9-]+):\s*(?<value>[^;]+);/

    def self.read(file, scope = nil)
      css = File.read(File.expand_path("../../app/assets/stylesheets/mudda_theme/#{file}", __dir__))
      css = css[/#{Regexp.escape(scope)}\s*\{(.*?)\}/m, 1] if scope
      css.scan(TOKEN).to_h { |name, value| [ name.tr("-", "_").to_sym, value.strip ] }
        .reject { |name, _| name.start_with?("face_") || name == :corner }
        .freeze
    end
  end

  PALETTE = {
    light: Palette.read("tokens.css"),
    dark: Palette.read("dark.css", ':root[data-theme="dark"]')
  }.freeze

  # The four inks that mark the paper, darkest first, as upper-case hex: avatar fills and the like.
  INKS = PALETTE[:light].values_at(:ink, :ink_muted, :brass, :vermilion).map(&:upcase).freeze
end
