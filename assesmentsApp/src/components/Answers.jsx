import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
function Answers() {
  const location = useLocation();
  const { assessmentID } = location.state;

  const [userArray, setUserArray] = useState([]);
  const navigate = useNavigate();

  const navigateToView = (value) => {
    navigate("/userAnswers", { state: { userID: value, assessmentID } });
  };

  useEffect(() => {
    axios
      .post("http://localhost:8081/useranswered", {
        assesmentID: assessmentID,
      })
      .then((response) => {
        const responseData = response.data.data;

        if (Array.isArray(responseData)) {
          setUserArray(responseData);
        } else {
          console.error("Error: Response data is not an array");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      <NavBar />
      <h2>Users Answers</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Button</th>
          </tr>
        </thead>
        <tbody>
          {userArray.map((item) => (
            <tr key={item.userid}>
              <td>
                {item.fname} {item.lname}
              </td>
              <td>
                <button onClick={() => navigateToView(item.userid)}>
                  {""}
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Answers;
