require "test_helper"

class PaletteTest < Minitest::Test
  ROLES = %i[ paper paper_200 paper_300 ink ink_muted brass brass_fill vermilion hairline ].freeze
  DECLARATION = /--(?<name>[a-z0-9-]+):\s*(?<value>[^;]+);/

  def test_light_and_dark_define_the_same_roles
    assert_equal ROLES, MuddaTheme::PALETTE[:light].keys
    assert_equal ROLES, MuddaTheme::PALETTE[:dark].keys
  end

  def test_light_values
    assert_equal "#f1e6ce", MuddaTheme::PALETTE[:light][:paper]
    assert_equal "#1b2a4a", MuddaTheme::PALETTE[:light][:ink]
  end

  def test_tokens_css_carries_the_light_palette
    assert_equal MuddaTheme::PALETTE[:light], colours(css("tokens.css"))
  end

  def test_both_dark_blocks_carry_the_dark_palette
    dark = css("dark.css")
    assert_equal MuddaTheme::PALETTE[:dark], colours(dark[/:root:not\(\[data-theme="light"\]\)\s*\{(.*?)\}/m, 1])
    assert_equal MuddaTheme::PALETTE[:dark], colours(dark[/:root\[data-theme="dark"\]\s*\{(.*?)\}/m, 1])
  end

  def test_a_missing_scheme_is_named
    error = assert_raises(ArgumentError) { MuddaTheme::Palette.read(:sepia) }
    assert_match "sepia", error.message
  end

  def test_inks
    assert_equal %w[ #1B2A4A #46536E #8C6A2E #B3341C ], MuddaTheme::INKS
  end

  private
    def css(file)
      File.read(File.join(MuddaTheme::STYLESHEETS, file))
    end

    def colours(css)
      css.scan(DECLARATION).to_h { |name, value| [ name.tr("-", "_").to_sym, value.strip ] }.slice(*ROLES)
    end
end
