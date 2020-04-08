import React from "react"
import { TextInputField, majorScale, minorScale, Button } from "evergreen-ui"

const Verification = ({
  form,
  setForm,
  handleEnter,
  confirmCode,
  isLoading
}) => {
  return (
    <div>
      <TextInputField
        type="text"
        label="SMS Code"
        width="100%"
        placeholder="Type in your SMS Code..."
        inputHeight={majorScale(5)}
        value={form.smsCode}
        onChange={setForm}
        onKeyPress={handleEnter}
      />
      <Button
        appearance="primary"
        intent="success"
        height={minorScale(9)}
        onClick={confirmCode}
        className="signInBtn"
        isLoading={isLoading}
      >
        Confirm Code
      </Button>
    </div>
  )
}

export default Verification
