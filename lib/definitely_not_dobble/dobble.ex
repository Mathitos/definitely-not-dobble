defmodule DefinitelyNotDobble.Dobble do
  @server_user %{
    id: 0,
    name: "server"
  }

  @all_possible_cards [
    [00, 01, 02, 03, 04, 05, 06, 07, 08],
    [00, 09, 10, 11, 12, 13, 14, 15, 16],
    [00, 17, 18, 19, 20, 21, 22, 23, 24],
    [00, 25, 26, 27, 28, 29, 30, 31, 32],
    [00, 33, 34, 35, 36, 37, 38, 39, 40],
    [00, 41, 42, 43, 44, 45, 46, 47, 48]
  ]
  def init_room() do
    [
      %{user: @server_user, card: generate_new_card(), cooldown: false}
    ]
  end

  def get_current_cards(game_state) do
    Enum.map(game_state, fn player -> player.card end)
  end

  def get_server_card(game_state) do
    player =
      Enum.find(game_state, fn player -> player.user.name == "server" && player.user.id == 0 end)

    player.card
  end

  def get_player_card(user, game_state) do
    player = Enum.find(game_state, fn player -> player.user == user end)
    player.card
  end

  def generate_new_card() do
    list_of_candidates = Enum.shuffle(@all_possible_cards)
    List.first(list_of_candidates)
  end

  def generate_new_card(game_state) do
    list_of_candidates = Enum.shuffle(@all_possible_cards)
    current_cards = get_current_cards(game_state)
    Enum.find(list_of_candidates, fn candidate -> !Enum.member?(current_cards, candidate) end)
  end

  def add_new_player(user, game_state) do
    user_card = generate_new_card(game_state)
    [%{user: user, card: user_card, cooldown: false} | game_state]
  end

  def guess(user, image, game_state) do
    with server_card <- get_server_card(game_state),
         player_card <- get_player_card(user, game_state),
         true <- image in server_card,
         true <- image in player_card do
      new_card = generate_new_card(game_state)

      new_game_state =
        Enum.map(game_state, fn player ->
          case player.user do
            ^user -> %{user: user, card: server_card, cooldown: false}
            %{name: "server", id: 0} -> %{user: player.user, card: new_card, cooldown: false}
            _ -> player
          end
        end)

      {:right, new_game_state}
    else
      _ -> {:wrong, game_state}
    end
  end
end