import { useState } from "react";
import SignupValidation from "./SignupValidation";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { checkEmail } from "./SignupValidation";
function Signup() {
  const [values, setValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const navigate = useNavigate();
  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors(SignupValidation(values));
    if (Object.keys(SignupValidation(values)).length === 0) {
      const isUniqueEmail = await checkEmail(values.email);
      if (isUniqueEmail) {
        await axios
          .post("http://localhost:8081/Signup", values)
          .then((res) => {
            if (res.data.signedUp) {
              navigate("/Login");
              alert("account created");
            } else {
              alert("error");
            }
            console.log(res);
          })
          .catch((err) => console.log(err));
      } else {
        setErrors({ email: "email already exists" });
      }
    }
  };
  return (
    <div>
      <div>
        <form action="" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" onChange={handleInput} name="email" />
            {errors.email && (
              <span className="text-danger">{errors.email}</span>
            )}
          </div>
          <div>
            <label htmlFor="firstName">FirstName</label>
            <input type="text" onChange={handleInput} name="firstName" />
            {errors.firstName && (
              <span className="text-danger">{errors.firstName}</span>
            )}
          </div>
          <div>
            <label htmlFor="lastName">LastName</label>
            <input type="text" onChange={handleInput} name="lastName" />
            {errors.lastName && (
              <span className="text-danger">{errors.lastName}</span>
            )}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" onChange={handleInput} name="password" />
          </div>
          {errors.password && (
            <span className="text-danger">{errors.password}</span>
          )}
          <div>
            <label htmlFor="password">Confirm Password</label>
            <input
              type="password"
              onChange={handleInput}
              name="confirmPassword"
            />
            {errors.confirmPassword && (
              <span className="text-danger">{errors.confirmPassword}</span>
            )}
          </div>
          <button type="submit"> SignUp</button>
          <p></p>
          <Link to="/Login">Back to Login </Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
