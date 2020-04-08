import React from "react"
import { Button, minorScale } from "evergreen-ui"

const Home = ({ history }) => {
  return (
    <div>
      <Button
        appearance="primary"
        intent="success"
        height={minorScale(9)}
        className="signInBtn"
        onClick={() => history.push("/logout")}
      >
        Log Out
      </Button>
    </div>
  )
}

export default Home
