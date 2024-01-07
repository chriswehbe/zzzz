import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./AuthProvider";
function UserView() {
  const [assesmentArray, setAssesmentArray] = useState([]);
  const navigate = useNavigate();
  const { token } = useAuth();
  const decoded = jwtDecode(token);
  const navigateToView = async (value) => {
    try {
      await axios
        .post("http://localhost:8081/isanswered", {
          assesmentID: value,
          userid: decoded.userid,
        })
        .then((response) => {
          if (!response.data.isAnswered) {
            navigate("/answerAssesment", { state: { assessmentID: value } });
          } else {
            alert("you already answered this assessment");
          }
        });
    } catch (error) {
      console.error("Error get:", error);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:8081/getassesments")
      .then((response) => {
        setAssesmentArray(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  return (
    <div>
      <div>
        <NavBar />
        <table>
          <thead>
            <tr>
              <th>Material</th>
              <th>Name</th>
              <th>Year</th>
              <th>Button</th>
            </tr>
          </thead>
          <tbody>
            {assesmentArray.map((item) => (
              <React.Fragment key={item.materialid}>
                {item.status === 1 && (
                  <tr>
                    <td>{item.materialid}</td>
                    <td>{item.assesmentname}</td>
                    <td>{item.year}</td>
                    <td>
                      <button onClick={() => navigateToView(item.assesmentid)}>
                        Answer
                      </button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserView;
