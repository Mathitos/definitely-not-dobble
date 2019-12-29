defmodule DefinitelyNotDobbleWeb.Router do
  use DefinitelyNotDobbleWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", DefinitelyNotDobbleWeb do
    pipe_through :api
  end
end
