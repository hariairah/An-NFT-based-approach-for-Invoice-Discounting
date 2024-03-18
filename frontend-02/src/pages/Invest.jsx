import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SaleToken from './SaleToken';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Invest() {
  const [tokensForSale, setTokensForSale] = useState([]);
  const [defaultAccount, setDefaultAccount] = useState(null);

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    //updateEthers();
  };
  useEffect(()=>{
    if (defaultAccount){
      getTokensForSale();
    }
  },[defaultAccount]);

  const getTokensForSale = async () => {
    //console.log("Default Account: ",defaultAccount);
    try {
      const response = await axios.get(
        "https://invoice-disc.onrender.com/ERC721/getTokensForSale/"
      );

      if (response.status === 200) {
        const tokensForSale = response.data.tokensForSale;
        setTokensForSale(tokensForSale);
        console.log(tokensForSale);
      }
    } catch (error) {
      console.error('Error fetching unsigned tokens:', error);
    }
  }

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
    <div className='invest-div'>
      <h1 className='invest-header'>INVESTMENTS</h1>
      <h5 className='financier-address'>Address: {defaultAccount}</h5>
      <button className='connect-button' onClick={handleClick}>Connect to Wallet</button>
      <div className='tokensale-container'>
        {tokensForSale.map((tokenId) => (
          <SaleToken key={tokenId} tokenId={tokenId} walletAddress={defaultAccount} className="each-token" />
        ))}
      </div>
      <ToastContainer />
    </div>
  )
}

export default Invest
