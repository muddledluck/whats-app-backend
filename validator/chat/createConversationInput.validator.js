import Validator from "validator";
import isEmpty from "is-empty";

const validateCreateConversationInput = (data) => {
  const errors = {};

  data.participants = !isEmpty(data.participants) ? data.participants : [];

  if (data.participants.length < 1) {
    errors.participants = "At least 1 participants are required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default validateCreateConversationInput;
