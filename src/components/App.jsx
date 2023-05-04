import { useState, useRef } from 'react'
import '../styles/App.css'
import { motion } from 'framer-motion'
//import Handle from './Handle'
function App() {
  const logEvent = (e) => {
    console.log({y: e.deltaY})
  }
  return (
    <>
      <div 
        className='box'
        onWheel={logEvent}
      >
      </div>
    </>
  )
}

export default App
