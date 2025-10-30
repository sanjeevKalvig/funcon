import React from 'react'

function LoadingScreen({fadeOut}) {
  return (
    <div
    className={`h-screen flex items-center justify-center bg-black text-white text-[40px] transition-opacity duration-700 z-20 ${fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
  >
    Loading...
  </div>
  )
}

export default LoadingScreen