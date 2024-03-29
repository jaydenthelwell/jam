# config/initializers/redis.rb
require 'redis'

Redis.current = Redis.new(url: ENV['REDIS_TLS_URL'], ssl: { verify_mode: OpenSSL::SSL::VERIFY_NONE })
