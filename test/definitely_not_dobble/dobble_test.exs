defmodule DefinitelyNotDobble.DobbleTest do
  import DefinitelyNotDobble.Dobble
  use ExUnit.Case, async: true

  @server_user %{
    id: 0,
    name: "server"
  }
  @user1 %{
    id: 1,
    name: "matheus1"
  }
  @user2 %{
    id: 2,
    name: "matheus2"
  }

  @server_card [00, 17, 18, 19, 20, 21, 22, 23, 24]
  @user1_card [00, 09, 10, 11, 12, 13, 14, 15, 16]
  @user2_card [00, 01, 02, 03, 04, 05, 06, 07, 08]

  @game_state [
    %{user: @user2, card: @user2_card, cooldown: false},
    %{user: @user1, card: @user1_card, cooldown: false},
    %{user: @server_user, card: @server_card, cooldown: false}
  ]

  test "get_current_cards" do
    current_cards = get_current_cards(@game_state)
    assert @server_card in current_cards
    assert @user1_card in current_cards
    assert @user2_card in current_cards
  end

  test "generate_new_card" do
    new_card = generate_new_card(@game_state)

    assert @server_card != new_card
    assert @user1_card != new_card
    assert @user2_card != new_card
  end
end
