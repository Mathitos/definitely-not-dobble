defmodule DefinitelyNotDobbleWeb.RoomChannel do
  alias DefinitelyNotDobble.RoomCoordinator
  use DefinitelyNotDobbleWeb, :channel

  def join("room:" <> room_id, _payload, socket) do
    {:ok, room_pid} = RoomCoordinator.getsert(room_id)
    socket = assign(socket, :room_pid, room_pid)

    {:ok, socket}
  end

  def handle_in("message", payload, socket) do
    broadcast(socket, "message", payload)
    {:noreply, socket}
  end
end
