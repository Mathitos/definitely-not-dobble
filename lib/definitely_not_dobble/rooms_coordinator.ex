defmodule DefinitelyNotDobble.RoomCoordinator do
  use GenServer

  ## Client API

  def start_link(opts) do
    GenServer.start_link(__MODULE__, :ok, opts)
  end

  def lookup(name) do
    GenServer.call(:room_coordinator, {:lookup, name})
  end

  def create(name) do
    GenServer.cast(:room_coordinator, {:create, name})
  end

  def getsert(name) do
    create(name)
    lookup(name)
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
      {:ok, room} = DefinitelyNotDobble.GameRoom.start_link([])
      {:noreply, Map.put(names, name, room)}
    end
  end
end
