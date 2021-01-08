import {createContext, useReducer} from 'react';


export const AppContext = createContext();


const initialState = {
    isLogin : false,
    id: 0,
    fullname : "",
    greeting : "Your Greetings",
    avatar : "",
    email : "",
    keyword : "",
    isLoading : true// cek ketersedian token
}

const reducer = (state, action) => {
    const {payload, type} = action;

    switch (type) {
        case "KEYWORD_SEARCH" :
            return {
                ...state,
                keyword : payload
            }
        case "USER_LOADED":
        return {
            ...state,
            keyword : '',
            isLogin: true,
            isLoading: false,            
            id : payload.id,
            fullname : payload.fullname,
            greeting : payload.greeting,
            avatar : payload.avatar,
            email : payload.email
        };
        case "LOGIN":
            // membuat token di localstorage
            localStorage.setItem("token", payload.token);

            return {
                ...state,
                isLogin : true,
                id : payload.id,
                fullname : payload.fullname,
                avatar : payload.avatar,
                email : payload.email
            }
        case "AUTH_ERROR":
        case "LOGOUT":
            localStorage.removeItem("token");
            return {
                ...state,
                isLogin : false,
                isLoading: false
            }    
        default:
            throw new Error();
    }
}


export const AppContextProvider = (props) => {

    // state = inital state
    // dispatch  = reducer

    const [state, dispatch] = useReducer(reducer, initialState);
    

    return (
        <AppContext.Provider value={[state, dispatch]}>
            {props.children}
        </AppContext.Provider>

    )
}
