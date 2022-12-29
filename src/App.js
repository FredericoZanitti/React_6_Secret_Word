//CSS
import './App.css';

//React
import { useCallback, useEffect, useState } from "react";

//Data
import { wordsList } from './data/words';

//Components
import Game from './components/Game';
import GameOver from './components/GameOver';
import StartScreen from './components/StartScreen';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" }
]

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWords, setPickedWords] = useState("");
  const [pickedCategories, setPickCategories] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    //pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    //pick a randm word
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);

  // start game
  const startGame = useCallback(() => {
    clearLettersState();

    // pick word and category
    const { word, category } = pickWordAndCategory();

    // create an array of letters
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toUpperCase());

    //fill states
    setPickedWords(word);
    setPickCategories(category);
    setLetters(wordLetters);
    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // process the letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toUpperCase();

    //verificar se letras já foram utilizadas
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }

    //adicionar ou remover letras tentadas
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [...actualGuessedLetters, normalizedLetter,]);
    } else {
      setWrongLetters((actualWrongLetters) => [...actualWrongLetters, normalizedLetter,]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    };
  }

  const clearLettersState = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  // verificar condição de derrota
  useEffect(() => {
    if (guesses <= 0) {
      //reset all stages
      clearLettersState();

      setGameStage(stages[2].name)
    }
  }, [guesses])

  // verificar condição de vitória
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]
    if (guessedLetters.length === uniqueLetters.length) {
      setScore((actualScore) => actualScore + 100);
      //reseta o jogo
      startGame();
    }

  }, [guessedLetters, letters, startGame])

  // restarts the game
  const retry = () => {
    setScore(0);
    setGuesses(3);
    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWords={pickedWords}
          pickedCategories={pickedCategories}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score} /
        >)}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
