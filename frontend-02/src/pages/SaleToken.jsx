import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let token_price=null;

function SaleToken({ tokenId, walletAddress }) {
  const [expanded, setExpanded] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const [tokenURI, setTokenURI] = useState(null);
  const [tokenOwner, setTokenOwner] = useState(null);

  let signer = null;
  let provider;
  let contract;

  useEffect(() => {
    if (expanded) {
      fetchTokenData();
      fetchTokenURI();
      fetchOwner();
    }
  }, [expanded]);

  const fetchTokenData = async () => {
    try {
      const response = await axios.get(
        `https://invoice-disc.onrender.com/ERC721/getInvoiceData?tokenId=${tokenId}`
      );
      if (response.status === 200) {
        setTokenData(response.data.invoiceData);
        token_price=response.data.invoiceData.curr_price;
      }
    } catch (error) {
      console.error(`Error fetching token data for tokenId ${tokenId}:`, error);
    }
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

  const fetchOwner = async () => {
    try{
      const response = await axios.get(
        `https://invoice-disc.onrender.com/ERC721/getOwnerOf?tokenId=${tokenId}`
      );
      if (response.status === 200){
        setTokenOwner(response.data.tokenOwner);
      }
    } catch (error) {
      console.error(`Error fetching Token Owner for tokenId ${tokenId}:`, error);
    }
  }
  const handleBuyInvoice = async (tokenId) => {
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
                  const value = token_price;
                  console.log(token_price);
                  const transaction = await contract.buyInvoice(tokenId,{
                    value: value
                  });
                  console.log("Token Bought!", transaction);
                  toast.success(`Token id: ${tokenId} bought successfully!`);
                } catch (error) {
                  console.error("Error buying token", error);
                  toast.error('Error buying the token');
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
  }

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
          <a href={tokenURI} className='token-uri'>Token URI</a>
          <p className="token-owner">Token Owner: {tokenOwner}</p>
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
      <button className="buy-invoice" onClick={() => handleBuyInvoice(tokenId)}>
        Buy Invoice
      </button>
    </div>
  )
}

export default SaleToken
