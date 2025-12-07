import React, { useState, useEffect, useRef } from 'react';

/**
 * ABEffortGame - A behavioral economics demo game
 * 
 * Users alternate pressing A and B keys as fast as possible for 15 seconds.
 * Two rounds: Round 1 (no incentive) and Round 2 (with incentive).
 * After both rounds, users can save their scores to a leaderboard.
 */
function ABEffortGame() {
  // Login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [nameInput, setNameInput] = useState('');
  
  // Game state
  const [currentRound, setCurrentRound] = useState(1); // 1 or 2
  const [isRoundActive, setIsRoundActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [score, setScore] = useState(0);
  const [previousKey, setPreviousKey] = useState(null); // 'A' or 'B' or null
  const [round1Score, setRound1Score] = useState(null);
  const [round2Score, setRound2Score] = useState(null);
  const [roundComplete, setRoundComplete] = useState(false);
  
  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState([]);
  const [scoreSaved, setScoreSaved] = useState(false);
  
  // Timer ref to ensure cleanup
  const timerRef = useRef(null);

  /**
   * Handles key press events during active rounds.
   * 
   * Alternation logic:
   * - Only A and B keys are valid (case-insensitive)
   * - Score increments only when the pressed key is different from the previous valid key
   * - A complete alternation (A→B or B→A) counts as 1 point
   * - The first key press doesn't count; we need a complete alternation to score
   * - Repeated keys (A→A or B→B) are ignored
   */
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!isRoundActive) return;
      
      const key = event.key.toUpperCase();
      
      // Only process A and B keys
      if (key !== 'A' && key !== 'B') return;
      
      // Check for valid alternation
      // Only increment if we have a previous key AND it's different (complete alternation)
      if (previousKey !== null && previousKey !== key) {
        // Valid alternation: increment score and update previous key
        setScore(prev => prev + 1);
        setPreviousKey(key);
      } else if (previousKey === null) {
        // First key press: just set previousKey, don't increment score
        setPreviousKey(key);
      }
      // If previousKey === key, it's a repeat, so we ignore it
    };

    if (isRoundActive) {
      window.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isRoundActive, previousKey]);

  /**
   * Timer management:
   * - Runs every second when round is active
   * - Decrements timeRemaining from 15 to 0
   * - When timer reaches 0, stops the round and saves the score
   * - Cleanup function ensures interval is cleared to prevent memory leaks
   */
  useEffect(() => {
    if (isRoundActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Timer reached 0, stop the round
            setIsRoundActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Clean up interval when round is not active
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRoundActive, timeRemaining]);

  /**
   * When round completes, save the score and mark round as complete
   */
  useEffect(() => {
    if (!isRoundActive && timeRemaining === 0 && !roundComplete) {
      if (currentRound === 1) {
        setRound1Score(score);
      } else if (currentRound === 2) {
        setRound2Score(score);
      }
      setRoundComplete(true);
    }
  }, [isRoundActive, timeRemaining, roundComplete, currentRound, score]);

  /**
   * Starts a new round
   */
  const startRound = () => {
    setIsRoundActive(true);
    setTimeRemaining(15);
    setScore(0);
    setPreviousKey(null);
    setRoundComplete(false);
  };

  /**
   * Moves to the next round
   */
  const continueToRound2 = () => {
    setCurrentRound(2);
    setIsRoundActive(false);
    setTimeRemaining(15);
    setScore(0);
    setPreviousKey(null);
    setRoundComplete(false);
  };

  /**
   * Login handler
   */
  const handleLogin = () => {
    if (nameInput.trim()) {
      setPlayerName(nameInput.trim());
      setIsLoggedIn(true);
    }
  };

  /**
   * Leaderboard management:
   * - Creates a new entry with name, round1Score, round2Score, and delta
   * - Entries are stored in component state
   * - Leaderboard is sorted by Round 2 score (descending) when displayed
   */
  const saveScore = () => {
    if (!playerName.trim() || round1Score === null || round2Score === null) {
      return;
    }

    const newEntry = {
      id: Date.now(), // Simple ID for React keys
      name: playerName.trim(),
      round1Score: round1Score,
      round2Score: round2Score,
      delta: round2Score - round1Score
    };

    setLeaderboard(prev => [...prev, newEntry]);
    setScoreSaved(true);
  };

  // Calculate delta for display
  const delta = round1Score !== null && round2Score !== null 
    ? round2Score - round1Score 
    : null;

  // Sort leaderboard by Round 2 score (descending)
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.round2Score - a.round2Score);

  // Determine if both rounds are complete
  const bothRoundsComplete = round1Score !== null && round2Score !== null;

  // Login screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
            A–B Effort Game
          </h1>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Enter your name
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }}
              autoFocus
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={!nameInput.trim()}
            className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          {/* Title */}
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
            A–B Effort Game
          </h1>
          <p className="text-center text-sm text-gray-600 mb-6">
            Playing as: <span className="font-semibold text-indigo-600">{playerName}</span>
          </p>

        {/* Instructions */}
        <div className="mb-6 text-center text-gray-700">
          <p className="mb-2">
            Press <span className="font-semibold">A</span> and <span className="font-semibold">B</span> alternately as fast as you can for 15 seconds.
          </p>
          <p className="text-sm text-gray-600">
            Only alternating presses count (A→B→A→B…).
          </p>
        </div>

        {/* Round indicator */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
          {currentRound === 1 ? (
            <p className="text-gray-700 font-medium">
              Round 1
            </p>
          ) : (
            <p className="text-gray-700 font-medium">
              Round 2 – The fastest can choose a prize.
            </p>
          )}
        </div>

        {/* Score display */}
        <div className="mb-6 text-center">
          <div className="text-6xl font-bold text-indigo-600 mb-2">
            {score}
          </div>
          <div className="text-lg text-gray-600">
            Alternations
          </div>
        </div>

        {/* Timer */}
        <div className="mb-6 text-center">
          <div className="text-3xl font-semibold text-gray-800">
            {timeRemaining}s
          </div>
        </div>

        {/* Round summary (shown when round completes) */}
        {roundComplete && (
          <div className="mb-6 p-4 bg-indigo-50 rounded-lg text-center">
            <p className="text-gray-800 font-medium mb-2">
              Finished with {currentRound === 1 ? round1Score : round2Score} alternations.
            </p>
            {currentRound === 2 && delta !== null && (
              <p className="text-gray-700">
                You {delta >= 0 ? 'increased' : 'decreased'} your effort by{' '}
                <span className={`font-semibold ${delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {delta >= 0 ? '+' : ''}{delta}
                </span>{' '}
                compared to Round 1
              </p>
            )}
          </div>
        )}

        {/* Control buttons */}
        <div className="mb-6 text-center">
          {!bothRoundsComplete && (
            <>
              {currentRound === 1 && !roundComplete && (
                <button
                  onClick={startRound}
                  disabled={isRoundActive}
                  className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Start
                </button>
              )}
              {currentRound === 1 && roundComplete && (
                <button
                  onClick={continueToRound2}
                  className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Continue
                </button>
              )}
              {currentRound === 2 && !roundComplete && (
                <button
                  onClick={startRound}
                  disabled={isRoundActive}
                  className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Start
                </button>
              )}
            </>
          )}
        </div>

        {/* Save score section (shown after both rounds complete) */}
        {bothRoundsComplete && !scoreSaved && (
          <div className="mt-8 border-t pt-8 text-center">
            <p className="text-gray-700 mb-4">
              Your final score: <span className="font-bold text-indigo-600">{round2Score}</span> alternations
            </p>
            <button
              onClick={saveScore}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Save My Score
            </button>
          </div>
        )}

        {bothRoundsComplete && scoreSaved && (
          <div className="mt-8 border-t pt-8 text-center">
            <p className="text-gray-700 font-medium mb-2">
              Your score has been saved!
            </p>
          </div>
        )}
      </div>

      {/* Separate Leaderboard section */}
      {leaderboard.length > 0 && (
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Leaderboard
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Rank</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Round 1</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Round 2</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Δ</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeaderboard.map((entry, index) => {
                  const isTop3 = index < 3;
                  return (
                    <tr
                      key={entry.id}
                      className={isTop3 ? 'bg-yellow-50 font-semibold' : ''}
                    >
                      <td className="border border-gray-300 px-4 py-2">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {entry.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {entry.round1Score}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {entry.round2Score}
                      </td>
                      <td className={`border border-gray-300 px-4 py-2 text-center ${
                        entry.delta >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {entry.delta >= 0 ? '+' : ''}{entry.delta}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ABEffortGame;

