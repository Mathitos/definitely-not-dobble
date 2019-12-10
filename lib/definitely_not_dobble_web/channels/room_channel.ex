defmodule DefinitelyNotDobbleWeb.RoomChannel do
  alias DefinitelyNotDobble.RoomCoordinator
  use DefinitelyNotDobbleWeb, :channel

  def join("room:" <> _room_id, _payload, socket) do
    {:ok, socket}
  end

  def handle_in("message", payload, socket) do
    broadcast(socket, "message", payload)
    {:noreply, socket}
  end
end
