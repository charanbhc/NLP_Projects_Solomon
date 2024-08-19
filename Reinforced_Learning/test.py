
# Global variables for the game and agent
env = TicTacToe()
agent = QLearningAgent()

# API route for playing Tic-Tac-Toe against the trained agent
@app.route('/AI-API/xox', methods=['POST'])
def play_tic_tac_toe():
    data = request.get_json()
    human_move = data.get('move')

    if human_move is None or not env.is_valid_move(human_move):
        return jsonify({"message": "Invalid move. Please enter a valid position (0-8)."}), 400
    
    # Human player's move
    env.make_move(human_move)
    
    # Check if the game is done after human's move
    if env.done:
        return jsonify({"board": env.board, "message": "Game over!", "winner": env.winner}), 200
    
    # AI agent's move
    state = env.get_state()
    valid_moves = env.get_valid_moves()
    ai_move = agent.choose_action(state, valid_moves)
    env.make_move(ai_move)

    # Check if the game is done after AI's move
    if env.done:
        return jsonify({"board": env.board, "message": "Game over!", "winner": env.winner}), 200

    # If game is not over, return current board state
    return jsonify({"board": env.board, "message": "Your move!", "current_player": env.current_player}), 200
