import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./AuthProvider";
import NavBar from "./NavBar";

function AnswerAssessment() {
  const location = useLocation();
  const { assessmentID } = location.state;
  const { token } = useAuth();
  const decoded = jwtDecode(token);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  console.log(decoded);
  useEffect(() => {
    axios
      .get(`http://localhost:8081/getquestions?assessmentID=${assessmentID}`)
      .then((response) => {
        setQuestions(response.data);
        setAnswers(
          response.data.map((question) => ({
            id: question.questionid,
            text: "",
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [assessmentID]);

  const handleAnswerChange = (index, questionID, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = { id: questionID, text: value };
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    const hasEmptyAnswer = answers.some((answer) => !answer.text.trim());

    if (hasEmptyAnswer) {
      return;
    }

    try {
      await axios.post("http://localhost:8081/insertanswers", {
        userid: decoded.userid,
        answers,
      });

      console.log("Assessment answers updated successfully");
    } catch (error) {
      console.error("Error updating assessment answers:", error);
    }
  };

  return (
    <div>
      <NavBar />
      <h2>Answer Assessment</h2>
      {questions.map((question, index) => (
        <div key={index}>
          <p>{question.questiontext}</p>
          <input
            type="text"
            placeholder="Answer"
            value={answers[index].text}
            onChange={(e) =>
              handleAnswerChange(index, question.questionid, e.target.value)
            }
          />
        </div>
      ))}
      <button type="button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default AnswerAssessment;
