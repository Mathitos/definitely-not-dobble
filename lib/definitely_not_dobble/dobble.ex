defmodule DefinitelyNotDobble.Dobble do
  @all_possible_cards [
    [00, 01, 02, 03, 04, 05, 06, 07, 08],
    [00, 09, 10, 11, 12, 13, 14, 15, 16],
    [00, 17, 18, 19, 20, 21, 22, 23, 24],
    [00, 25, 26, 27, 28, 29, 30, 31, 32],
    [00, 33, 34, 35, 36, 37, 38, 39, 40],
    [00, 41, 42, 43, 44, 45, 46, 47, 48]
  ]
  def get_current_cards(game_state) do
    Enum.map(game_state, fn player -> player.images end)
  end

  def generate_new_card(game_state) do
    list_of_candidates = Enum.shuffle(@all_possible_cards)
    current_cards = get_current_cards(game_state)
    Enum.find(list_of_candidates, fn candidate -> !Enum.member?(current_cards, candidate) end)
  end

  def add_new_player(user, game_state) do
    user_card = generate_new_card(game_state)
    [%{player: user, images: user_card, cooldown: false} | game_state]
  end

  def guess(_user, _image, game_state) do
    {:wrong, game_state}
  end
end
