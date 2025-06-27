import { useState } from "react";

export default function TriviaApp() {
  const [formData, setFormData] = useState({
    textInput: '',
    category: '',
    difficulty: ''
  });

  const [trivia, setTrivia] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const categoryMap = {
    History: 23,
    Art: 25,
    Animals: 27,
    Sports: 21
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const shuffleAnswers = (correct, incorrect) => {
    const allAnswers = [...incorrect, correct];
    return allAnswers.sort(() => Math.random() - 0.5);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTrivia([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowAnswer(false);

    const categoryId = categoryMap[formData.category];
    const difficulty = formData.difficulty;

    const url = `https://opentdb.com/api.php?amount=10${categoryId ? `&category=${categoryId}` : ''}${difficulty ? `&difficulty=${difficulty}` : ''}&type=multiple`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const questions = data.results.map((item, idx) => ({
        ...item,
        id: idx + 1,
        answers: shuffleAnswers(item.correct_answer, item.incorrect_answers)
      }));
      setTrivia(questions);
    } catch (err) {
      console.error("Error fetching trivia:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const currentQuestion = trivia[currentIndex];

  return (
    <div className="max-w-xl mx-auto p-4">
      {!currentQuestion && (
        <form onSubmit={handleSubmit} className="border p-4 rounded shadow mb-6">
          <div className="mb-4">
            <label className="block font-semibold mb-1">Name:</label>
            <input
              type="text"
              name="textInput"
              value={formData.textInput}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select a category</option>
              <option value="History">History</option>
              <option value="Art">Art</option>
              <option value="Animals">Animals</option>
              <option value="Sports">Sports</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Difficulty:</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
            Start Quiz
          </button>
        </form>
      )}

      {loading && <p>Loading questions...</p>}

      {!loading && currentQuestion && (
        <div className="border p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />

          <div className="space-y-2">
            {currentQuestion.answers.map((answer, i) => {
              const isCorrect = answer === currentQuestion.correct_answer;
              const isSelected = answer === selectedAnswer;

              return (
                <button
                  key={i}
                  onClick={() => handleAnswerSelect(answer)}
                  disabled={showAnswer}
                  className={`block w-full text-left p-2 border rounded
                    ${showAnswer && isCorrect ? 'bg-green-200 text black' : ''}
                    ${showAnswer && isSelected && !isCorrect ? 'bg-red-200' : ''}
                    ${!showAnswer ? 'hover:bg-gray-100' : ''}`}
                  dangerouslySetInnerHTML={{ __html: answer }}
                />
              );
            })}
          </div>

          {showAnswer && (
            
            <button
              onClick={handleNext}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
              disabled={currentIndex >= trivia.length - 1}
            >
              {currentIndex >= trivia.length - 1 ? 'Finish' : 'Next'}
            </button>
          )}
        </div>
      )}

      {!loading && trivia.length > 0 && currentIndex >= trivia.length && (
        <p className="mt-6 text-center font-bold text-green-600">Quiz Complete! 🎉</p>
      )}
    </div>
  );
}
