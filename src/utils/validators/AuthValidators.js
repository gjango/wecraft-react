import * as yup from "yup"

const PASSWORD_SCHEMA = yup
  .string()
  .min(8, prop =>
    prop.value.length === 0
      ? "No password provided."
      : "Password must be at least 8 characters long"
  )
  .matches(/[a-z]+/, {
    message: "Password must contain at least one lowercase letter.",
    excludeEmptyString: true
  })
  .matches(/[A-Z]+/, {
    message: "Password must contain at least one uppercase letter.",
    excludeEmptyString: true
  })
  .matches(/[\d]+/, {
    message: "Password must contain at least one digit.",
    excludeEmptyString: true
  })
  .matches(/[^\w\s]/, {
    message: "Password must contain at least one special character.",
    excludeEmptyString: true
  })
  .matches(/[^<>]/g, {
    message: "Password must not contain < > symbols.",
    excludeEmptyString: true
  })

const CONFIRM_PASSWORD_SCHEMA = yup
  .string()
  .oneOf([yup.ref("password"), null], "Passwords must match")

const EMAIL_SCHEMA = yup
  .string()
  .required("No email provided")
  .email("Provide proper email")

export const SIGNUP_SCHEMA = yup.object().shape({
  email: EMAIL_SCHEMA,
  phoneNumber: yup.string().required("No phone number provided"),
  password: PASSWORD_SCHEMA,
  passwordConfirmation: CONFIRM_PASSWORD_SCHEMA,
  smsCode: yup.string()
})

export const RESET_PASSWORD_SCHEMA = yup.object().shape({
  password: PASSWORD_SCHEMA,
  passwordConfirmation: CONFIRM_PASSWORD_SCHEMA
})

export const FORGET_PASSWORD_SCHEMA = yup.object().shape({
  email: EMAIL_SCHEMA
})
