import { useState, useEffect } from 'react';
import axios from 'axios';
import soundfontPlayer from 'soundfont-player';

import { getInstrumentName } from '../util/get-instrument-name';
import { getInstrument, loadInstruments } from '../util/load-instrument';

import MidiPlayer from 'midi-player-js';

import SpeedRange from './SpeedRange'

const loadMidi = async url => {
  const { data } = await axios.get(url, {
    headers: {"Access-Control-Allow-Origin": "*"},
    responseType: 'arraybuffer'
  });
  return data;
};

const getNoteKey = ({ noteName, track, channel }) => {
  return `${noteName}_${track}_${channel}`;
};

const smooshObjs = (obj1, obj2) => {
  return Object.assign({}, obj1, obj2);
};

const midiEventsToNoteActions = midiEvent => {
  const {
    channel,
    noteName,
    track,
    name: midiEventType
  } = midiEvent;

  const noteKey = getNoteKey({ noteName, track, channel });
  const instrumentName = getInstrumentName(channel);

  if (midiEventType === 'Note on') {
    return {
      type: 'NOTE_ON',
      payload: {
        key: noteKey,
        instrumentName,
        channel,
        noteName
      }
    };
  } else if (midiEventType === 'Note off') {
    return {
      type: 'NOTE_OFF',
      payload: {
        key: noteKey,
        instrumentName,
        channel,
        noteName
      }
    };
  } else {
    return null;
  }
};

const possibleMidiPlayerStates = {
  paused: 'paused',
  playing: 'playing',
  stopped: 'stopped'
};

const possibleLoadingStates = {
  loading: 'loading',
  loaded: 'loaded',
  errored: 'errored'
};

let playingNotes = {};

const playNote = ({ instrument, noteName, noteKey }) => {
  console.log('playing inst', instrument)
  if (!(noteKey in playingNotes)) {
    playingNotes[noteKey] = [];
  }
  playingNotes[noteKey].push(instrument.play(noteName));
};

const midiPlayer = new MidiPlayer.Player()

const Player = ({ url }) => {

  const [areInstrumentsLoaded, setAreInstrumentsLoaded] = useState(false)
  const [playableInstruments, setPlayableInstruments] = useState([])
  const [tempo, setTempo] = useState(120)

  useEffect(()=>{
    const readyMidi = async () => {
      const midi = await loadMidi(url)
      midiPlayer.loadArrayBuffer(midi)
      const instruments = await loadInstruments(midiPlayer)
      console.log('loading inst', instruments)
      setPlayableInstruments(instruments)
      setAreInstrumentsLoaded(true)

      midiPlayer.on('midiEvent', midiEvent => {
        console.log('midiEvent', midiEvent)
        const action = midiEventsToNoteActions(midiEvent)
        if (action === null) return;
        const { payload, type } = action
        const {
          instrumentName,
          noteName,
          key,
          channel
        } = payload;
        if ((!channel) in instruments) {
          console.error(`${instrumentName} not loaded`);
          return;
        }
        // console.log('payload', payload)
        // console.log('type', type)
        // console.log('instruments',instruments)
        switch (type) {
          case 'NOTE_ON': {
            // console.log('inst to be played', instruments[channel])
            console.log('channel', channel)
            playNote({
              instrument: instruments[channel] ?? instruments[0],
              noteName,
              noteKey: key
            });
          }
          case 'NOTE_OFF': {
            console.log('Left as an exercise to the reader');
          }
          default: {
            return;
          }
        }
      })
    }
    readyMidi()
  },[midiPlayer, url])

  return (
    <div>
      {areInstrumentsLoaded ? (
        <div>
          Loaded
          <button
            onClick={async () => {
              console.log('play')
              await midiPlayer.play();
            }}
          >
            Play
          </button>
          <button
            onClick={() => {
              console.log('pause')
              midiPlayer.pause();
            }}
          >
            Pause
          </button>
          <button
            onClick={() => {
              console.log('stop')
              midiPlayer.stop();
            }}
          >
            Stop
          </button>


          <SpeedRange 
            midiRef={ midiPlayer }
            tempoUpperBound={240}
            tempoOLowerBound={60}
          />
          
        </div>
      ) : (
        'Loading Instruments'
      )}
    </div>
  );
}

export default Player



// ReactMidiPlayer.defaultProps = {
//   midiPlayer: null,
//   midiPlayerState: ''
// };

// class ReactMidiPlayerDemo extends React.Component {
//   render() {
//     const { url } = this.props;
//     return (
//       <div>
//         ReactMidiPlayerDemo Playing url : {url}
//         <ReactMidiPlayer url={url} />
//       </div>
//     );
//   }
// }