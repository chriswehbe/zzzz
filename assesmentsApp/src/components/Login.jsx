import { useState } from "react";
import LoginValidation from "./LoginValidation";
import { Link } from "react-router-dom";
import "./Styles.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  const { setToken } = useAuth();
  const [errors, setErrors] = useState({});
  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(LoginValidation(values));
    console.log(errors);
    if (Object.keys(LoginValidation(values)).length === 0) {
      axios.post(`http://localhost:8081/login`, values).then((res) => {
        console.log(res.data.Login);
        if (res.data.LoggedIn) {
          if (res.data.isAdmin) {
            navigate("/home");
            setToken(res.data.token);
          } else {
            navigate("/userView");
            setToken(res.data.token);
          }
        } else {
          alert("invalid credentials");
        }
        console.log(res);
      });
    }
  };
  return (
    <div className="wrapper">
      <div className="form__wrapper">
        <form action="" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" onChange={handleInput} name="email" />
            {errors.email && (
              <span className="text-danger">{errors.email}</span>
            )}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" onChange={handleInput} name="password" />
            {errors.password && (
              <span className="text-danger">{errors.password}</span>
            )}
          </div>
          <button type="submit"> Login</button>
          <p></p>
          <Link to="/Signup">Register Here </Link>
        </form>
      </div>
    </div>
  );
}
export default Login;
