import React from "react"
import { Pane, Icon, Button, Text } from "evergreen-ui"

const RecordWarning = props => {
  return (
    <Pane marginRight="auto" marginLeft={30} elevation={1}>
      <Pane padding={15} display="flex">
        <Icon
          icon="warning-sign"
          color="warning"
          marginRight={16}
          size={32}
          marginTop="auto"
          marginBottom="auto"
        />
        <Pane display="flex" flexDirection="column">
          <Text size={500}> We have one Record waiting for your review</Text>
          <Pane paddingTop={15}>
            <Button appearance="minimal">James Smith</Button>{" "}
            <Text color="muted">- Tap to review</Text>
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  )
}

export default RecordWarning
