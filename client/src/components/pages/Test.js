import React from 'react'

const Test = () => {
  return (
    <div className="form-container">
      <form>
        <div className="form-group">
          <label className="switch">
            <input type="checkbox" value="true"/>
            <span className="slider round"/>
          </label>
          <span>Are other users allowed to search for your name, email, and alias? This is how friends will find you.</span>
        </div>
        <div className="form-group">
          <label>
            <input type="checkbox" value="true"/>
          </label>
        </div>
      </form>
    </div>
  )
}

export default Test;