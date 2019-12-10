defmodule DefinitelyNotDobbleWeb.RoomChannel do
  alias DefinitelyNotDobble.RoomCoordinator
  alias DefinitelyNotDobble.GameRoom
  use DefinitelyNotDobbleWeb, :channel

  def join("room:" <> room_id, payload, socket) do
    {:ok, room_pid} = RoomCoordinator.getsert(room_id)
    socket = assign(socket, :room_pid, room_pid)
    socket = assign(socket, :user_name, payload["name"])

    {:ok, socket}
  end

  def handle_in("message", payload, socket) do
    broadcast(socket, "message", %{text: payload["text"], user_name: socket.assigns.user_name})

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
