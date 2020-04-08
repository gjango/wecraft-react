import React, { useEffect, useState } from "react"
import authToken from "utils/auth"
import { ME } from "gqlQueries/AuthGQL"
import { useLazyQuery } from "@apollo/react-hooks"

const AuthContext = React.createContext()
export default AuthContext

export const AuthProvider = ({ children, onAuth }) => {
  const authenticate = (data, jwtToken = false) => {
    if (jwtToken) {
      authToken.set(jwtToken)
    }
    if (client.isAuthenticated === false) {
      setClient({ ...client, isAuthenticated: true })
    }
  }
  const [me] = useLazyQuery(ME, {
    fetchPolicy: "network-only",
    onCompleted: data => {
      if (data && data.me.id) {
        authenticate({}, authToken.get())
      } else {
        deauthenticate()
      }
    }
  })
  const deauthenticate = () => {
    authToken.remove()
    setClient({ ...client, isAuthenticated: false })
  }
  const checkAuthenticated = async () => {
    if (authToken.get()) {
      await me()
    }
    if (onAuth && client.authCallCount === 0) {
      onAuth()
      setClient({ ...client, authCallCount: client.authCallCount + 1 })
    }
  }
  const [client, setClient] = useState({
    isAuthenticated: false,
    authCallCount: 0,
    authenticate,
    deauthenticate
  })
  useEffect(() => {
    checkAuthenticated()
  }, [])
  return <AuthContext.Provider value={client}>{children}</AuthContext.Provider>
}
