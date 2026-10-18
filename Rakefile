require "rake/testtask"

Rake::TestTask.new(:test) do |t|
  t.libs << "test" << "lib"
  t.test_files = FileList["test/**/*_test.rb"]
end

desc "Check every text/background pair in the light and dark palettes against WCAG AA"
task :contrast do
  ruby "bin/check-contrast"
end

task default: %i[ test contrast ]
