//APP
export const isPlaying = (boolean) => {
    return {
        type: 'PLAYING',
        payload: boolean
    }
}

export const isMobile = (boolean) => {
    return {
        type: 'MOBILE',
        payload: boolean
    }
}

//AUTH
export const isAuthenticated = (boolean) => {
    return {
        type: 'AUTHENTICATION',
        payload: boolean
    }
}

export const setErrorMessage = (msg) => {
    return {
        type: 'ERROR_MESSAGE',
        payload: msg
    }
}

export const setUser = (user) => {
    return {
        type: 'SET_USER',
        payload: user
    }
}

//PROFILE 

export const setProfile = (profile) => {
    return {
        type: 'PROFILE_USER',
        payload: profile
    }
}

export const addVisited = (profile) => {
    return {
        type: 'ADD_VISITED_PROFILE',
        payload: profile
    }
}