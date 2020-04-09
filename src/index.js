import React from "react"
import ReactDOM from "react-dom"

import "./index.scss"
import { HttpLink, ApolloClient, ApolloLink, InMemoryCache } from "apollo-boost"
import { ApolloProvider } from "@apollo/react-hooks"
import * as serviceWorker from "./serviceWorker"

import App from "./app"
import authToken from "./utils/auth"

const authLink = new ApolloLink((operation, forward) => {
  const token = authToken.get()
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : ""
    }
  })

  return forward(operation)
})

const httpLink = new HttpLink({
  uri: process.env.API_URL || "http://localhost:3000/graphql"
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
