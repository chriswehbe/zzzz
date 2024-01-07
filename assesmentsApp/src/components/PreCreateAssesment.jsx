import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./NavBar";

function PreCreateAssessment() {
  const location = useLocation();
  const navigate = useNavigate();
  const yourValue = location.state?.yourValue || "default value";

  const [questionTypeArray, setQuestionTypeArray] = useState([]);
  const [assessmentTypeArray, setAssessmentTypeArray] = useState([]);
  const [selectedQuestionType, setSelectedQuestionType] = useState("");
  const [selectedAssessmentType, setSelectedAssessmentType] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [years] = useState(["2023/2024", "2024/2025"]);
  const [assesmentName, setAssesmentName] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:8081/getquestionstype")
      .then((response) => {
        setQuestionTypeArray(response.data);
      })
      .catch((error) => {
        console.error("Error fetching question types:", error);
      });

    axios
      .get("http://localhost:8081/getassesmenttype")
      .then((response) => {
        setAssessmentTypeArray(response.data);
      })
      .catch((error) => {
        console.error("Error fetching assessment types:", error);
      });
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (
      selectedYear !== "" ||
      assesmentName !== "" ||
      selectedAssessmentType != "" ||
      selectedQuestionType !== ""
    ) {
      try {
        await axios
          .post("http://localhost:8081/postassesment", [
            yourValue,
            selectedAssessmentType,
            selectedQuestionType,
            assesmentName,
            selectedYear,
          ])
          .then((res) => {
            if (res.data.created) {
              const newAssesmentID = res.data.assesmentid;
              console.log(res.data.assesmentid);
              console.log(newAssesmentID);
              if (selectedQuestionType === "1") {
                navigate("/createAssesment", {
                  state: {
                    yourValue,
                    newAssesmentID,
                  },
                });
              } else if (selectedQuestionType === "2") {
                navigate("/createAssesment", {
                  state: {
                    yourValue,
                    newAssesmentID,
                  },
                });
              } else if (selectedQuestionType === "3") {
                navigate("/createAssesment", {
                  state: {
                    yourValue,
                    newAssesmentID,
                  },
                });
              } else if (selectedQuestionType === "4") {
                navigate("/createAssesment", {
                  state: {
                    yourValue,
                    newAssesmentID,
                  },
                });
              }
            }
          });
      } catch (error) {
        console.error("Error creating assessment:", error);
      }
    } else {
      alert("Fields cannot be empty");
    }
  };

  return (
    <div>
      <NavBar />
      <h1>Creating Assessment for {yourValue}</h1>

      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="assesmentName">Enter Assesment Name:</label>
          <input
            type="text"
            onChange={(e) => {
              setAssesmentName(e.target.value);
            }}
            name="assesmentName"
          />
          <label htmlFor="years">Select Year:</label>
          <select
            id="year"
            name="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="" disabled>
              Select Year
            </option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <label htmlFor="questionType">Select Question Type:</label>
          <select
            id="questionType"
            name="questionType"
            value={selectedQuestionType}
            onChange={(e) => setSelectedQuestionType(e.target.value)}
          >
            <option value="" disabled>
              Select Question Type
            </option>
            {questionTypeArray.map((questionType) => (
              <option
                key={questionType.questionid}
                value={questionType.questionid}
              >
                {questionType.questiontype}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="assessmentType">Select Assessment Type:</label>
          <select
            id="assessmentType"
            name="assessmentType"
            value={selectedAssessmentType}
            onChange={(e) => setSelectedAssessmentType(e.target.value)}
          >
            <option value="" disabled>
              Select Assessment Type
            </option>
            {assessmentTypeArray.map((assessmentType) => (
              <option
                key={assessmentType.assesmenttypeid}
                value={assessmentType.assesmenttypeid}
              >
                {assessmentType.assesmenttypename}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button type="submit">Next</button>
        </div>
      </form>
    </div>
  );
}

export default PreCreateAssessment;
