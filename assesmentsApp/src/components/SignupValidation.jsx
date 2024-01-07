import axios from "axios";
function SignupValidation(values) {
  let errors = {};
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (values.email === "") {
    errors.email = "email should not be empty";
  } else if (!emailPattern.test(values.email)) {
    errors.email = "Invalid email format";
  } else if (values.password === "") {
    errors.password = "Password should not be empty";
  } else if (values.firstName === "") {
    errors.firstName = "firstName should not be empty";
  } else if (values.lastName === "") {
    errors.lastName = "lastName should not be empty";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "passwords do not match";
    errors.password = "passwords do not match";
  }

  return errors;
}
export async function checkEmail(email) {
  try {
    const res = await axios.post(`http://localhost:8081/signupCheck`, email);
    return !res.data.emailExists;
  } catch (error) {
    console.error("Error during email validation:", error);
    return false;
  }
}
export default SignupValidation;
