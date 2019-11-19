const appReducer = (state={isMobile: false}, action) => {
    switch(action.type){
        case 'MOBILE':
            return {
                ...state,
                isMobile: action.payload
            }
        case 'PLAYING':
            return {
                ...state,
                isPlaying: action.payload
            }
        default:
            return state
    }
}

export default appReducer;