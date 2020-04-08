import gql from "graphql-tag"

export const SIGN_IN = gql`
  query signin($email: String, $password: String, $smsCode: String) {
    signin(email: $email, password: $password, smsCode: $smsCode) {
      success
      message
      jwt
      user {
        id
        email
      }
    }
  }
`

export const SIGN_UP = gql`
  mutation signup(
    $email: String
    $password: String
    $phoneNumber: String
    $smsCode: String
  ) {
    signup(
      email: $email
      password: $password
      phoneNumber: $phoneNumber
      smsCode: $smsCode
    ) {
      success
      message
      jwt
      user {
        id
        email
      }
    }
  }
`

export const ME = gql`
  query me {
    me {
      id
      email
    }
  }
`

export const FORGOT_PASSWORD = gql`
  mutation forgotPassword($email: String) {
    forgotPassword(email: $email) {
      success
      message
    }
  }
`

export const RESET_PASSWORD_CHECK = gql`
  query resetPasswordPasscodeCheck($email: String, $token: String) {
    resetPasswordPasscodeCheck(email: $email, token: $token) {
      success
      message
    }
  }
`

export const RESET_PASSWORD = gql`
  mutation resetPassword($email: String, $token: String, $password: String) {
    resetPassword(email: $email, token: $token, password: $password) {
      success
      message
    }
  }
`
