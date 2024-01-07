import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./NavBar";
function EditAssesment() {
  const location = useLocation();
  //   const navigate = useNavigate();
  const { assesmentID } = location.state;
  console.log(assesmentID);
  const [questions, setQuestions] = useState([]);
  const [emptyQuestionError, setEmptyQuestionError] = useState("");
  const [prevQuestions, setPrevQuestions] = useState([]);

  const handleQuestionChange = (index, property, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][property] = value;
    setQuestions(updatedQuestions);
  };
  useEffect(() => {
    axios
      .get(`http://localhost:8081/getquestions?assesmentID=${assesmentID}`)
      .then((response) => {
        setPrevQuestions(response.data);
        setQuestions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [assesmentID]);
  console.log(prevQuestions);
  const handleAddQuestion = () => {
    setQuestions([...questions, { assesmentid: assesmentID, text: "" }]);
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
      // Update existing questions
      await axios.post("http://localhost:8081/updatequestions", {
        questions,
      });

      // Remove deleted questions
      for (const deletedQuestion of prevQuestions.filter(
        (prevQ) => !questions.find((q) => q.questionid === prevQ.questionid)
      )) {
        await axios.post(`http://localhost:8081/removequestion`, {
          questionid: deletedQuestion.questionid,
        });
      }

      // Add new questions
      const newQuestions = questions.filter(
        (q) => !prevQuestions.find((prevQ) => q.text === prevQ.text)
      );
      for (const newQuestion of newQuestions) {
        await axios.post("http://localhost:8081/createAssesment", {
          questions: [newQuestion],
          newAssesmentID: assesmentID,
        });
      }

      console.log("Assessment updated successfully");
    } catch (error) {
      console.error("Error updating assessment:", error);
    }
    // navigate("/");
  };

  return (
    <div>
      <NavBar />
      <h2>Edit Assessment</h2>
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
        Save
      </button>
      {emptyQuestionError && (
        <div style={{ color: "red" }}>{emptyQuestionError}</div>
      )}
    </div>
  );
}

export default EditAssesment;
