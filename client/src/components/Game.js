import React, { Component } from 'react'
import Phaser from 'phaser'

export default class Game extends Component {
    componentDidMount() {
        this.game = new Phaser.Game(800, 400, Phaser.AUTO, "phaser-container", 
        { 
            create: this.create,
            update: this.update
        }
     );
    }
    
  render() {
    return (
        <div className="phaserContainer" id="phaser-container">
        </div>
    )
  }
}
