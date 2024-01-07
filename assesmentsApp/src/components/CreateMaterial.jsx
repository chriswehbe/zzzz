import { useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";
function CreateMaterial() {
  const [formData, setFormData] = useState({
    materialID: "",
    materialName: "",
  });

  const [errors, setErrors] = useState({
    materialID: "",
    materialName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let formIsValid = true;

    if (formData.materialID.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        materialID: "ID is required",
      }));
      formIsValid = false;
    }

    if (formData.materialName.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        materialName: "Name is required",
      }));
      formIsValid = false;
    }

    if (formIsValid) {
      axios
        .post(`http://localhost:8081/creatematerial`, formData)
        .then((res) => {
          if (res.data.created) {
            alert("created successfully");
          } else {
            alert("something went wrong");
          }
          console.log(res);
        });
      console.log("Form submitted:", formData);
    }
  };

  return (
    <div>
      <NavBar />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="materialID">MaterialID:</label>
          <input
            type="text"
            id="materialID"
            name="materialID"
            value={formData.materialID}
            onChange={handleChange}
          />
          <span style={{ color: "red" }}>{errors.materialID}</span>
        </div>
        <div>
          <label htmlFor="materialName">MaterialName:</label>
          <input
            type="test"
            id="materialName"
            name="materialName"
            value={formData.materialName}
            onChange={handleChange}
          />
          <span style={{ color: "red" }}>{errors.materialName}</span>
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default CreateMaterial;
