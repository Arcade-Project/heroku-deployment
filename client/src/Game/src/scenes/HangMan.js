import Phaser from 'phaser';
import axios from 'axios';
import getStore from '../getStore';

export default class HangMan extends Phaser.Scene {
  constructor() {
    super({ key: 'HangMan' });
    this.wordList = [
      'elefante',
      'autopista',
      'zapallo',
      'iglu',
      'papaya',
      'zocalo',
      'xilofon',
      'mercaderia',
      'jupiter',
      'diego',
      'koala'
    ];
    this.randomWord = this.chooseRandomWord(this.wordList);
    this.lettersChoosen = [];
    this.secretWord = this.createSecretWord(this.randomWord);
    this.lives = 5;
    this.livesHUD = {};
    this.failLetters = [];
    this.failHUD = {};
  }

  preload() {
    this.load.image('hearth', 'assets/HangMan/corazon.png');
    getStore.call(this);
    console.log(this.data.get('store'));
  }

  create() {
    this.add.text(270, 140, this.secretWord.join(' '), {
      fontSize: 40,
      fontColor: 'white'
    });
    this.createLives();

    this.failHUD = this.add.text(
      0,
      250,
      `failed: ${this.failLetters.toString()}`,
      { fontSize: 30, fill: 'red' }
    );

    this.letterA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.letterB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
    this.letterC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    this.letterD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.letterE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.letterF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    this.letterG = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
    this.letterH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
    this.letterI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
    this.letterJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    this.letterK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    this.letterL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
    this.letterM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    this.letterN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
    this.letterÑ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Ñ);
    this.letterO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
    this.letterP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.letterQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.letterR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.letterS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.letterT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
    this.letterU = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
    this.letterV = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
    this.letterW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.letterX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.letterY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);
    this.letterZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
  }

  update() {
    this.listenKeys();
    this.checkFinished();
  }

  createLives() {
    this.livesHUD = this.add.group();

    for (var row = 0; row >= 0; row--) {
      for (var i = this.lives - 1; i >= 0; i--) {
        var icon = this.livesHUD.create(
          25 + (32 + 2) * i,
          25 + (32 + 2) * row,
          'hearth'
        );
        //icon.anchor.setTo(0, 0);
        icon.setScale(0.1); // improve this so we actually scale to width?
        icon.width = 10;
        icon.height = 10;
      }
    }
  }

  chooseRandomWord(wordList) {
    let number = Math.floor(Math.random() * (this.wordList.length - 1)) + 1;
    let word = wordList[number];
    return word;
  }

  createSecretWord(randomWord) {
    let result;
    result = randomWord.split('');
    for (let i = 1; i < randomWord.length - 1; i++) {
      result[i] = '-';
    }
    return result;
  }
  listenKeys() {
    if (this.letterA.isDown) {
      this.chooseLetter('A');
    } else if (this.letterB.isDown) {
      this.chooseLetter('B');
    } else if (this.letterC.isDown) {
      this.chooseLetter('C');
    } else if (this.letterD.isDown) {
      this.chooseLetter('D');
    } else if (this.letterE.isDown) {
      this.chooseLetter('E');
    } else if (this.letterF.isDown) {
      this.chooseLetter('F');
    } else if (this.letterG.isDown) {
      this.chooseLetter('G');
    } else if (this.letterH.isDown) {
      this.chooseLetter('H');
    } else if (this.letterI.isDown) {
      this.chooseLetter('I');
    } else if (this.letterJ.isDown) {
      this.chooseLetter('J');
    } else if (this.letterK.isDown) {
      this.chooseLetter('K');
    } else if (this.letterL.isDown) {
      this.chooseLetter('L');
    } else if (this.letterM.isDown) {
      this.chooseLetter('M');
    } else if (this.letterN.isDown) {
      this.chooseLetter('N');
    } else if (this.letterÑ.isDown) {
      this.chooseLetter('Ñ');
    } else if (this.letterO.isDown) {
      this.chooseLetter('O');
    } else if (this.letterP.isDown) {
      this.chooseLetter('P');
    } else if (this.letterQ.isDown) {
      this.chooseLetter('Q');
    } else if (this.letterR.isDown) {
      this.chooseLetter('R');
    } else if (this.letterS.isDown) {
      this.chooseLetter('S');
    } else if (this.letterT.isDown) {
      this.chooseLetter('T');
    } else if (this.letterU.isDown) {
      this.chooseLetter('U');
    } else if (this.letterV.isDown) {
      this.chooseLetter('V');
    } else if (this.letterW.isDown) {
      this.chooseLetter('W');
    } else if (this.letterX.isDown) {
      this.chooseLetter('X');
    } else if (this.letterY.isDown) {
      this.chooseLetter('Y');
    } else if (this.letterZ.isDown) {
      this.chooseLetter('Z');
    }
  }

  chooseLetter(letter) {
    if (this.lettersChoosen.includes(letter)) {
      //do nothing
      console.log('ya la usaste');
    } else {
      this.lettersChoosen.push(letter);
      this.checkLetter(letter);
    }
  }
  checkLetter(letter) {
    let letterToCheck = letter.toLowerCase();
    if (this.randomWord.includes(letterToCheck)) {
      Array.from(this.randomWord).forEach((element, i) => {
        if (element === letterToCheck) {
          this.secretWord[i] = letterToCheck;
        }
      });
      this.updateSecretWord();
    } else {
      this.fail(letter);
      this.updateLives();
    }
  }

  fail(letter) {
    this.failLetters.push(letter);
    this.failHUD.setText(`failed: ${this.failLetters.toString()}`);
  }
  updateSecretWord() {
    console.log(this);
    this.add.text(270, 140, this.secretWord.join(' '), {
      fontSize: 40,
      fontColor: 'white',
      backgroundColor: 'black'
    });
  }

  checkFinished() {
    if (this.lives <= 0) {
      this.add.text(10, 65, 'Game over', {
        fontSize: 160,
        fontColor: 'white',
        backgroundColor: 'black'
      });
    }
    if (this.randomWord === this.secretWord.join('')) {
      this.add.text(20, 65, 'GANASTE', {
        fontSize: 180,
        fontColor: 'white',
        backgroundColor: 'black'
      });
      axios.post('/score/save', {
        uid: this.data.get('store').user.uid,
        game: 'HangMan',
        score: this.lives * 100
      }, {timeout: 10000});
      this.scene.pause();
    }
  }

  updateLives() {
    this.lives = this.lives - 1;
    var vidas = this.livesHUD.getChildren();
    var vida = Phaser.Utils.Array.RemoveAt(vidas, 0);
    if (vida) {
      vida.destroy();
    }
    // this.add.text(0,0, `vidas: ${this.lives}`, {fontSize: 40, fontColor: 'red', backgroundColor: 'black'})
  }
}
