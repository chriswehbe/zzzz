import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import "./Styles.scss";
function UserAnswers() {
  const location = useLocation();
  const { assessmentID, userID } = location.state;
  const [questions, setQuestions] = useState([]);
  console.log(userID);
  useEffect(() => {
    axios
      .post(`http://localhost:8081/getquestionsandanswers`, {
        assessmentID,
        userID,
      })
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [assessmentID, userID]);

  return (
    <div className="container">
      <NavBar />
      <h2 className="heading">Answers</h2>
      {questions.map((question, index) => (
        <div key={index} className="questionContainer">
          <div className="question_container">
            <h3 className="questionHeading">Question {index + 1}: </h3>
            <p className="questionText">{question.questiontext}</p>
          </div>
          <div className="question_container">
            <h4 className="answerHeading">Answer: </h4>
            <p className="answerText">{question.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserAnswers;
