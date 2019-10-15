defmodule DefinitelyNotDobble.RoomCoordinator do
  use GenServer

  ## Client API

  @doc """
  Starts the RoomCoordinator.
  """
  def start_link(opts) do
    GenServer.start_link(__MODULE__, :ok, opts)
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

  ## Defining GenServer Callbacks

  @impl true
  def init(:ok) do
    {:ok, %{}}
  end

  @impl true
  def handle_call({:lookup, name}, _from, names) do
    {:reply, Map.fetch(names, name), names}
  end

  @impl true
  def handle_cast({:create, name}, names) do
    if Map.has_key?(names, name) do
      {:noreply, names}
    else
      {:ok, room} = DefinitelyNotDobble.GameRoom.init([])
      {:noreply, Map.put(names, name, room)}
    end
  end
end
