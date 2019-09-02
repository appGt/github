import React from 'react'
import createStore from '../store/store'
const isServer = typeof window === 'undefined'
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

function getOrCreateStore(initialState) {
  if (isServer) {
    return createStore(initialState)
  }

  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = createStore(initialState)
  }

  return window[__NEXT_REDUX_STORE__]
}

export default Comp => {
  class WithRedux extends React.Component {

    constructor(props) {
      super(props)
      this.reduxStore = getOrCreateStore(props.initialReduxState)
    }

    render() {
      const { Component, pageProps, ...res } = this.props
      if (pageProps) {
        pageProps.test = '123'
      }

      return <Comp Component={Component} pageProps={pageProps} {...res} reduxStore={this.reduxStore} />
    }
  }


  WithRedux.getInitialProps = async (ctx) => {
    let reduxStore

    if (isServer) {
      const { req } = ctx.ctx
      const session = req.session

      if (session && session.user) {
        reduxStore = getOrCreateStore({ user: session.user })
      } else {
        reduxStore = getOrCreateStore()
      }
    } else {
      reduxStore = getOrCreateStore()
    }

    ctx.reduxStore = reduxStore

    let appProps = {}
    if (typeof Comp.getInitialProps === 'function') {
      appProps = await Comp.getInitialProps(ctx)
    }

    return {
      ...appProps,
      initialReduxState: reduxStore.getState(),
    }
  }
  return WithRedux
}