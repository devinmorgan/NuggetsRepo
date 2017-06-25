require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module NuggetsRepo
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Tell Ruby to search for assets lib/assets and vendor/assets too
    # config.assets.paths << Rails.root.join("lib", "assets")
    # config.assets.paths << Rails.root.join("vendor", "assets")
  end
end
