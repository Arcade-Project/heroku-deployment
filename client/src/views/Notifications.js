import React, {useEffect, useState} from 'react';
import { Typography, Card, List, Avatar, Spin, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {isPlaying} from '../actions';

export default function Notifications() {
  const dispatch = useDispatch();
  const getUid = useSelector(state=> state.user.uid);
  const isMobile = useSelector(state=> state.app.isMobile);
  dispatch(isPlaying(false));
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [refresh, setRefresh] = useState([false]);

  useEffect(()=>{
    setLoading(true);
    axios.post('/user/notifications', {uid: getUid})
    .then(res => {
      setNotifications(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.log(err)
      setLoading(false);
    })
  },[getUid,refresh]);

  const getWidth = () => {
    if(isMobile){
      return '80vw';
    }else{
      return '60vw'
    }
  }

  const acceptFriend = (e) => {
    let which = (e.target.getAttribute('uid'));
    axios.post('/user/acceptFriend', {myid: getUid, friend: which}).then().catch();
    setRefresh(!refresh);
  }

  const declineFriend = (e) => {
    let which = (e.target.getAttribute('uid'));
    axios.post('/user/declineFriend', {myid: getUid, friend: which}).then().catch();
    setRefresh(!refresh);
  }

  if (loading) return <Spin size="large" />
  return (
    <React.Fragment>
    <Card style={{width: getWidth(), height: '80vh'}}>
      <Typography.Title level={1}>Notifications</Typography.Title>
      <List
      itemLayout="horizontal"
      dataSource={notifications}
      renderItem={item => (
        <List.Item actions={[<Button key="accept" onClick={acceptFriend} uid={item.uid}>Accept</Button>, <Button key="decline" onClick={declineFriend}>Decline</Button>]}>
          <List.Item.Meta
            avatar={<Avatar icon='user-add' />}
            title={<Link to={`profile/${item.uid}`}>{item.nickname}</Link>}
            description="Quiere ser tu amigo"
          />
        </List.Item>
      )}
    />
    </Card>
      
    </React.Fragment>
  );
}
