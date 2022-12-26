//CSS
import './App.css';

//React
import { useState } from "react";

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

  const pickWordAndCategory = () => {
    //pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    //pick a randm word
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }

  // start game
  const startGame = () => {
    // pick word and category
    const { word, category } = pickWordAndCategory();

    // create an array of letters
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toUpperCase());
    console.log(wordLetters)

    //fill states
    setPickedWords(word);
    setPickCategories(category);
    setLetters(letters);
    setGameStage(stages[1].name);
  }

  // process the letter input
  const verifyLetter = () => {
    setGameStage(stages[2].name)
  }

  // restarts the game
  const retry = () => {
    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && <Game verifyLetter={verifyLetter} />}
      {gameStage === "end" && <GameOver retry={retry} />}
    </div>
  );
}

export default App;
