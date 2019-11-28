import React, { Component } from 'react'

import PDF from 'ngager-pdfreader'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: true
    }
  }
  render () {
    if (this.state.open === false) {
      return null;
    }
    return (
      <div>
        <PDF
          popup
          src="https://nclong87.github.io/file-example_PDF_500_kB.pdf"
          downloadable
          onRequestClose={() => this.setState({ open: false })}
          onLastPage={() => console.log('onLastPage')}
        />
      </div>
    )
  }
}
