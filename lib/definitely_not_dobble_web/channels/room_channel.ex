defmodule DefinitelyNotDobbleWeb.RoomChannel do
  alias DefinitelyNotDobble.RoomCoordinator
  alias DefinitelyNotDobble.GameRoom
  use DefinitelyNotDobbleWeb, :channel

  def join("room:" <> room_id, payload, socket) do
    {:ok, room_pid} = RoomCoordinator.getsert(room_id)
    new_id = System.unique_integer([:positive, :monotonic])
    user = %{id: new_id, name: payload["name"]}
    socket = assign(socket, :room_pid, room_pid)
    socket = assign(socket, :user, user)

    GameRoom.join(room_pid, user)
    send(self(), :after_join)

    {:ok, %{id: new_id}, socket}
  end

  def handle_info(:after_join, socket) do
    {:ok, game_state} = GameRoom.get_room_state(socket.assigns.room_pid)
    broadcast(socket, "game_state_update", %{game_state: game_state})
    {:noreply, socket}
  end

  def handle_in("message", payload, socket) do
    broadcast(socket, "message", %{text: payload["text"], user_name: socket.assigns.user.name})

    {:noreply, socket}
  end

  def handle_in("get_game_state", _payload, socket) do
    {:ok, game_state} = GameRoom.get_room_state(socket.assigns.room_pid)

    {:reply, {:ok, %{game_state: game_state}}, socket}
  end

  def handle_in("guess", payload, socket) do
    with true <- Map.has_key?(payload, "number"),
         room_pid <- socket.assigns.room_pid,
         user <- socket.assigns.user,
         guess_number <- Map.get(payload, "number"),
         {:right, new_game_state} <- GameRoom.guess(room_pid, user, guess_number) do
      broadcast(socket, "game_state_update", %{game_state: new_game_state})
      {:reply, {:ok, %{response: "right"}}, socket}
    else
      _ -> {:reply, {:ok, %{response: "wrong"}}, socket}
    end
  end
end
