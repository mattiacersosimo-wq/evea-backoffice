import React from 'react'
import Vimeo from '@u-wave/react-vimeo';

const Test = () => {
  return (
    <div>
      <Vimeo
          video="https://vimeo.com/253989945"
          autoplay
          controls
          responsive
        />
    </div>
  )
}

export default Test