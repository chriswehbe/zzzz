function LoginValidation(values) {
    let errors = {};
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (values.email === "") {
      errors.email = "email should not be empty";
    } else if (!emailPattern.test(values.email)) {
      errors.email = "Invalid email format";
    } else if (values.password === "") {
      errors.password = "Password should not be empty";
    }
    return errors;
  }
  
  export default LoginValidation;
  