import React from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import "./index.scss"
import { AuthProvider } from "contexts/AuthContext"

import Home from "routes/Home/Home"
import LoginRoute from "routes/Login/Login"
import SignupRoute from "routes/Signup/Signup"
import LogoutRoute from "routes/Logout/Logout"
import ForgotPassword from "routes/ForgotPassword/ForgotPassword"
import ResetPassword from "routes/ResetPassword/ResetPassword"

import Paths from "routes/Paths"

import AuthRoute from "./routes/AuthRoute"

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Route path={Paths.login()} component={LoginRoute} />
        <Route path={Paths.signup()} component={SignupRoute} />
        <Route path={Paths.forgotPassword()} component={ForgotPassword} />
        <Route path={Paths.resetPassword()} component={ResetPassword} />
        <AuthRoute path={Paths.home()} component={Home} fallback={LoginRoute} />
        <AuthRoute path={Paths.logout()} component={LogoutRoute} />
      </Router>
    </AuthProvider>
  )
}

export default App
