namespace :mudda_theme do
  desc "Copy the self-contained token files to public/mudda-theme/ for the static error pages"
  task :sync_static do
    target = File.join(Rails.root, "public/mudda-theme")
    FileUtils.mkdir_p(target)
    MuddaTheme::STATIC_FILES.each do |file|
      FileUtils.cp(File.join(MuddaTheme::STYLESHEETS, file), File.join(target, file))
      puts "public/mudda-theme/#{file}"
    end
  end
end
