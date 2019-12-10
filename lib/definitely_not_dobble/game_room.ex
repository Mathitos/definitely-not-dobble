defmodule DefinitelyNotDobble.GameRoom do
  use GenServer

  ## Client API

  def start_link(opts) do
    GenServer.start_link(__MODULE__, opts)
  end

  def join(room, name) do
    GenServer.call(room, {:join, name})
  end

  def guess(room, name, image) do
    GenServer.call(room, {:guess, name, image})
  end

  def get_cards(room) do
    GenServer.call(room, {:get_cards})
  end

  # Callbacks

  @impl true
  def init(_) do
    {:ok,
     [
       %{player: "server", images: [1, 4, 5], cooldown: false}
     ]}
  end

  @impl true
  def handle_call({:guess, _name, image}, _from, list) do
    with server <- Enum.find(list, &(&1.player == "server")),
         true <- image in server.images do
      {:reply, "found", list}
    else
      _ -> {:reply, "wrong guess", list}
    end
  end

  @impl true
  def handle_call({:join, name}, _from, list) do
    new_list = [%{player: name, images: [1, 2, 3], cooldown: false} | list]
    {:reply, new_list, new_list}
  end

  @impl true
  def handle_call({:get_cards}, _from, list) do
    {:reply, list, list}
  end
end
