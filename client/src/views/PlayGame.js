import React from 'react';
import GamePhaser from '../Game/src/GamePhaser';
import {useDispatch } from 'react-redux';
import {isPlaying} from '../actions';

export default function PlayGame() {
  const dispatch = useDispatch();
  dispatch(isPlaying(true));
  return <GamePhaser />;
}
