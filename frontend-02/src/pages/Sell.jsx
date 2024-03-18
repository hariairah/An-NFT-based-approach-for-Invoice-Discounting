import React, { useState,useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios'; // Import axios
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PopupSell from '../components/PopupSell';

let tempipfscid=null;

function Sell() {
  const [formData, setFormData] = useState({
    seller: '',
    buyer: '',
    amount: '',
    maturityDate: '',
    invoice: null,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentContractTransaction, setCurrentContractTransaction] = useState(null);
  const [isFormComplete, setIsFormComplete] = useState(false);

  //const [ipfsCid, setIpfsCid] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [consoleMessages, setConsoleMessages] = useState([]);
  //const [provider, setProvider] = useState(null);
  //const [signer, setSigner] = useState(null);
  //const [contract, setContract] = useState(null);

  let signer = null;
  let provider;
  let contract;
  let ipfscid;
  //let tempipfscid;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      invoice: file,
    });
    setFileUploaded(true);
  };

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    //updateEthers();
  };

  const updateEthers = async () => {
    console.log(defaultAccount);
    if (defaultAccount) {
      
      provider = new ethers.BrowserProvider(window.ethereum);
      //setProvider(tempProvider);

      signer = await provider.getSigner();
      //setSigner(tempSigner);

      try {
        if (!formData.invoice) {
          console.error("No invoice file selected.");
          return;
        }
    
        const formDataToSend = new FormData();
        formDataToSend.append("invoice", formData.invoice);
    
        try {
          const uploadResponse = await fetch("https://invoice-disc.onrender.com/ipfs/uploadInvoice/", {
            method: "POST",
            body: formDataToSend,
          });
    
          if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json();
            ipfscid = uploadResult.ipfs_cid;
            tempipfscid=ipfscid;
            console.log("Invoice uploaded successfully. IPFS CID:", ipfscid);
          } else {
            console.error("Failed to upload invoice:", uploadResponse.statusText);
          }
        } catch (error) {
          console.error("Error:", error);
        }
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
              console.log(contract);

              const buyer = formData.buyer;
              const invoiceAmount = formData.amount;
              const dueDate = formData.maturityDate;
              console.log("Buyer: ",buyer);
              console.log("CID: ",ipfscid);
              console.log("invoiceAmount: ",invoiceAmount);
              console.log("duedate: ",dueDate);
              if (contract) {
                 try {
                      const transaction = await contract.safeMint(buyer, ipfscid, invoiceAmount, dueDate);
                      setCurrentContractTransaction(transaction);
                      console.log("NFT Minted:", transaction);
                      toast.success(`Token minted successfully`);
                    } catch (error) {
                      console.error("Error minting NFT:", error);
                      toast.error("Error minting NFT");
                    }
                  } else {
                    console.error("Contract not initialized.");
                    toast.error("Contract not initialized.");
                  }
            } else {
              console.error("Failed to fetch or parse contract ABI data:", contractABIData);
              toast.error("Failed to fetch or parse contract ABI data.");
            }
          } else {
            console.error("Failed to fetch contract ABI:", contractABIFetchResponse.status, contractABIFetchResponse.statusText);
            toast.error("Failed to fetch contract ABI.");
          }
        } else {
          console.error("Failed to fetch contract address:", contractAddressResponse.statusText);
          toast.error("Failed to fetch contract address");
        }

       } catch (error) {
         console.error("Error:", error);
       }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' }).then((result) => {
        accountChangedHandler(result[0]);
        // Show success message when connected to wallet
        toast.success('Connected to wallet successfully');
        setShowConfirmation(true);
      }).catch((error) => {
        // Show error message if there's an issue connecting
        toast.error('Error connecting to the wallet');
      });
    }
  };

  const checkFormCompleteness = () => {
    const { buyer, amount, maturityDate, invoice } = formData;
    const isComplete = buyer && amount && maturityDate && invoice;
    setIsFormComplete(isComplete);
  };
  
  useEffect(() => {
    checkFormCompleteness();
  }, [formData]);
  
  const handleMintConfirmation = async () => {
    setShowConfirmation(false);
    await updateEthers();
  };

  const handleCancelMint = () => {
    setShowConfirmation(false);
    toast.error('Token not minted');
  };

  return (
    <div className="sell-div">
      <h1>CREATE A TOKEN</h1>
      <h5 className='seller-address'>Address: {defaultAccount}</h5>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="invoice-details">
          <div className="upload-invoice">
            <h3 className="dropbox">Upload Invoice</h3>
            <input
              type="file"
              id="invoice"
              name="invoice"
              accept=".pdf, .doc, .docx, .jpg, .png"
              className="choose-file"
              onChange={handleFileChange}
              disabled={fileUploaded}
            />
          </div>
          <div className="enter-details">
            <div className="form-group">
              <label htmlFor="buyer" className="form-label">
                Buyer:
              </label>
              <input
                type="text"
                id="buyer"
                name="buyer"
                value={formData.buyer}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="amount" className="form-label">
                Amount:
              </label>
              <input
                type="text"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="maturityDate" className="form-label">
                Maturity Date:
              </label>
              <input
                type="date"
                id="maturityDate"
                name="maturityDate"
                value={formData.maturityDate}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <button type="submit" className={`sell-invoice-button ${isFormComplete ? '' : 'button-disabled'}`} disabled={!isFormComplete}>
              Mint Token
            </button>
          </div>
        </div>
      </form>
      {showConfirmation && (
        <PopupSell
          handleMintConfirmation={handleMintConfirmation}
          handleCancelMint={handleCancelMint}
        />
      )}
      <div className='console-messages'>
        {tempipfscid ? (
        <div>
          <p>NFT has been minted.</p>
          <a href={`https://ipfs.io/ipfs/${tempipfscid}`} className='ipfs-link'>
            Click here to view the file uploaded on IPFS!
          </a>
        </div>
        ) : null}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Sell;

