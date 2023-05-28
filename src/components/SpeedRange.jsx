import { useState } from 'react';
import debounce from 'lodash/debounce'


const SpeedRange = ({ midiRef, tempoLowerBound, tempoUpperBound }) => {
    
    const delay = 300;
    tempoLowerBound = String(tempoLowerBound); //default 120
    tempoUpperBound = String(tempoUpperBound);
    const [currentSpeed, setCurrentSpeed] = useState(120);

    const onSpeedChange = (e) => {
        midiRef.pause();
        console.log('changing to this speed:', e.target.valueAsNumber)
        midiRef.setTempo(e.target.valueAsNumber)
        setCurrentSpeed(e.target.valueAsNumber)
        midiRef.play();
    }

    const throttledOnSpeedChange = debounce(onSpeedChange, delay);

    return (
        <div>
            <p className='speed-label'>{currentSpeed}</p>
            <input
                className='song-speed-range'
                type="range"
                min={tempoLowerBound}
                max={tempoUpperBound}
                onChange={throttledOnSpeedChange}
            />
        </div>
    );
}

export default SpeedRange;