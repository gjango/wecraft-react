import React, { useEffect, useContext } from "react"
import { Redirect } from "react-router-dom"
import Paths from "routes/Paths"
import UserContext from "contexts/AuthContext"

const Logout = () => {
  const user = useContext(UserContext)

  useEffect(() => {
    user.deauthenticate()
  }, [user])

  return <Redirect to={Paths.login()} />
}

export default Logout
