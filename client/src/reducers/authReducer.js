const authReducer = (state={}, action) => {
    switch(action.type){
        case 'AUTHENTICATION':
            return {
                ...state,
                isAuthenticated: action.payload
            }
        case 'ERROR_MESSAGE':
            return {
            ...state,
            error: action.payload
        }    
        default:
            return state
    }
}

export default authReducer;