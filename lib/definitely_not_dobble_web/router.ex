defmodule DefinitelyNotDobbleWeb.Router do
  use DefinitelyNotDobbleWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", DefinitelyNotDobbleWeb do
    pipe_through :api
  end

  scope "/", DefinitelyNotDobbleWeb do
    pipe_through :browser

    get "/*path", PageController, :index
  end
end
