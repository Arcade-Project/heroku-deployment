import { createSelector } from 'reselect'

const selectAllFriends = state => state.profile.profile_user.friends;
const selectAllRequests = state => state.profile.profile_user.requests;
const selectMyUid = state => state.user.uid;

export const checkAreFriends = createSelector(
  selectAllFriends,
  selectMyUid,
  selectAllFriends => selectAllFriends.includes(selectMyUid)
);

export const checkIsPending = createSelector(
    selectAllRequests,
    selectMyUid,
    selectAllRequests => selectAllRequests.includes(selectMyUid)
);