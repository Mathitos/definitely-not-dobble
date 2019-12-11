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

  @server_state %{user: @server_user, card: @server_card, cooldown: false}
  @user1_state %{user: @user1, card: @user1_card, cooldown: false}
  @user2_state %{user: @user2, card: @user2_card, cooldown: false}

  @game_state [
    @server_state,
    @user1_state,
    @user2_state
  ]

  describe "get_current_cards/1" do
    test "get_current_cards" do
      current_cards = get_current_cards(@game_state)
      assert @server_card in current_cards
      assert @user1_card in current_cards
      assert @user2_card in current_cards
    end
  end

  describe "generate_new_card/1" do
    test "generate_new_card" do
      new_card = generate_new_card(@game_state)

      assert @server_card != new_card
      assert @user1_card != new_card
      assert @user2_card != new_card
    end
  end

  describe "add_new_player/2" do
    test "add_new_player" do
      game_state = [%{user: @server_user, card: @server_card, cooldown: false}]
      new_game_state = add_new_player(@user1, game_state)

      assert Enum.find(new_game_state, fn player -> player.user == @user1 end) != nil
    end
  end

  describe "guess/3" do
    test "wrong guess should return :wrong" do
      {result, _} = guess(@user1, 17, @game_state)
      assert :wrong == result
    end

    test "guessing a number server dont have should return :wrong" do
      {result, _} = guess(@user1, 9, @game_state)
      assert :wrong == result
    end

    test "guessing right should return :right" do
      {result, _} = guess(@user1, 00, @game_state)
      assert :right == result
    end

    test "guessing right should update game state" do
      {_, new_game_state} = guess(@user1, 00, @game_state)
      new_player_state = Enum.find(new_game_state, fn player -> player.user == @user1 end)
      new_server_state = Enum.find(new_game_state, fn player -> player.user == @server_user end)
      assert new_player_state != @user1_state
      assert new_server_state != @server_state
      assert @user2_state in new_game_state
    end
  end

  describe "init_room/0" do
    test "initial state has only the server player" do
      new_game_state = init_room()

      assert Enum.find(new_game_state, fn player -> player.user == @server_user end) != nil
      assert length(new_game_state) == 1
    end
  end
end
