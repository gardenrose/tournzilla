import {
    USER_LOADED_FAIL,
    USER_LOADED_SUCCESS, 
    LOGIN_SUCCESS, 
    LOGIN_FAIL, 
    LOGOUT, 
    AUTHENTICATED_SUCCESS, 
    AUTHENTICATED_FAIL,
    REGISTER_FAIL, 
    REGISTER_SUCCESS, 
    ACTIVATION_FAIL,
    ACTIVATION_SUCCESS,
    EMPTY_FIELDS,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS 
} from '../Constants';

    // za load user JWT xxxxx..., za create user Token xxxxx...  :O
export const loadUser = () => async dispatch => {
    if (localStorage.getItem('access')) {
        try {
        await fetch(`${process.env.REACT_APP_API_URL}/auth/users/me/`, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                dispatch ({
                    type: USER_LOADED_SUCCESS,
                    payload: data
                })
            }
            else dispatch ({
                type: USER_LOADED_FAIL,
                payload: data
            })
        })
        .catch(error => {
            dispatch ({
                type: USER_LOADED_FAIL,
                payload: error
            })
        });  
         
    } catch(err) {
        dispatch ({
            type: USER_LOADED_FAIL,
            payload: err
        });
    }
    } else {
        dispatch ({
            type: USER_LOADED_FAIL
        })
    }
};

export const checkAuthenticated = () => async dispatch => {
    if (localStorage.getItem('access')) {
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/auth/jwt/verify/`, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({token: localStorage.getItem('access')})
            })
            .then(response => response.json())
            .then(data => {
                if (data.code !== 'token_not_valid') {
                    dispatch ({
                        type: AUTHENTICATED_SUCCESS
                    });
                } else {
                    dispatch ({
                        type: AUTHENTICATED_FAIL
                    });
                }
            })
            .catch(error => {
                console.log(error)
                dispatch ({
                    type: AUTHENTICATED_FAIL
                });
            });
        } catch (err) {
            console.log(err)
            dispatch ({
                type: AUTHENTICATED_FAIL
            });
        }
    } else {
        dispatch ({
            type: AUTHENTICATED_FAIL
        });
    }
};

export const verify = (uid, token) => async dispatch => {
    try {
        await fetch(`${process.env.REACT_APP_API_URL}/auth/users/activation/`, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({"uid":uid, "token": token})
        })
        .then(data => data.json())
        .then(resp => {
            if (resp?.uid || resp?.detail) {
                dispatch({
                    type: ACTIVATION_FAIL,
                    payload: resp
                })
            }
            else {
                console.log("right here right now");
                console.log(resp.uid[0])
                dispatch({
                    type: ACTIVATION_SUCCESS
                })
            }
        })
        .catch(_ => 
            dispatch({
                type: ACTIVATION_FAIL
            })
        )
        
    } catch (err) {
        dispatch({
            type: ACTIVATION_FAIL
        })
    }
};

export const login = (uname, passwd) => async dispatch => {
    if (uname === "" || passwd === "") {
        dispatch({
            type: EMPTY_FIELDS,
            payload: null
        });
    } else {
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/auth/jwt/create/`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({"username":uname, "password":passwd})
             
            })
             .then(data => data.json())
             .then(response => {  
                if (response.access) {
                    //return response.json();
                    dispatch ({
                        type: LOGIN_SUCCESS,
                        payload: response
                     });
                     dispatch (loadUser());
                } else {
                    //throw new Error('Something went wrong ...');
                    dispatch ({
                        type: LOGIN_FAIL,
                        payload: response
                    })
                }
            })
             .catch(error => {
                 dispatch ({
                    type: LOGIN_FAIL
                 })
             });   
    
        } catch (error) {
            dispatch ({
                type: LOGIN_FAIL
             })
        }
    }
};

export const logout = () => dispatch => {
    dispatch ({
        type: LOGOUT
    });
};

export const register = (email, uname, passwd, re_passwd) => async dispatch => {
    if (email === "" || uname === "" || passwd === "" || re_passwd === "") {
        dispatch({
            type: EMPTY_FIELDS,
            payload: null
        });
    } else {
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/auth/users/`, {
                method: 'post',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    "username":uname, 
                    "email" : email,
                    "password":passwd, 
                    "re_password": re_passwd})
            })
            .then(data => data.json())
            .then(response => {
                const fd = new FormData()
                fd.append("achievementid",3)
                if (response.id) {
                    fetch(`/api/userachievements/${response.id}/`, {
                        method: 'post',
                        body: fd
                    })
                    dispatch({
                        type: REGISTER_SUCCESS,
                        payload: response
                    });
                } else {
                    dispatch({
                        type: REGISTER_FAIL,
                        payload: response
                    });
                }
            })
            .catch(error => {
                dispatch ({
                   type: REGISTER_FAIL
                })
            });
    
        } catch (error) {
            dispatch({
                type: REGISTER_FAIL
            })
        }
    }
};

export const resetPassword = (email) => async dispatch => {
    try {
        await fetch(`${process.env.REACT_APP_API_URL}/auth/users/reset_password/`, {
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({"email" : email})
        })
        .then(data => data.json())
        .then(_ => {
            dispatch({
                type: PASSWORD_RESET_SUCCESS
            });
        })
        .catch(_ => {
            dispatch({
                type: PASSWORD_RESET_FAIL
            });
        })
    } catch (_) {
        dispatch({
            type: PASSWORD_RESET_FAIL
        });
    }
};

export const resetPasswordConfirm = (uid, token, new_password, re_new_password) => async dispatch => {
    try {
        await fetch(`${process.env.REACT_APP_API_URL}/auth/users/reset_password_confirm/`, {
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                "uid" : uid,
                "token": token,
                "new_password": new_password,
                "re_new_password":re_new_password
            })
        })
        .then(data => data.json())
        .then(response => {
            if (!response.uid && !response.token) {
                dispatch({
                    type: PASSWORD_RESET_CONFIRM_SUCCESS
                });
            }
            else {
                dispatch({
                    type: PASSWORD_RESET_CONFIRM_FAIL,
                    payload: response
                });
            }
        })
        .catch(resp => {
            dispatch({
                type: PASSWORD_RESET_CONFIRM_FAIL,
                payload: resp
            });
        })
    } catch (err) {
        dispatch({
            type: PASSWORD_RESET_CONFIRM_FAIL,
            payload: err
        });
    }
};