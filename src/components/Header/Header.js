import React from "react"
import { Pane, SearchInput } from "evergreen-ui"
import RecordWarning from "../RecordWarning/RecordWarning"

const Header = () => {
  return (
    <Pane paddingTop={30} display="flex">
      <RecordWarning />
      <SearchInput
        placeholder="Search"
        height={40}
        marginLeft="auto"
        marginRight={30}
      />
    </Pane>
  )
}

export default Header
