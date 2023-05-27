import { useState, useEffect } from 'react';

const SpeedRange = ({setSpeed, speed}) => {
    const defaultTime = 300;
    const tempoLowerBound = '60'; //default 120
    const tempoUpperBound = '240';
    
    const [currentSpeed, setCurrentSpeed] = useState(speed);
    const [timer, setTimer] = useState(defaultTime) //play around wiht the timer speed
    return (
        <div>
            <p className='speed-label'>{currentSpeed}</p>
            <input
                className='song-speed-range'
                type="range"
                min='60'
                max='240'
                onChange={
                (e)=>{
                    let timer = setTimeout(() => {
                    midiPlayer.setTempo(e.target.valueAsNumber)
                    }, 100);
                }
                }
            />
        </div>
    );
}

export default SpeedRange;