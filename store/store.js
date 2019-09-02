import { createStore, combineReducers, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import Axios from 'axios';

const userInitialState = {}

const LOGOUT = 'LOGOUT'

// export function add(num) {
//   return {
//     type: ADD,
//     num,
//   }
// }

// export function addAsync(num) {
//   return dispatch => {
//     setTimeout(() => {
//       dispatch(add(num))
//     }, 2000)
//   }
// }

function userReducer(state = userInitialState, action) {
  switch (action.type) {
    case LOGOUT:
      return {}
    default:
      return state;
  }
}

const allReducers = combineReducers({ user: userReducer })

export function logout() {
  return dispatch => {
    Axios.post('./logout')
      .then(resp => {
        if (resp.status == 200) {
          dispatch({
            type: LOGOUT
          })
        } else {
          console.log('logout fail', resp)
        }
      }).catch(err => {
        console.log('logout fail', err)
      })
  }
}

export default function initializeStore(state) {
  const store = createStore(
    allReducers,
    Object.assign(
      {},
      {
        user: userInitialState,
      },
      state
    ),
    composeWithDevTools(applyMiddleware(ReduxThunk))
  )
  return store
}