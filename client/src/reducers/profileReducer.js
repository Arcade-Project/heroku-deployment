const initialState = {visited: [], 
  profile_user: {
    level: 0,
    experience: 0,
    games: [],
    friends: [],
    requests: [],
    _id: '',
    uid: '',
    fullname: '',
    nickname: '',
    email: '',
    country: '',
    prefix: '',
    phone: '',
    birthday: '',
    register_date: '',
    activity: ''
  }
};
const profileReducer = (state= initialState, action) => {
  switch (action.type) {
    case 'PROFILE_USER':
      return {
        ...state,
        profile_user: action.payload
      };
      case 'ADD_VISITED_PROFILE':
        return {
          ...state,
          visited: state.visited.concat(action.payload)
        }
    default:
      return state;
  }
};

export default profileReducer;
