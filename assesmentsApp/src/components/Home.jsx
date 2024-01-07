import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import axios from "axios";
import "./Styles.scss";
const Home = () => {
  const navigate = useNavigate();
  const navigateToCreateMaterial = () => {
    navigate("/createMaterial");
  };
  const createAssesment = (value) => {
    navigate("/preCreateAssesment", { state: { yourValue: value } });
  };
  const navigateToAssesmentsView = () => {
    navigate("/assesmentsView");
  };
  const navigateToAssesmentResults = () => {
    navigate("/assesmentResults");
  };

  const [dataArray, setDataArray] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/getmaterials")
      .then((response) => {
        setDataArray(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      <div>
        <NavBar />
      </div>
      <div className="button_wrapper">
        <button className="outside-button" onClick={navigateToCreateMaterial}>
          Create Material
        </button>
        <button className="outside-button" onClick={navigateToAssesmentsView}>
          View Assesments
        </button>

        <button className="outside-button" onClick={navigateToAssesmentResults}>
          View Results
        </button>
      </div>

      <div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Button</th>
            </tr>
          </thead>
          <tbody>
            {dataArray.map((item) => (
              <tr key={item.materialid}>
                <td>{item.materialid}</td>
                <td>{item.materialname}</td>
                <td>
                  <button onClick={() => createAssesment(item.materialid)}>
                    {" "}
                    Create Assesment
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
