import React from "react"
import { FormFieldValidationMessage } from "evergreen-ui"

const getErrorsByPath = (path, validationErrors) => {
  if (validationErrors && validationErrors.inner) {
    const filteredByPath = validationErrors.inner.filter(
      error => error.path === path
    )

    return filteredByPath.map(error => {
      return (
        <FormFieldValidationMessage marginTop={8} key={error.message}>
          {error.message}
        </FormFieldValidationMessage>
      )
    })
  }
}

export default getErrorsByPath
