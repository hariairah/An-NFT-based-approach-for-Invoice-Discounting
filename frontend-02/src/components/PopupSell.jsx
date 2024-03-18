import React from 'react'

function PopupSell({ handleMintConfirmation, handleCancelMint }) {
  return (
    <div className='popup-sell'>
      <p>Are you sure you want to mint a token for this invoice?</p>
      <button onClick={handleMintConfirmation} className='popup-buttons-one'>Yes</button>
      <button onClick={handleCancelMint} className='popup-buttons-two'>No</button>
    </div>
  )
}

export default PopupSell;