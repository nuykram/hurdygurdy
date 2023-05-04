import { useState, useRef } from 'react'

const Handle = () => {
    const [scrollProgress, setScrollProgress] = useState(0)
    const onScroll = ({ target: { scrollTop, scrollHeight } }) => {
        setScrollProgress(scrollTop / scrollHeight)
    }
      
    
    const routeLength = (route.current && route.current.getTotalLength())
    const {x,y} = (route.current ? route.current.getPointAtLength(routeLength*progress) : {x: 90, y:50})

    const incrementProgress = () => {
        if(currentProgress === 100){
            setCurrentProgress(0)
        }else{
            setCurrentProgress(currentProgress + 1)
        }
    }

    return (
      <svg className="meter" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle 
          ref={route}
          cx="50" 
          cy="50" 
          r="40" 
          fill="none" 
          stroke="gray"
        />
        <circle 
          cx={x}
          cy={y}
          r="10" 
          fill="gray" 
          stroke="white"
          onClick={incrementProgress}
          onDrag={incrementProgress}
        />
      </svg>
    ) 
}   

export default Handle