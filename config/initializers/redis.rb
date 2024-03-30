# config/initializers/redis.rb
require 'redis'

# Disable SSL certificate verification (not recommended for production)
Redis.current = Redis.new(url: ENV['REDIS_TLS_URL'], ssl: { verify_mode: OpenSSL::SSL::VERIFY_NONE })
