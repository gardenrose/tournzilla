import {
    USER_LOADED_FAIL, 
    USER_LOADED_SUCCESS, 
    LOGIN_SUCCESS, 
    LOGIN_FAIL,
    LOGOUT,
    AUTHENTICATED_FAIL,
    AUTHENTICATED_SUCCESS,
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_SUCCESS,
    ACTIVATION_FAIL,
    ACTIVATION_SUCCESS,
    EMPTY_FIELDS,
    unknownErrorMsg,
    registerSuccessMsg,
    emptyFieldMsg
} from '../Constants';

const initialState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: null,
    message:null,
    user: null
};

export default function(state=initialState, action) {
    const { type, payload } = action;
    switch(type) {
        case AUTHENTICATED_SUCCESS:
            return {
                ...state,
                message:null,
                isAuthenticated: true
            }
        case LOGIN_SUCCESS:
            localStorage.setItem('access', payload.access);
            return {
                ...state,
                message:null,
                isAuthenticated: true,
                access: payload.access,
                refresh: payload.refresh
            }
        case LOGIN_FAIL:
        case LOGOUT:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                access: null,
                refresh: null,
                message: payload?.detail ?? unknownErrorMsg,
                isAuthenticated: false,
                user: null
            }
        case REGISTER_FAIL:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                access: null,
                refresh: null,
                message: payload?.username 
                    ? "Username: " + payload.username[0] 
                    : payload?.password 
                    ? "Password: " + payload?.password[0] 
                    : payload?.email 
                    ? "Email: " + payload.email[0]
                    : payload?.non_field_errors
                    ? "Re-password: " + payload.non_field_errors[0]
                    : unknownErrorMsg,
                isAuthenticated: false,
                user: null
            }
        case USER_LOADED_SUCCESS:
            return {
                ...state,
                message: null,
                user: payload
            }
        case AUTHENTICATED_FAIL:
            return {
                ...state,
                isAuthenticated: false
            }
        case USER_LOADED_FAIL:
            return {
                ...state,
                user: null
            }
        case REGISTER_SUCCESS:
            return {
                ...state,
                message: registerSuccessMsg,
                isAuthenticated: false
            }
        case PASSWORD_RESET_SUCCESS:
        case PASSWORD_RESET_CONFIRM_SUCCESS:
        case ACTIVATION_SUCCESS:
        case PASSWORD_RESET_FAIL:
            return {
                ...state
            }
        case PASSWORD_RESET_CONFIRM_FAIL:
        return {
            ...state,
            message: payload?.token 
                ? payload.token[0]
                : payload?.uid 
                ? payload.uid[0]
                : null
        }
        case ACTIVATION_FAIL:
            return {
                ...state,
                message: payload?.detail 
                    ? payload.detail
                    : payload?.uid 
                    ? payload.uid[0]
                    : null
            }

        case EMPTY_FIELDS:
            return {
                ...state,
                message: emptyFieldMsg,
                isAuthenticated: false,
                user: null
            }
        default:
            return state;
    }
};