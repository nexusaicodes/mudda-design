require "test_helper"
require "tmpdir"

class FilesTest < Minitest::Test
  def test_every_font_face_points_at_a_shipped_file
    urls = File.read(File.join(MuddaTheme::STYLESHEETS, "fonts.css")).scan(%r{url\("/mudda_theme/([^"]+)"\)}).flatten
    assert_equal 19, urls.size
    assert_equal Dir.children(MuddaTheme::FONTS).sort, urls.uniq.sort
  end

  def test_font_path
    assert File.file?(MuddaTheme.font_path("amiri-latin-700-normal.woff2"))
    assert_raises(ArgumentError) { MuddaTheme.font_path("../tokens.css") }
  end

  def test_stale_static_files
    Dir.mktmpdir do |dir|
      assert_equal MuddaTheme::STATIC_FILES, MuddaTheme.stale_static_files(dir)

      MuddaTheme::STATIC_FILES.each { |file| FileUtils.cp(MuddaTheme.static_source(file), dir) }
      assert_empty MuddaTheme.stale_static_files(dir)

      File.write(File.join(dir, "dark.css"), "/* old */")
      assert_equal %w[ dark.css ], MuddaTheme.stale_static_files(dir)
    end
  end

  def test_every_static_file_exists
    MuddaTheme::STATIC_FILES.each { |file| assert File.file?(MuddaTheme.static_source(file)), file }
  end
end
