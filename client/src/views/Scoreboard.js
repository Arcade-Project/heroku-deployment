import React, { useEffect, useState } from 'react';
import { Card, Table, Select } from 'antd';
import { useDispatch } from 'react-redux';
import {Link} from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import {isPlaying} from '../actions';

export default function Scoreboard() {
  const dispatch = useDispatch();
  dispatch(isPlaying(false));
  const [isAll, setIsAll] = useState(true);
  
  const { Option } = Select;

  const dummy = [
    {
      key: '1',
      name: 'Mike',
      score: 32
    },
    {
      key: '2',
      name: 'John',
      score: 42
    }
  ];

  const games = ['All', 'Pong', 'HangMan', 'HeadSoccer'];

  const [scores, setScores] = useState(dummy);

  useEffect(()=>{
          axios.get('/score/high', {timeout: 100000})
          .then(res => setScores(res.data))
          .catch(err => console.log('error get score', err))
  },[]);

  const allColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, item) => (<Link to={`profile/${item.uid}`}>{text}</Link>),
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => moment(text).fromNow()
    },
    {
      title: 'Game',
      dataIndex: 'game',
      key: 'game',
    },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, item) => (<Link to={`profile/${item.uid}`}>{text}</Link>),
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => moment(text).fromNow()
    }
  ];

  const onGameChange = e => {
    if (e === 'All'){
      setIsAll(true);
      axios.get('/score/high', {timeout: 100000})
          .then(res => setScores(res.data))
          .catch(err => console.log('error get score', err))
    }else{
      setIsAll(false);
      axios.post('/score/from_game', {game: e}, {timeout: 10000})
          .then(res => setScores(res.data))
          .catch(err => console.log('error get score', err))
    }
    
  };

 

  console.log(scores)
  return (
    <React.Fragment>
    <Card className='centered-div' style={{ width: '80vw', maxHeight: '100%', overflow: 'auto' }}>
    <Select defaultValue="All" style={{ minWidth: 120 }} onChange={onGameChange}>
    {games.map((game, index) => <Option ref={index} value={game}>{game}</Option>)}
  </Select>
      <Table dataSource={scores} columns={isAll ? allColumns : columns} style={{maxHeight: '100%', overflow: 'auto'}}/>
    </Card>
  </React.Fragment>
  );
}
