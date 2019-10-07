defmodule DefinitelyNotDobble.Repo do
  use Ecto.Repo,
    otp_app: :definitely_not_dobble,
    adapter: Ecto.Adapters.Postgres
end
