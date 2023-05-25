import { useState } from 'react'
import '../styles/App.css'
//import Handle from './Handle'
import sFPlayer from "soundfont-player";
import MidiPlayer from 'midi-player-js';
import Song from '../assets/midi-pokemon-leagueNight2.mid'
import axios from 'axios';
import * as Tone from 'tone'

function App() {

  const synth =  new Tone.PolySynth().toDestination();

  const getInstrument = () => {
    return sFPlayer.instrument(
      new AudioContext(),
      'music_box'
    )
  };

  const getMidiPlayer = (midiURL = "") => {
    return axios
      .get(midiURL, {
        responseType: "arraybuffer",
        maxRedirects: 5
      })
      .then(response => {
        const Player = new MidiPlayer.Player();
        const {
          data: midiArrayBuffer
        } = response;
        Player.loadArrayBuffer(
          midiArrayBuffer
        );
        console.log(Player.isPlaying())
        return Player;
      });
  };

// const loadInstruments = (midiPlayer) => {
//   const midiInstruments = getMidiInstruments(midiPlayer)
//   const instrumentNames = [];
//   const instrumentPromises = [];
//   for (let instrument of midiInstruments) {
//     instrumentNames.push(instrument.name)
//     instrumentPromises.push(getInstrument())
//   }
//   return Promise.all(instrumentPromises)
//     .then(instruments =>
//       //instruments
//       instruments.reduce((acc, cur, i) => {
//         return {
//           ...acc,
//           [instrumentNames[i]]: cur
//         }
//       }, {})
//     ).catch(console.warn)
// }

  // Initialize player and register event handler
  const Player = getMidiPlayer(Song)
  console.log(Player)

  const [playing, setPlaying] = useState(false)

  const logEvent = (e) => {
    console.log({y: e.deltaY})

    if(!playing && Math.abs(e.deltaY) >= 4){
      setPlaying(true)
    }
    if(playing && Math.abs(e.deltaY) < 3){
      setPlaying(false)
    }
  }

  const playMusic = (e) =>{
    
    Player.then((item) => {

        item.play()
        item.on('midiEvent',(e)=>{
          if(e.noteName){
            const now = Tone.now()
            console.log(e)
            synth.triggerAttackRelease(e.noteName, '4n',now)
          }
      })
    });
  }
  return (
    <>
      <div 
        className='box'
        onClick={playMusic}
      >
      </div>
    </>
  )
}

export default App
