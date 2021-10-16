import Axios from 'axios'
import * as Types from './types'
import jwtDecode from 'jwt-decode'
import setAuthToken from '../../utils/setAuthToken'

export const register = (user, history) => dispatch => {
    Axios.post('/api/users/register', user)
        .then((res) => {
            dispatch({
                type: Types.USERS_ERROR,
                payload: {
                    error: {}
                }
            })
            console.log(res)
            history.push('/login')
        })
        .catch(error => {
            dispatch({
                type: Types.USERS_ERROR,
                payload: {
                    error: error.response.data
                }
            })
        })
}

export const login = (user, history) => dispatch => {
    Axios.post('/api/users/login', user)
        .then(res => {
            let token = res.data.token
            // save token into local storage
            localStorage.setItem('auth_token', token)
             // set auth token
             setAuthToken(token)
            // decode token
            let decode = jwtDecode(token)
            // dispatch SET_USER
            dispatch({
                type: Types.SET_USER,
                payload: {
                    user: decode
                }
            })
            // after login redirect to next page
            history.push('/')
        })
        .catch(error => {
            console.log(error.response.data)
            dispatch({
                type: Types.USERS_ERROR,
                payload: {
                    error: error.response.data
                }
            })
        })
}

export const logout = (history) => {
    localStorage.removeItem('auth_token')
    history.push('/login')
    return {
        type: Types.SET_USER,
        payload: {
            user: {}
        }
    }
}