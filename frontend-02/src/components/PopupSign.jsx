import React from 'react';

function PopupSign({ handleSignConfirmation, handleCancelSign, tokenId }) {
  const confirmSign = () => {
    handleSignConfirmation(tokenId);
  };

  const cancelSign = () => {
    handleCancelSign();
  };

  return (
    <div className='popup-sell'>
      <p>Are you sure you want to sign the token of tokenId: {tokenId}?</p>
      <button onClick={confirmSign} className='popup-buttons-one'>
        Yes
      </button>
      <button onClick={cancelSign} className='popup-buttons-two'>
        No
      </button>
    </div>
  );
}

export default PopupSign;
