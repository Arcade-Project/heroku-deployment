import React, { useState, useEffect } from 'react';
import {
  Typography,
  Progress,
  Card,
  List,
  Avatar,
  Divider,
  Button,
  Spin,
  Badge,
  Icon
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import firebase from 'firebase';
import { Redirect, useParams } from 'react-router-dom';
import axios from 'axios';
import {checkAreFriends, checkIsPending} from '../selectors/index';
import { isAuthenticated, isPlaying, setProfile, addVisited } from '../actions';

export default function Profile() {
  const calculateLevel = experience => Math.floor(experience / 50);
  const percentToNextLevel = experience =>
    (experience / 50 - calculateLevel(experience)) * 100;

  const dispatch = useDispatch();
  dispatch(isPlaying(false));
  const { id } = useParams();
  const [redirectHome, setRedirectHome] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selfProfile] = useState(!id);

  const getNickName = useSelector(state => state.profile.profile_user.nickname);
  const getEmail = useSelector(state => state.profile.profile_user.email);
  const getAge = useSelector(state => state.profile.profile_user.age);
  const getPhone = useSelector(state => state.profile.profile_user.phone);
  const getLevel = useSelector(state => state.profile.profile_user.level);
  const getActivity = useSelector(state => state.profile.profile_user.activity);
  const getMyUid = useSelector(state => state.user.uid);
  
  const checkFriend = useSelector(checkAreFriends);
  const checkPending = useSelector(checkIsPending);
  
  const [areFriends, setAreFriends] = useState(checkFriend);
  const [isPending, setIsPending] = useState(checkPending);

  const user = useSelector(state => state.user);

  const isMobile = useSelector(state => state.app.isMobile);
  const getVisited = useSelector(state => state.profile.visited);

  useEffect(() => {
    const checkProfile = async () => {
      if (id) {
        if (getVisited.filter(profile => profile.uid === id).length > 0) {
          console.log('Perfil ya visitado');
          dispatch({
            type: 'PROFILE_USER',
            payload: getVisited.filter(profile => profile.uid === id)[0]
          });
          setLoading(false);
        } else {
          setLoading(true);
          console.log('Buscando Perfil...');
          await axios
            .post('/user/profile', { id })
            .then(res => {
              dispatch(setProfile(res.data));
              setLoading(false);
              dispatch(addVisited(res.data));
            })
            .catch(err => console.log(err, 'error fetch profile'));
        }
      } else {
        console.log('Entraste a tu perfil');
        dispatch(setProfile(user));
        setLoading(false);
      }
    };
    checkProfile();
  }, [id, getVisited, user, dispatch]);

  const calcWidth = () => {
    if (isMobile) {
      return '80vw';
    } else {
      return '20vw';
    }
  };

  if (loading) return <Spin size='large' />;

  const data = [
    {
      title: 'User Name',
      icon: 'user',
      info: getNickName
    },
    {
      title: 'Email',
      icon: 'mail',
      info: getEmail
    },
    {
      title: 'Birthday',
      icon: 'calendar',
      info: moment(getAge).format('D/MM/YYYY')
    },
    {
      title: 'Phone',
      icon: 'phone',
      info: getPhone
    }
  ];

  const logOut = () => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.
        dispatch(isAuthenticated(false));
        sessionStorage.clear();
        setRedirectHome(true);
      })
      .catch(function(error) {
        // An error happened.
        console.log(error, 'error logout');
      });
  };

  const addFriend = () => {
    axios
      .post('/user/addFriend', {
        myid: user.uid,
        friend: id
      })
      .then(res => {
        if (res.data.done) setIsPending(true);
      }); // y porque esto no vuelve a renderizar
  };
  const removeFriend = () => {
    axios
      .post('/user/removeFriend', {
        myid: user.uid,
        friend: id
      })
      .then(res => {
        if (res.data.done) setAreFriends(false);
      }); // y porque esto no vuelve a renderizar
  };

  const friendSystem = () => {
    
    if (areFriends) {
      return (
        <Button icon='user-delete' onClick={removeFriend}>
          Remove Friend
        </Button>
      );
    } else {
      if (isPending) {
        return (
          <Button icon='loading' disabled>
            Pending
          </Button>
        );
      }
      if (id && id !== getMyUid) {
        return (
          <Button icon='user-add' onClick={addFriend}>
            Add Friend
          </Button>
        );
      }
    }
  };

  const myProfileButtons = (
    <div>
      <Button icon='poweroff' onClick={logOut}>
        Log Out
      </Button>
    </div>
  );

  const showStatus = () => { // sacar el badge y probar grilla
    // y porque esto renderiza uno encima de otro
    let isOnline = moment(getActivity).isBetween(
      moment().subtract(5, 'minutes'),
      moment()
    );
    return (
      <React.Fragment>
        {isOnline && (
          <Badge
            count={
              <Icon
                type='clock-circle'
                style={{
                  color: 'lime',
                  fontSize: 24
                }}
              />
            }
          />
        )}
        {areFriends && (
          <Badge
            count={
              <Icon
                type='heart'
                style={{
                  color: 'red',
                  fontSize: 24
                }}
              />
            }
          />
        )}
      </React.Fragment>
    );
  };

/*   const debugthis = () => console.log(
    'areFriends: ',
    areFriends,
    ' PENDING: ',
    isPending,
    ' id: ',
    id,
    ' getMyUid',
    getMyUid,
    ' friends: ',
    getFriends,
    ' requests: ',
    getRequests
  ); //debugger */

  if (redirectHome) return <Redirect to='/' />;

  return (
    <React.Fragment>
      <Card
        className='centered-div'
        style={{
          width: calcWidth(),
          height: '80vh',
          color: 'yellow'
        }}>
        <div style={{ textAlign: 'center' }}>
          {showStatus()}
          <Typography.Title level={2} style={{ paddingBottom: 35 }}>
            {getNickName}
          </Typography.Title>
          <Progress
            percent={percentToNextLevel(user.experience)}
            type='circle'
            format={() => getLevel}></Progress>
        </div>
        <div
          style={{
            marginTop: 15,
            textAlign: 'center'
          }}>
          {friendSystem()}
        </div>
        <Divider />
        <List
          itemLayout='horizontal'
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={item.icon} />}
                title={item.title}
                description={item.info}
              />
            </List.Item>
          )}
        />
        <Divider />
        {selfProfile && myProfileButtons}
      </Card>
    </React.Fragment>
  );
}
