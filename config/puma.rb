# config/puma.rb

# Set threads to 1 for both minimum and maximum to avoid multi-threading issues
threads_count = ENV.fetch("RAILS_MAX_THREADS") { 1 }
threads threads_count, threads_count

# Set workers to 0 to avoid cluster mode in development
workers 0

# Preload app to optimize memory usage (useful if you decide to use workers in the future)
preload_app!

# Puma will listen on port 3000 by default, no need to change unless necessary
port ENV.fetch("PORT") { 3000 }

# Use the appropriate Rails environment; can be 'development' or 'production'
environment ENV.fetch("RAILS_ENV") { "development" }

# Specify a pidfile to store the process ID for Puma
pidfile ENV.fetch("PIDFILE") { "tmp/pids/server.pid" }

# Allow Puma to be restarted via the `rails restart` command
plugin :tmp_restart
