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
          src="https://file-examples.com/wp-content/uploads/2017/10/file-example_PDF_500_kB.pdf"
          downloadable
          onRequestClose={() => this.setState({ open: false })}
          onLastPage={() => console.log('onLastPage')}
        />
      </div>
    )
  }
}
