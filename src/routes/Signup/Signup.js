import React, { useState, useContext } from "react"
import { Link, Redirect } from "react-router-dom"
import {
  toaster,
  minorScale,
  Pane,
  Button,
  TextInputField,
  Heading,
  Card
} from "evergreen-ui"
import paths from "routes/Paths"
import UserContext from "contexts/AuthContext"
import AuthPageWrapper from "components/AuthPageWrapper/AuthPageWrapper"
import { useMutation } from "@apollo/react-hooks"
import { SIGN_UP } from "gqlQueries/AuthGQL"

import { SIGNUP_SCHEMA } from "utils/validators/AuthValidators"
import getErrorsByPath from "utils/validators/ValidatorHelpers"
import Verification from "../../components/AuthFlow/Verification"

const Signup = () => {
  const user = useContext(UserContext)
  const [form, setForm] = useState({
    email: "",
    phoneNumber: "",
    password: "",
    passwordConfirmation: "",
    smsCode: ""
  })
  const [loading, setLoading] = useState(false)
  const [showConfirmCodeInput, setConfirmCodeInput] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])

  const [signUp] = useMutation(SIGN_UP, {
    fetchPolicy: "no-cache",
    onCompleted: data => {
      setLoading(false)
      if (data && data.signup.success) {
        if (data.signup.jwt) {
          user.authenticate(data.signup.user, data.signup.jwt)
        } else {
          setConfirmCodeInput(true)
        }
        return toaster.success(data.signup.message, { duration: 10 })
      }
      return toaster.danger(data.signup.message, { duration: 10 })
    }
  })
  const createUser = async () => {
    setLoading(true)

    try {
      await SIGNUP_SCHEMA.validate(form, {
        abortEarly: false
      })
    } catch (e) {
      setValidationErrors(e)
      setLoading(false)
      return
    }

    try {
      await signUp({ variables: form })
    } catch (e) {
      if (e && e.response && e.response.data && e.response.data.message) {
        toaster.danger(e.response.data.message)
      }

      setLoading(false)
    }
  }

  const phoneHint = (
    <Heading size={100} marginTop={4}>
      +123456789
    </Heading>
  )

  return user.isAuthenticated ? (
    <Redirect to={paths.home()} />
  ) : (
    <AuthPageWrapper>
      <Card elevation={1} className="card">
        <div className="card-body">
          <div className="m-sm-4">
            {showConfirmCodeInput ? (
              <Verification
                form={form}
                setForm={e => setForm({ ...form, smsCode: e.target.value })}
                confirmCode={createUser}
                isLoading={loading}
              />
            ) : (
              <div>
                <TextInputField
                  type="email"
                  label="Email"
                  className="form-control-lg"
                  placeholder="Type in your Email..."
                  value={form.email}
                  validationMessage={getErrorsByPath("email", validationErrors)}
                  onChange={event =>
                    setForm({ ...form, email: event.target.value })
                  }
                />

                <TextInputField
                  type="phone"
                  label="Telephone"
                  className="form-control-lg"
                  placeholder="Type in your Telephone..."
                  value={form.phoneNumber}
                  hint={phoneHint}
                  marginBottom={10}
                  validationMessage={getErrorsByPath(
                    "phoneNumber",
                    validationErrors
                  )}
                  onChange={event =>
                    setForm({ ...form, phoneNumber: event.target.value })
                  }
                />

                <TextInputField
                  type="password"
                  label="Password"
                  className="form-control-lg"
                  placeholder="Type in your Password..."
                  value={form.password}
                  validationMessage={getErrorsByPath(
                    "password",
                    validationErrors
                  )}
                  onChange={event =>
                    setForm({ ...form, password: event.target.value })
                  }
                />

                <TextInputField
                  type="password"
                  label="Confirm Password"
                  className="form-control-lg"
                  placeholder="Type in your Password Confirmation..."
                  value={form.passwordConfirmation}
                  validationMessage={getErrorsByPath(
                    "passwordConfirmation",
                    validationErrors
                  )}
                  onChange={event =>
                    setForm({
                      ...form,
                      passwordConfirmation: event.target.value
                    })
                  }
                />
              </div>
            )}

            <Pane display="flex" justifyContent="space-between">
              {!showConfirmCodeInput && (
                <Button
                  is={Link}
                  to={paths.login()}
                  appearance="primary"
                  intent="success"
                  height={minorScale(9)}
                  className="signUpBtn"
                >
                  Sign in
                </Button>
              )}
              {!showConfirmCodeInput && (
                <Button
                  appearance="primary"
                  intent="success"
                  height={minorScale(9)}
                  onClick={createUser}
                  isLoading={loading}
                  className="signInBtn"
                >
                  Next
                </Button>
              )}
            </Pane>
          </div>
        </div>
      </Card>
    </AuthPageWrapper>
  )
}

export default Signup
