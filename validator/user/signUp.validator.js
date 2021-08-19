import Validator from "validator";
import isEmpty from "is-empty";

const validateSignUpInput = (data) => {
  const errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Invalid Email";
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = "Username is required";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  } else if (!Validator.isLength(data.password, 8, 20)) {
    errors.password = "Password must be 8 character long";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default validateSignUpInput;
