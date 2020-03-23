import React, { PureComponent } from 'react'

import PDF from 'ngager-pdfreader'

export default class App extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      open: true
    }
    console.log('constructor')
    this.viewer = {
      host: 'http://localhost',
      path: '/pdf/web/viewer.html',
    };
  }

  componentWillReceiveProps() {
    console.log('componentWillReceiveProps')
  }

  render () {
    if (this.state.open === false) {
      return (
        <div><button onClick={() => this.setState({ open: true })}>Open PDF Reader</button></div>
      );
    }
    return (
      <div>
        <PDF
          popup
          src="https://nclong87.github.io/file-example_PDF_500_kB.pdf"
          downloadable={false}
          onRequestClose={() => this.setState({ open: false })}
          onLastPage={() => console.log('onLastPage')}
          onPageChanged={(currentPage) => console.log('currentPage', currentPage)}
          viewer={this.viewer}
        />
      </div>
    )
  }
}
