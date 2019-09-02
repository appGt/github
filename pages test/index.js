import './index.css'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { add } from '../store/store'
import getConfig from 'next/config'
import Axios from 'axios';

const { publicRuntimeConfig } = getConfig()

const Index = ({ count, user, changeName, add }) => {

  useEffect(() => {
    Axios.get('/api/user/info').then(resp => console.log(resp))
  }, [])

  return (
    <div>
      <p>count: {count},My name is {user.name}</p>
      <p>age is {user.age}</p>
      <button onClick={e => add(count)}>add</button>
      <input type="text" value={user.name} onChange={e => changeName(e.target.value)} />
      <a href={publicRuntimeConfig.OAUTH_URL}>去登陆</a>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    count: state.counter.count,
    user: state.user,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeName: name => {
      dispatch({
        type: 'UPDATE_NAME',
        name,
      })
    },
    add: num => {
      dispatch({
        type: 'ADD',
        num,
      })
    }
  }
}

Index.getInitialProps = async ({ reduxStore }) => {
  reduxStore.dispatch(add(3))
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
