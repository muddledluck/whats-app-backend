import Validator from "validator";
import isEmpty from "is-empty";

const validateCreateMessageInput = (data) => {
  const errors = {};

  data.conversationId = !isEmpty(data.conversationId)
    ? data.conversationId
    : "";
  data.content = !isEmpty(data.content) ? data.content : "";

  if (Validator.isEmpty(data.conversationId)) {
    errors.conversationId = "conversationId is required";
  } else if (!Validator.isMongoId(data.conversationId)) {
    errors.conversationId = "Invalid conversationId";
  }

  if (Validator.isEmpty(data.content) && !data.file) {
    errors.content = "content is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default validateCreateMessageInput;
