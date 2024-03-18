import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Token({ tokenId, walletAddress }) {
  const [expanded, setExpanded] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const [tokenURI, setTokenURI] = useState(null);
  //const [showConfirmation, setShowConfirmation] = useState(false);

  let signer = null;
  let provider;
  let contract;

  useEffect(() => {
    if (expanded) {
      fetchTokenData();
      fetchTokenURI();
    }
  }, [expanded]);

  const fetchTokenData = async () => {
    try {
      const response = await axios.get(
        `https://invoice-disc.onrender.com/ERC721/getInvoiceData?tokenId=${tokenId}`
      );
      if (response.status === 200) {
        setTokenData(response.data.invoiceData);
      }
    } catch (error) {
      console.error(`Error fetching token data for tokenId ${tokenId}:`, error);
    }
  };

  const handleSignInvoice = async (tokenId) => {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const contractAddressResponse = await axios.get("https://invoice-disc.onrender.com/etherscan/getContractAddress");

    if (contractAddressResponse.status === 200) {
      const contractAddressResult = contractAddressResponse.data;
      const contractAddress = contractAddressResult.contractAddress;
      console.log("Contract address is ",contractAddress);

      const contractABIFetchResponse = await axios.get("https://invoice-disc.onrender.com/etherscan/getContractABI");

      if (contractABIFetchResponse.status === 200) {
        const contractABIData = contractABIFetchResponse.data;

        if (contractABIData && contractABIData.result) {
          const contractABI = JSON.parse(contractABIData.result);

          contract = new ethers.Contract(contractAddress, contractABI, signer);
          //setContract(tempContract);
          //console.log(contract);

          // const buyer = formData.buyer;
          // const invoiceAmount = formData.amount;
          // const dueDate = formData.maturityDate;
          // console.log("Buyer: ",buyer);
          // console.log("CID: ",ipfscid);
          // console.log("invoiceAmount: ",invoiceAmount);
          // console.log("duedate: ",dueDate);
          if (contract) {
             try {
                  const transaction = await contract.signInvoice(tokenId);
                  console.log("Token Signed!", transaction);
                  toast.success(`Token id: ${tokenId} signed successfully`);
                } catch (error) {
                  console.error("Error signing", error);
                  toast.error('Error signing the token');
                }
              } else {
                console.error("Contract not initialized.");
                toast.error('Contract not initialized.');
              }
        } else {
          console.error("Failed to fetch or parse contract ABI data:", contractABIData);
          toast.error('Failed to fetch or parse contract ABI data');
        }
      } else {
        console.error("Failed to fetch contract ABI:", contractABIFetchResponse.status, contractABIFetchResponse.statusText);
        toast.error('Failed to fetch contract ABI');
      }
    } else {
      console.error("Failed to fetch contract address:", contractAddressResponse.statusText);
      toast.error('Failed to fetch contract address');
    }
    // try {
    //   const response = await axios.post(
    //     'http://localhost:3000/ERC721Frontend/signInvoice',
    //     {
    //       privateKey: walletAddress, 
    //       tokenId: tokenId,
    //     }
    //   );
  
    //   if (response.status === 200) {
    //     // Handle success, e.g., show a success message to the user
    //     alert('Invoice signed successfully');
    //     console.log(response)
    //   } else {
    //     // Handle any other response status codes or errors
    //     alert('Error signing invoice');
    //   }
    // } catch (error) {
    //   console.error('Error signing invoice:', error);
    //   alert('Error signing invoice');
    // }
  };

  const fetchTokenURI = async () => {
    try {
      const response = await axios.get(
        `https://invoice-disc.onrender.com/ERC721/getTokenURI?tokenId=${tokenId}`
      );
      if (response.status === 200) {
        setTokenURI(response.data.tokenURI);
      }
    } catch (error) {
      console.error(`Error fetching Token URI for tokenId ${tokenId}:`, error);
    }
  };

  return (
    <div className="token-container">
      <h2 className='tokenid'>Token ID: {tokenId}</h2>
      {expanded && tokenData && (
        <div className="token-details">
          <p className='buyer-token'>Buyer: {tokenData.buyer}</p>
          <p className='seller-token'>Seller: {tokenData.seller}</p>
          <p className='currentprice-token'>Current Price: {tokenData.curr_price}</p>
          <p className='duedate-token'>Due Date: {tokenData.due_date}</p>
          <p className='amount-token'>Invoice Amount: {tokenData.invoice_amount}</p>
          <a href={tokenURI}className='token-uri'>Token URI</a>
          <p className='forsale-token'>For Sale: {tokenData.for_sale}</p>
          <p className='isapproved-token'>Is Approved: {tokenData.is_approved}</p>
        </div>
      )}
      {/* {expanded && tokenURI && (
        <div className="token-uri">
          <p>Token URI: {tokenURI}</p>
        </div>
      )} */}
      <button className="view-details" onClick={() => setExpanded(!expanded)}>
        View Details
      </button>
      <button className="sign-invoice" onClick={() => handleSignInvoice(tokenId)}>
        Sign Invoice
      </button>
    </div>
  );
}

export default Token;