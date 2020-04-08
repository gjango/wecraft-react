import React, { useState, useContext } from "react"
import { Link, Redirect } from "react-router-dom"
import {
  Pane,
  Heading,
  TextInputField,
  Button,
  toaster,
  minorScale,
  Card
} from "evergreen-ui"

import { FORGOT_PASSWORD } from "gqlQueries/AuthGQL"

import { useMutation } from "@apollo/react-hooks"

import UserContext from "contexts/AuthContext"
import AuthPageWrapper from "components/AuthPageWrapper/AuthPageWrapper"

import { FORGET_PASSWORD_SCHEMA } from "utils/validators/AuthValidators"
import getErrorsByPath from "utils/validators/ValidatorHelpers"
import Paths from "../Paths"

const ForgotPassword = ({ history }) => {
  const [form, setForm] = useState({ email: "" })
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])

  const [forgotPassword] = useMutation(FORGOT_PASSWORD, {
    fetchPolicy: "no-cache",
    onCompleted: data => {
      if (data) {
        if (data.forgotPassword.success) {
          toaster.success(data.forgotPassword.message, { duration: 10 })
          history.push("/resetPassword", { email: form.email })
        } else {
          toaster.danger(data.forgotPassword.message, { duration: 10 })
          setLoading(false)
        }
      } else {
        return
      }
    }
  })
  const user = useContext(UserContext)

  const handleForgotPassword = async () => {
    setLoading(true)

    try {
      await FORGET_PASSWORD_SCHEMA.validate(form, {
        abortEarly: false
      })
    } catch (e) {
      setValidationErrors(e)
      setLoading(false)
      return
    }

    try {
      forgotPassword({ variables: form })
    } catch (e) {
      if (e && e.response && e.response.data && e.response.data.message) {
        toaster.danger(e.response.data.message)
      }

      setLoading(false)
    }
  }

  const handleEnter = e => {
    if (e.key === "Enter") {
      handleForgotPassword()
    }
  }
  return user.isAuthenticated ? (
    <Redirect to={Paths.logs()} />
  ) : (
    <AuthPageWrapper>
      <Pane className="text-center mt-4" marginBottom={16}>
        <Heading className="authHeading" size={800}>
          Forgot Password
        </Heading>
      </Pane>

      <Card elevation={1} className="card">
        <div className="card-body">
          <div className="m-sm-4">
            <TextInputField
              type="email"
              label="Email"
              placeholder="Type in your Email..."
              className="form-control-lg"
              value={form.email}
              validationMessage={getErrorsByPath("email", validationErrors)}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onKeyPress={handleEnter}
            />

            <Pane display="flex" justifyContent="space-between">
              <Button
                is={Link}
                to={Paths.login()}
                appearance="primary"
                intent="success"
                height={minorScale(9)}
                className="signUpBtn"
              >
                Sign in
              </Button>
              <Button
                appearance="primary"
                intent="success"
                height={minorScale(9)}
                onClick={handleForgotPassword}
                isLoading={loading}
                className="signInBtn"
              >
                Reset Password
              </Button>
            </Pane>
          </div>
        </div>
      </Card>
    </AuthPageWrapper>
  )
}

export default ForgotPassword
