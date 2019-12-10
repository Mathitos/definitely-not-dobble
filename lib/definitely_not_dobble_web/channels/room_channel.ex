defmodule DefinitelyNotDobbleWeb.RoomChannel do
  alias DefinitelyNotDobble.RoomCoordinator
  alias DefinitelyNotDobble.GameRoom
  use DefinitelyNotDobbleWeb, :channel

  def join("room:" <> room_id, payload, socket) do
    {:ok, room_pid} = RoomCoordinator.getsert(room_id)
    user = %{id: System.unique_integer([:positive, :monotonic]), name: payload["name"]}
    socket = assign(socket, :room_pid, room_pid)
    socket = assign(socket, :user, user)

    GameRoom.join(room_pid, user.name)
    send(self(), :after_join)

    {:ok, socket}
  end

  def handle_info(:after_join, socket) do
    game_state = GameRoom.get_cards(socket.assigns.room_pid)
    broadcast(socket, "game_state_update", %{game_state: game_state})
    {:noreply, socket}
  end

  def handle_in("message", payload, socket) do
    broadcast(socket, "message", %{text: payload["text"], user_name: socket.assigns.user.name})

    {:noreply, socket}
  end

  def handle_in("get_game_state", _payload, socket) do
    game_state = GameRoom.get_cards(socket.assigns.room_pid)

    {:reply, {:ok, %{game_state: game_state}}, socket}
  end

  def handle_in("guess", payload, socket) do
    IO.inspect(payload)
    game_state = GameRoom.get_cards(socket.assigns.room_pid)
    broadcast(socket, "game_state", %{game_state: game_state})

    {:noreply, socket}
  end
end
