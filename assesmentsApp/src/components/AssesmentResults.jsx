import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

function AssesmentResults() {
  const [assesmentArray, setAssesmentArray] = useState([]);
  const navigate = useNavigate();

  const navigateToView = (value) => {
    navigate("/answers", { state: { assessmentID: value } });
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
                        View
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

export default AssesmentResults;
