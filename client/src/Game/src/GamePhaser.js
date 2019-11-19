import React, {useEffect} from 'react'
import {useSelector} from 'react-redux'
import {Row} from 'antd'
import Pong from './scenes/Pong'
import HeadSoccer from './scenes/HeadSoccer'
import HangMan from './scenes/HangMan'
import ChooseGame from './scenes/ChooseGame'
import Phaser from 'phaser'

export default function GamePhaser() {

const isMobile = useSelector(state => state.app.isMobile);


  const config = {
    width: 900,
    height: 500,
    parent: "phaser-container",
    physics: {
        default: "arcade",
        arcade: {debug: false}
    },
    scene: [
      ChooseGame,Pong,HeadSoccer,HangMan
    ]
  }

    if (isMobile){
      config.width = 550;
      config.height = 300;
    }

  useEffect(() => {
    const game = new Phaser.Game(config);
    return function destroyGame(){
      game.destroy(true,false); //el primero elimina el canvas, el 2do lo descarga en memoria
    }
  }, [config])

  return (
    <Row type="flex" justify="space-around" align="middle">
    <div className="phaserContainer" id="phaser-container" />
    </Row>
  )
}

