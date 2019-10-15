defmodule DefinitelyNotDobble.GameRoom do
  use GenServer

  ## Client API

  @doc """
  Starts the GameRoom.
  """
  def start_link(name, opts) do
    GenServer.start_link(__MODULE__, name, opts)
  end

  @doc """
  Looks up the room pid for `name` stored in `server`.

  Returns `{:ok, pid}` if the room exists, `:error` otherwise.
  """
  def lookup(server, name) do
    GenServer.call(server, {:lookup, name})
  end

  @doc """
  Ensures there is a room associated with the given `name` in `server`.
  """
  def create(server, name) do
    GenServer.cast(server, {:create, name})
  end

  # Callbacks

  @impl true
  def init(name) do
    {:ok,
     [
       %{player: name, images: [1, 2, 3], cooldown: false},
       %{player: "server", images: [1, 4, 5]},
       cooldown: false
     ]}
  end

  @impl true
  def handle_call(%{:guess, name, image}, _from, list) do
    with server <- Enum.find(list, &(&1.player == "server"),
        true <- image in server.images do
      {:reply,"found", list}
    else
      {:reply, "wrong guess", list}
    end




  end
end
