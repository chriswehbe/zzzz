import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";
function CreateAssesment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { yourValue, newAssesmentID } = location.state;
  console.log(newAssesmentID);
  console.log(yourValue);
  const [questions, setQuestions] = useState([{ text: "" }]);
  const [emptyQuestionError, setEmptyQuestionError] = useState("");

  const handleQuestionChange = (index, property, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][property] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: "", grade: 0 }]);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    const hasEmptyQuestion = questions.some(
      (question) => !question.text.trim()
    );

    if (hasEmptyQuestion) {
      setEmptyQuestionError("All questions must have text");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8081/createAssesment",
        { questions, newAssesmentID }
      );

      console.log("Assessment created successfully:", response.data);
    } catch (error) {
      console.error("Error creating assessment:", error);
    }
    navigate("/home");
  };

  return (
    <div>
      <NavBar />
      <h2>Create Assessment</h2>
      {questions.map((question, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Question"
            value={question.text}
            onChange={(e) =>
              handleQuestionChange(index, "text", e.target.value)
            }
          />
          <button type="button" onClick={() => handleRemoveQuestion(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddQuestion}>
        Add Question
      </button>
      <button type="button" onClick={handleSubmit}>
        Submit
      </button>
      {emptyQuestionError && (
        <div style={{ color: "red" }}>{emptyQuestionError}</div>
      )}
    </div>
  );
}

export default CreateAssesment;
