defmodule DefinitelyNotDobble.GameRoom do
  alias DefinitelyNotDobble.Dobble
  use GenServer

  ## Client API

  def start_link(opts) do
    GenServer.start_link(__MODULE__, opts)
  end

  def join(room, user) do
    GenServer.call(room, {:join, user})
  end

  def guess(room, user, image) do
    GenServer.call(room, {:guess, user, image})
  end

  def get_room_state(room) do
    GenServer.call(room, {:get_room_state})
  end

  # Callbacks

  @impl true
  def init(_) do
    {:ok, Dobble.init_room()}
  end

  @impl true
  def handle_call({:guess, user, image}, _from, room_state) do
    with {:right, new_room_state} <- Dobble.guess(user, image, room_state) do
      {:reply, {:right, new_room_state}, new_room_state}
    else
      _ -> {:reply, {:wrong, room_state}, room_state}
    end
  end

  @impl true
  def handle_call({:join, user}, _from, game_state) do
    new_game_state = Dobble.add_new_player(user, game_state)
    {:reply, {:ok, new_game_state}, new_game_state}
  end

  @impl true
  def handle_call({:get_room_state}, _from, game_state) do
    {:reply, {:ok, game_state}, game_state}
  end
end
