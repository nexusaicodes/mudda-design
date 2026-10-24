namespace :mudda_theme do
  desc "Copy the token files, favicon and mark to public/mudda-theme/ for the static error pages"
  task :sync_static do
    target = File.join(Rails.root, "public/mudda-theme")
    FileUtils.mkdir_p(target)
    MuddaTheme::STATIC_FILES.each do |file|
      FileUtils.cp(MuddaTheme.static_source(file), File.join(target, file))
      puts "public/mudda-theme/#{file}"
    end
  end
end
