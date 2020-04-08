import React, { useState, useContext } from "react"
import { Link, Redirect } from "react-router-dom"
import {
  Pane,
  TextInputField,
  Button,
  toaster,
  majorScale,
  Card,
  minorScale
} from "evergreen-ui"
import AuthPageWrapper from "components/AuthPageWrapper/AuthPageWrapper"
import { useLazyQuery } from "@apollo/react-hooks"
import { SIGN_IN } from "gqlQueries/AuthGQL"
import UserContext from "contexts/AuthContext"
import Verification from "../../components/AuthFlow/Verification"
import Paths from "../Paths"
import "./login.css"

const Login = props => {
  const [form, setForm] = useState({ email: "", password: "", smsCode: "" })
  const [loading, setLoading] = useState(false)
  const [twoFactorShown, setTwoFactorShown] = useState(false)
  const user = useContext(UserContext)

  const [signIn] = useLazyQuery(SIGN_IN, {
    fetchPolicy: "network-only",
    onCompleted: data => {
      setLoading(false)
      if (data && data.signin.success) {
        if (data.signin.jwt) {
          user.authenticate(data.signin.user, data.signin.jwt)
          props.history.push("/")
        } else {
          setTwoFactorShown(true)
        }
        return toaster.success(data.signin.message, { duration: 10 })
      }
      return toaster.danger(data.signin.message, { duration: 10 })
    }
  })

  const handleLogin = async () => {
    setLoading(true)
    try {
      signIn({ variables: form })
    } catch (e) {
      if (e && e.response && e.response.data && e.response.data.message) {
        toaster.danger(e.response.data.message)
        setForm({ ...form, faToken: null })
      }
      setLoading(false)
    }
  }

  const handleEnter = e => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  const telephoneHint = (
    <Link to={Paths.forgotPassword()} style={{ fontSize: "80%" }}>
      Forgot Password?
    </Link>
  )

  return user.isAuthenticated ? (
    <Redirect to={Paths.home()} />
  ) : (
    <AuthPageWrapper>
      <Card elevation={1} className="card">
        <div className="card-body">
          <div className="m-sm-4">
            {!twoFactorShown ? (
              <div>
                <TextInputField
                  type="email"
                  label="Email"
                  className="form-control-lg"
                  placeholder="Type in your Email..."
                  inputHeight={majorScale(5)}
                  value={form.email}
                  width="100%"
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onKeyPress={handleEnter}
                />

                <TextInputField
                  type="password"
                  label="Password"
                  width="100%"
                  placeholder="Type in your Password..."
                  hint={telephoneHint}
                  inputHeight={majorScale(5)}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onKeyPress={handleEnter}
                />
                <Pane display="flex" justifyContent="space-between">
                  <Button
                    is={Link}
                    to={Paths.signup()}
                    appearance="primary"
                    intent="success"
                    height={minorScale(9)}
                    className="signUpBtn"
                  >
                    Sign up
                  </Button>
                  <Button
                    appearance="primary"
                    intent="success"
                    height={minorScale(9)}
                    onClick={handleLogin}
                    isLoading={loading}
                    className="signInBtn"
                  >
                    Sign in
                  </Button>
                </Pane>
              </div>
            ) : (
              <Pane>
                <Verification
                  form={form}
                  handleEnter={handleEnter}
                  setForm={e => setForm({ ...form, smsCode: e.target.value })}
                  confirmCode={handleLogin}
                  isLoading={loading}
                />
              </Pane>
            )}
          </div>
        </div>
      </Card>
    </AuthPageWrapper>
  )
}

export default Login
