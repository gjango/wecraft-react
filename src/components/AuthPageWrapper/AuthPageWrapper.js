import React from "react"
const AuthPageWrapper = ({ children }) => {
  return (
    <div className="main d-flex w-100">
      <div className="d-flex flex-column container">
        <div className="h-100 row">
          <div className="mx-auto d-table h-100 col-sm-9 col-md-7 col-lg-5">
            <div className="d-table-cell align-middle">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPageWrapper
