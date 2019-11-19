import moment from "moment"

const initialState = {uid: 0, nickname:'Newbie', email:'email@email.com', level: 2, experience: 123, color: 'red', phone: '+5491145215965', age: moment()};

const userReducer = (state = initialState, action) => {
    switch(action.type){
        case 'SET_USER':
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state
    }
}

export default userReducer;