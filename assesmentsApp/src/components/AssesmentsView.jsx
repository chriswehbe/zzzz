import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

function AssesmentsView() {
  const [assesmentArray, setAssesmentArray] = useState([]);
  const navigate = useNavigate();

  const navigateToEdit = (value) => {
    navigate("/editAssesment", { state: { assesmentID: value } });
  };
  const activate = (value) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to activate this assessment?"
    );

    if (isConfirmed) {
      axios
        .post("http://localhost:8081/activateassesment", { assesmentid: value })
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error activating assessment:", error);
        });
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
              <tr key={item.materialid}>
                <td>{item.materialid}</td>
                <td>{item.assesmentname}</td>
                <td>{item.year}</td>
                <td>
                  {item.status === 0 ? (
                    <>
                      <button onClick={() => activate(item.assesmentid)}>
                        Activate
                      </button>
                      <button onClick={() => navigateToEdit(item.assesmentid)}>
                        Edit
                      </button>
                    </>
                  ) : (
                    <p>Active</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AssesmentsView;
