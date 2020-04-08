import React, { useContext } from "react"
import { Route } from "react-router-dom"
import AuthContext from "../contexts/AuthContext"

const NonAuthRoute = ({ component, fallback, ...props }) => {
  const auth = useContext(AuthContext)

  if (!auth.isAuthenticated) {
    return <Route {...props} component={component} />
  }
  if (fallback) {
    return <Route {...props} component={fallback} />
  }
  return null
}

export default NonAuthRoute
