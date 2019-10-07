# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :definitely_not_dobble,
  ecto_repos: [DefinitelyNotDobble.Repo]

# Configures the endpoint
config :definitely_not_dobble, DefinitelyNotDobbleWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "Dvd6fivWSdgsY66ay2WNj/Z2F8wkPBJsDayQHBNaGYJdQhCgJsMc2nNm1UgLKUvh",
  render_errors: [view: DefinitelyNotDobbleWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: DefinitelyNotDobble.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
