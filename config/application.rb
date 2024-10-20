require_relative "boot"

require "rails/all"
Bundler.require(*Rails.groups)

module Jam
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    # Generators configuration
    config.generators do |generate|
      generate.assets false
      generate.helper false
      generate.test_framework :test_unit, fixture: false
    end

    # Time zone setting (uncomment and set your preferred time zone)
    # config.time_zone = "Central Time (US & Canada)"

    # Add additional eager load paths if needed
    # config.eager_load_paths << Rails.root.join("extras")
  end
end

# Sidekiq configuration
Sidekiq.configure_server do |config|
  config.redis = { url: ENV['REDIS_URL'] }
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV['REDIS_URL'] }
end
