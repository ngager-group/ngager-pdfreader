import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'

class PDF extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      totalPages: 0
    }
    this.handleOnReceived = this.handleOnReceived.bind(this)
    this.handlePressEscape = this.handlePressEscape.bind(this)
    this.handleOnClickBack = this.handleOnClickBack.bind(this)
  }

  componentDidMount() {
    if (this.props.popup) {
      window.history.pushState(null, null, window.location.href)
      window.addEventListener('popstate', this.handleOnClickBack)
    }
    window.addEventListener('message', this.handleOnReceived)
    document.addEventListener('keydown', this.handlePressEscape, false)
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentPage, totalPages } = this.state
    if (prevState.totalPages !== totalPages || prevState.currentPage !== currentPage) {
      if (currentPage === totalPages) {
        this.props.onLastPage()
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleOnReceived, false)
    document.removeEventListener('keydown', this.handlePressEscape, false)
    document.removeEventListener('popstate', this.handleOnClickBack, false)
  }

  handleOnClickBack(event) {
    event.preventDefault()
    event.stopPropagation()
    this.props.onRequestClose()
  }

  handlePressEscape(e) {
    if (e.keyCode === 27) {
      if (typeof e.preventDefault === 'function') {
        e.preventDefault()
      }
      if (typeof e.stopPropagation === 'function') {
        e.stopPropagation()
      }
      this.props.onRequestClose()
    }
  }

  handleOnReceived(event) {
    const host = this.props.viewer.host
    if (event.origin !== host) {
      return
    }
    if (event.data && event.data.type) {
      // console.log('Received Message : ', event)
      if (!this.iframe) {
        return
      }
      switch (event.data.type) {
        case 'ready': {
          const resource = {
            src: this.props.src,
            popup: this.props.popup,
            downloadable: this.props.downloadable
          }
          this.iframe.contentWindow.postMessage(resource, host)
          break
        }
        case 'close':
          this.props.onRequestClose()
          break
        case 'pagesloaded': {
          const { pagesCount } = event.data.data
          this.setState({ totalPages: pagesCount })
          break
        }
        case 'pagechanging': {
          const { pageNumber } = event.data.data
          this.setState({ currentPage: pageNumber })
          break
        }
        default:
          break
      }
    }
  }

  renderIframe() {
    const { host, path } = this.props.viewer
    const style = { width: '100%', height: '100%' }
    return (
      <iframe
        ref={el => {
          this.iframe = el
        }}
        className={this.props.popup ? styles.popupiframe : ''}
        frameBorder='0'
        allowFullScreen
        style={style}
        title='PDF Reader'
        src={`${host}${path}`}
      />
    )
  }

  render() {
    if (this.props.popup) {
      return (
        <div className={styles.popup}>
          {this.renderIframe()}
        </div>
      )
    }
    return this.renderIframe()
  }
}

PDF.propTypes = {
  viewer: PropTypes.instanceOf(Object),
  popup: PropTypes.bool,
  downloadable: PropTypes.bool,
  src: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Object)
  ]).isRequired,
  onLastPage: PropTypes.func,
  onRequestClose: PropTypes.func
}

PDF.defaultProps = {
  viewer: {
    host: 'https://nclong87.github.io',
    path: '/web/viewer.html'
  },
  popup: false,
  downloadable: false,
  onRequestClose: () => null,
  onLastPage: () => null
}

export default PDF
