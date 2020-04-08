import React, { useState, useContext } from "react"
import { Link, Redirect } from "react-router-dom"
import {
  Pane,
  Heading,
  TextInputField,
  Button,
  toaster,
  Card,
  minorScale
} from "evergreen-ui"

import { RESET_PASSWORD_CHECK, RESET_PASSWORD } from "gqlQueries/AuthGQL"
import { useLazyQuery, useMutation } from "@apollo/react-hooks"

import UserContext from "contexts/AuthContext"
import AuthPageWrapper from "components/AuthPageWrapper/AuthPageWrapper"

import { RESET_PASSWORD_SCHEMA } from "utils//validators/AuthValidators"
import getErrorsByPath from "utils/validators/ValidatorHelpers"
import Paths from "../Paths"

const ResetPassword = ({ history }) => {
  if (!history.location.state || !history.location.state.email) {
    history.push("/login")
  }

  const [form, setForm] = useState({
    password: "",
    passwordConfirmation: "",
    token: ""
  })
  const [loading, setLoading] = useState(false)
  const [showResetPassworInput, setResetPasswordInput] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])

  const [resetPasswordCheck] = useLazyQuery(RESET_PASSWORD_CHECK, {
    fetchPolicy: "network-only",
    onCompleted: data => {
      setLoading(false)

      if (data.resetPasswordPasscodeCheck.success) {
        setResetPasswordInput(true)
        setLoading(false)
        return toaster.success(data.resetPasswordPasscodeCheck.message, {
          duration: 10
        })
      }
      return toaster.danger(data.resetPasswordPasscodeCheck.message, {
        duration: 10
      })
    }
  })

  const [resetPassword] = useMutation(RESET_PASSWORD, {
    fetchPolicy: "no-cache",
    onCompleted: data => {
      if (data) {
        if (data.resetPassword.success) {
          history.push("/login", { email: form.email })
          setLoading(false)
          return toaster.success(data.resetPassword.message, { duration: 10 })
        }
        return toaster.danger(data.resetPassword.message, { duration: 10 })
      }
      return false
    }
  })

  const user = useContext(UserContext)

  const handleConfirmCode = async () => {
    setLoading(true)
    try {
      resetPasswordCheck({
        variables: { email: history.location.state.email, token: form.token }
      })
    } catch (e) {
      if (e && e.response && e.response.data && e.response.data.message) {
        toaster.danger(e.response.data.message)
      }
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    setLoading(true)

    try {
      await RESET_PASSWORD_SCHEMA.validate(form, {
        abortEarly: false
      })
    } catch (e) {
      setValidationErrors(e)
      setLoading(false)
      return
    }

    try {
      resetPassword({
        variables: {
          email: history.location.state.email,
          token: form.token,
          password: form.password
        }
      })
    } catch (e) {
      if (e.response.data.message) {
        toaster.danger(e.response.data.message)
      }
      setLoading(false)
    }
  }

  const handleEnter = e => {
    if (e.key === "Enter") {
      if (showResetPassworInput) {
        handleResetPassword()
      } else {
        handleConfirmCode()
      }
    }
  }

  return user.isAuthenticated ? (
    <Redirect to={Paths.logs()} />
  ) : (
    <AuthPageWrapper>
      <Pane className="text-center mt-4" marginBottom={16}>
        <Heading className="authHeading" size={800}>
          Reset Password
        </Heading>
      </Pane>

      <Card elevation={1} className="card">
        <div className="card-body">
          <div className="m-sm-4">
            {showResetPassworInput ? (
              <div>
                <TextInputField
                  type="password"
                  label="Password"
                  placeholder="Type in your new Password..."
                  className="form-control-lg"
                  value={form.password}
                  validationMessage={getErrorsByPath(
                    "password",
                    validationErrors
                  )}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onKeyPress={handleEnter}
                />

                <TextInputField
                  type="password"
                  label="Confirm Password"
                  placeholder="Type in your Password Confirmation..."
                  className="form-control-lg"
                  value={form.passwordConfirmation}
                  validationMessage={getErrorsByPath(
                    "passwordConfirmation",
                    validationErrors
                  )}
                  onChange={e =>
                    setForm({ ...form, passwordConfirmation: e.target.value })
                  }
                  onKeyPress={handleEnter}
                />
              </div>
            ) : (
              <TextInputField
                type="text"
                label="Confirm code"
                placeholder="Type in your Confirmation Code"
                className="form-control-lg"
                value={form.token}
                onChange={e => setForm({ ...form, token: e.target.value })}
                onKeyPress={handleEnter}
              />
            )}

            <Pane display="flex" justifyContent="space-between">
              <Button
                is={Link}
                to={Paths.login()}
                appearance="primary"
                intent="success"
                height={minorScale(9)}
                className="signUpBtn"
              >
                Sign In
              </Button>
              {showResetPassworInput ? (
                <Button
                  appearance="primary"
                  intent="success"
                  height={minorScale(9)}
                  onClick={handleResetPassword}
                  isLoading={loading}
                  className="signInBtn"
                >
                  Reset Password
                </Button>
              ) : (
                <Button
                  appearance="primary"
                  intent="success"
                  height={minorScale(9)}
                  onClick={handleConfirmCode}
                  isLoading={loading}
                  className="signInBtn"
                >
                  Confirm Code
                </Button>
              )}
            </Pane>
          </div>
        </div>
      </Card>
    </AuthPageWrapper>
  )
}

export default ResetPassword
