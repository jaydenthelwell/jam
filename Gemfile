source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

# Use SQLite3 as the database for development and test
gem 'sqlite3', '~> 1.4'

ruby "3.2.2"
gem 'pg'
gem "devise"
gem "rails", "~> 7.0.7", ">= 7.0.7.2"

gem "sprockets-rails"
gem "puma", "~> 5.0"
gem "importmap-rails"
gem "turbo-rails"
gem "stimulus-rails"
gem "jbuilder"
gem "tzinfo-data", platforms: %i[ mingw mswin x64_mingw jruby ]
gem "bootsnap", require: false
gem "sassc-rails"
gem 'sidekiq'
gem 'thin'
gem "faker"
gem "rails-ujs"
gem "cloudinary"
gem "bootstrap", "~> 5.2"
gem "autoprefixer-rails"
gem "font-awesome-sass", "~> 6.1"
gem "simple_form", github: "heartcombo/simple_form"

group :development, :test do
  gem "debug", platforms: %i[ mri mingw x64_mingw ]
  gem "dotenv-rails"
  gem "web-console"
end

group :test do
  gem "capybara"
  gem "selenium-webdriver"
  gem "webdrivers"
end

group :production do
  gem 'redis', '~> 4.0'
end

gem "dockerfile-rails", ">= 1.6", :group => :development

gem "aws-sdk-s3", "~> 1.167", :require => false
