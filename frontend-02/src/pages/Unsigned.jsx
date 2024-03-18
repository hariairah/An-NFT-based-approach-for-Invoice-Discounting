import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Token from './Token'; // Import the Token component
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Unsigned() {
  // const [showConfirmation, setShowConfirmation] = useState(false);
 // const [tokenIDForPopup, setTokenIDForPopup] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [unsignedTokenArray, setUnsignedTokenArray] = useState([]);

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
  };

  useEffect(() => {
    if (defaultAccount) {
      getUnsignedTokens();
    }
  }, [defaultAccount]);

  const getUnsignedTokens = async () => {
    try {
      const response = await axios.get(
        `https://invoice-disc.onrender.com/ERC721/getUnsignedTokens?buyer=${defaultAccount}`
      );

      if (response.status === 200) {
        const tokens = response.data.unsignedTokens;
        setUnsignedTokenArray(tokens);
      }
    } catch (error) {
      console.error('Error fetching unsigned tokens:', error);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' }).then((result) => {
        accountChangedHandler(result[0]);
        // Show success message when connected to wallet
        toast.success('Connected to wallet successfully');
      }).catch((error) => {
        // Show error message if there's an issue connecting
        toast.error('Error connecting to the wallet');
      });
    }
  };

  return (
    <div className="unsigned-div">
      <h1 className="unsigned-heading">UNSIGNED TOKENS</h1>
      <h5 className="signer-address">Address: {defaultAccount}</h5>
      <p className='warning'>⚠️ By signing an invoice, you agree to pay the amount mentioned as the "Invoice Amount" to the token Owner on or before the due date ⚠️</p>
      <button className="connect-button" onClick={handleClick}>
        Connect to Wallet
      </button>
      <div className="unsigned-tokens">
        {unsignedTokenArray.map((tokenId) => (
          <Token key={tokenId} tokenId={tokenId} walletAddress={defaultAccount} className="each-token" />
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Unsigned;