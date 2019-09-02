import App, { Container } from 'next/app'
import 'antd/dist/antd.css'
import { Provider } from 'react-redux'

import Layout from '../components/Layout'
import MyContext from '../lib/my-context'
import withRedux from '../lib/with-redux'

class MyApp extends App {
  static async getInitialProps(ctx) {
    console.log('app init')
    const { Component } = ctx
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return { pageProps }
  }
  render() {
    const { Component, pageProps, reduxStore } = this.props
    return (
      <Container>
        <Layout>
          <Provider store={reduxStore}>
            <MyContext.Provider value="context Value">
              <Component {...pageProps} />
            </MyContext.Provider>
          </Provider>
        </Layout>
      </Container>
    )
  }
}

export default withRedux(MyApp)