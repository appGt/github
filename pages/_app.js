import App, { Container } from 'next/app'
import 'antd/dist/antd.css'
import { Provider } from 'react-redux'
import Router from 'next/router'
import Link from 'next/link'

import MyLayout from '../components/Layout'
import withRedux from '../lib/with-redux'
import PageLoading from '../components/PageLoading'
import Axios from 'axios';

class MyApp extends App {
  state = {
    loading: false
  }

  static async getInitialProps(ctx) {
    console.log('app init')
    const { Component } = ctx
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    console.log('app init', pageProps)
    return { pageProps }
  }

  startLoading = () => {
    console.log(this.props)
    this.setState({
      loading: true,
    })
  }

  stopLoading = () => {
    console.log(this.props)
    this.setState({
      loading: false,
    })
  }

  componentDidMount() {
    Router.events.on('routeChangeStart', this.startLoading)
    Router.events.on('routeChangeComplete', this.stopLoading)
    Router.events.on('routeChangeError', this.stopLoading)
  }

  componentWillUnmount() {
    Router.events.off('routeChangeStart', this.startLoading)
    Router.events.off('routeChangeComplete', this.stopLoading)
    Router.events.off('routeChangeError', this.stopLoading)
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props
    return (
      <Container>
        <Provider store={reduxStore}>
          {this.state.loading ? <PageLoading /> : null}
          <MyLayout>
            <Component {...pageProps} />
          </MyLayout>
        </Provider>
      </Container>
    )
  }
}

export default withRedux(MyApp)