# config/initializers/redis.rb
require 'redis'

# Disable SSL certificate verification (not recommended for production)
$redis = Redis.new(url: ENV['REDIS_TLS_URL'], ssl: { verify_mode: OpenSSL::SSL::VERIFY_NONE })

# Or if you're using a Redis namespace:
# $redis = Redis::Namespace.new(redis_config['namespace'], redis: Redis.new(url: redis_config['url']))
