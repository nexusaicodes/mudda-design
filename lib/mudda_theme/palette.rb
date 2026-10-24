require "json"

module MuddaTheme
  # The colour roles as Ruby values, for places CSS variables can't reach: inline mailer styles,
  # generated SVGs. scripts/build.mjs writes palette.json from tokens/*.json, the same source as
  # tokens.css and dark.css.
  module Palette
    FILE = File.expand_path("palette.json", __dir__)

    def self.read(scheme)
      JSON.parse(File.read(FILE)).fetch(scheme.to_s) { raise ArgumentError, "mudda-theme: palette.json has no #{scheme} scheme" }
        .to_h { |name, value| [ name.tr("-", "_").to_sym, value ] }
        .freeze
    end
  end

  PALETTE = {
    light: Palette.read(:light),
    dark: Palette.read(:dark)
  }.freeze

  # The four inks that mark the paper, as upper-case hex: navy, slate, brass, vermilion. For avatar
  # fills and the like; every one is at least 4:1 on paper.
  INKS = PALETTE[:light].values_at(:ink, :ink_muted, :brass, :vermilion).map(&:upcase).freeze
end
