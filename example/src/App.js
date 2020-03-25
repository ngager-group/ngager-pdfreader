import React, { PureComponent } from 'react'

import PDF from 'ngager-pdfreader'

export default class App extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      open: true,
      downloadable: false,
    }
    console.log('constructor')
    this.viewer = {
      host: 'http://localhost',
      path: '/pdf/web/viewer.html',
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ downloadable: true });
    }, 5000);
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
          src="https://nclong87.github.io/sample%20(1).pdf"
          downloadable={this.state.downloadable}
          onRequestClose={() => this.setState({ open: false })}
          onLastPage={() => console.log('onLastPage')}
          onPageChanged={(currentPage) => console.log('currentPage', currentPage)}
          viewer={this.viewer}
        />
      </div>
    )
  }
}
