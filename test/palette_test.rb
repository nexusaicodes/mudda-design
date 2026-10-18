require "test_helper"

class PaletteTest < Minitest::Test
  ROLES = %i[ paper paper_200 paper_300 ink ink_muted brass vermilion hairline ].freeze

  def test_light_and_dark_define_the_same_roles
    assert_equal ROLES, MuddaTheme::PALETTE[:light].keys
    assert_equal ROLES, MuddaTheme::PALETTE[:dark].keys
  end

  def test_light_values
    assert_equal "#f1e6ce", MuddaTheme::PALETTE[:light][:paper]
    assert_equal "#1b2a4a", MuddaTheme::PALETTE[:light][:ink]
  end

  def test_both_dark_blocks_hold_the_same_values
    media = MuddaTheme::Palette.read("dark.css", ':root:not([data-theme="light"])')
    assert_equal MuddaTheme::PALETTE[:dark], media
  end

  def test_inks
    assert_equal %w[ #1B2A4A #46536E #8C6A2E #B3341C ], MuddaTheme::INKS
  end
end
