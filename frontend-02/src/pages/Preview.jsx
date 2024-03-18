import { useParams } from "react-router-dom";
import axios from 'axios';
import React, { useState,useEffect } from 'react';
import {ethers} from 'ethers'
import "./Portfolio.css"
function Preview(){
    const [seller,setSeller]=useState("")
    const[buyer,setBuyer]=useState("")  
    const[curr_price,setPrice]=useState("")  
    const[invoice_amount,setAmount]=useState("")  
    const[date,setDate]=useState("")
    const[status,setStatus]=useState("")  
    const {id}=useParams()
    const[flag,setFlag]=useState(false)
    const[path,setPath]=useState("")
    const[flag1,setFlag1]=useState(false)
    const[owner,setOwner]=useState(false)
    const[amt,setAmt]=useState(false)
    const[price,setSprice]=useState(0)
    const[abi,setAbi]=useState()
    const cont=useState(import.meta.env.VITE_CONTRACT_ADDRESS)
    const[his,setHis]=useState(false)
    const[wal,setWal]=useState()
    const[allow,setAllow]=useState(true)
    const[bt,setBt]=useState("Sell")
    const[sale,setSale]=useState()
    const[play1,setPlay1]=useState(true)
    const[rev,setRevoke]=useState(false)
    const[msg,setMsg]=useState("Sell")
    const[war,setWar]=useState(false)
    const[q,setQ]=useState(false)
    const[play2,setPlay2]=useState(true)
    const[wallet,setWallet]=useState()
    const Load=async() =>{
        console.log("contract",import.meta.env.VITE_CONTRACT_ADDRESS)
        setPlay1(false)
        let url='https://invoice-disc.onrender.com/ERC721/getInvoiceData?tokenId='
        let str=id.slice(1)
        url=url.concat(str)
        await axios.get(url)
        .then((response) =>{
            const val=response.data.invoiceData
            setSeller(val.seller)
            setBuyer(val.buyer)
            setPrice(val.curr_price)
            setSprice(val.curr_price)
            setAmount(val.invoice_amount)
            setDate(val.due_date)
            setStatus(val.is_approved)
            setFlag(true)
            console.log(val.for_sale)
            if(val.for_sale==="true")
            setBt("Change Price")
        setSale(val.for_sale)
        })
        .catch((error) =>{
            console.error(error)
        })
        url='https://invoice-disc.onrender.com/ERC721/getTokenURI?tokenId='
        url=url.concat(str)
        await axios.get(url)
        .then((response) =>{
            setPath(response.data.tokenURI)
            console.log(response.data.tokenURI)
            setFlag(true)
        })
        .catch((error) =>{
            console.error(error)
        })
        url='https://invoice-disc.onrender.com/ERC721/getOwnerOf?tokenId='
        url=url.concat(str)
        await axios.get(url)
        .then((response) =>{
            if(response.data.tokenOwner.toUpperCase()===wallet.toUpperCase())
            setOwner(true)

        })
        .catch((error) =>{
            console.error(error)
        })
    }
    const sell=() =>{
        setRevoke(false)
        if(bt==="Change Price")
        setMsg("Change Price")
        setFlag1(true)
    }
    const close=() =>{
        setFlag1(false)
    }
    const open=()=>{
        setFlag1(false)
        setAmt(true)
    }
    const handle=(event)=>{
        setSprice(event.target.value)
    }
    const submit=async()=>{
        console.log(typeof price,typeof invoice_amount)
        if(parseInt(price)>parseInt(invoice_amount) && rev===false)
        setWar(true)
    else
    {
        console.log("hi")
        setFlag1(false)
        setAmt(false)
        let url='https://invoice-disc.onrender.com/etherscan/getContractABI/'
        await axios.get(url)
        .then((response) =>{
            setAbi(JSON.parse(response.data.result))
        })
        .catch((error) =>{
            console.error(error)
        })
    }

        
    }
    const call_contract=async() =>{
        let provider = new ethers.BrowserProvider(window.ethereum)
        let signer = await provider.getSigner()
        console.log("Hello")
        let contract = new ethers.Contract(cont[0],abi, signer)
        let str=id.slice(1)
        str=parseInt(str)
        let set_price=parseInt(price)
        let transaction
        try{
        if(rev)
        transaction = await contract.revokeInvoiceSale(str)
        else if(sale==="false")
        transaction = await contract.approveInvoiceSale(str,set_price)
        else
        transaction = await contract.setInvoicePrice(str,set_price)
        console.log(transaction)
        }
        catch(error)
        {
            console.log(error)
        }

    }
    const call=async() =>{
        if(window.ethereum)
        {
            window.ethereum.request({method:"eth_requestAccounts"})
            .then(result =>{
                console.log(result)
                call_contract()
            })
        }
        else{
            console.log("Metamask Not found")
        }
    }
    useEffect(() =>{
        if(abi && allow)
        {
            setAllow(false)
            console.log(cont)
            call()
        }
    },);
    const history=async() =>{
        let str=id.slice(1)
        let url='https://invoice-disc.onrender.com/ERC721/getTokenOwnerHistory?tokenId='
        url=url.concat(str)
        await axios.get(url)
        .then((response) =>{
            //console.log(response.data)
            setWal(response.data.ownerHistory)
            setHis(true)
            //console.log(wal)
        })
        .catch((error) =>{
            console.error(error)
        })


    }
    const close_history=() =>{
        setHis(false)
    }
    const cw=() =>{
        setWar(false)
    }
    const revoke=()=>{
        setRevoke(true)
        setMsg("Revoke")
        setFlag1(true)
    }
    const retrive=async() =>{
        setPlay2(false)
        if(window.ethereum)
        {
            window.ethereum.request({method:"eth_requestAccounts"})
            .then(result =>{
                console.log(result)
                setWallet(result[0])

            })
            .catch(error =>{
                console.log(error)
            })
        }
        else
        {
            console.log("Metamask Not found")
        }
    }
    useEffect(()=>{
        if(wallet && play1)
        {
            setPlay1(false)
            console.log("wallet",wallet)
            Load()
        }
    })
    if(play2)
    retrive()
    return(<div>
        <h1 className="head"><u>Token Preview Window</u></h1>
        <div className={status==="true"?'transparencyg':'transparencyr'}>
            {flag && <div className="big">
            <table>
            <tbody className="data">
            <tr>
            <td className="hg"><h3>Token id</h3></td>
            <td className="hg"><h3>{id}</h3></td>
            </tr>
            <tr>
            <td className="hg"><h3>Seller</h3></td>
            <td className="hg"><h3>:{seller}</h3></td>
            </tr>
            <tr>
            <td className="hg"><h3>Buyer</h3></td>
            <td className="hg"><h3>:{buyer}</h3></td>
            </tr>
            <tr>
            <td className="hg"><h3>Current Price</h3></td>
            <td className="hg"><h3>:{curr_price}</h3></td>
            </tr>
            <tr>
            <td className="hg"><h3>Invoice Price</h3></td>
            <td className="hg"><h3>:{invoice_amount}</h3></td>
            </tr>
            <tr>
            <td className="hg"><h3>Due Date</h3></td>
            <td className="hg"><h3>:{date}</h3></td>
            </tr>
            <tr>
            <td className="hg"><h3>Approval</h3></td>
            <td className="hg"><h3>:{status}</h3></td>
            </tr>
            <tr>
            <td className="hg"><h3>For Sale</h3></td>
            <td className="hg"><h3>:{sale}</h3></td>
            </tr>
            </tbody>
            </table>
            </div>}
            { flag && <div className="big">
            <a href={path}><img  className="ima"src={path} alt="Token"/></a>
            </div>}
            <br/>
            {flag && <div className="side">
            <button onClick={history} className="yes">Token History</button>
            </div>}
            {status==="true" && owner  && <div className="side">
                <button onClick={sell} className="yes">{bt}</button>
                </div>
            }
            {flag && !owner && sale==="true" && <div className="side">
            <button className="yes">Buy</button>
            </div>}
            {flag && owner && sale==="true" && status==="true" &&<div className="side">
                <button className="yes" onClick={revoke}>Revoke</button>
            </div>}
            {(status==="false" || !owner) && flag&& <div className="side">
            <button className="yes" onClick={()=>{setQ(true)}}>?</button>
            </div>}
            </div>
            {
                flag1 && <div className="pop">
                    <div className="pop_inner">
                    <h2>Are you sure you want to {msg}?</h2><br/>
                    <button className="yes" onClick={rev?submit:open}>Yes</button>
                    <button onClick={close} className="yes">No</button>
                    </div>
                    </div>
            }
            {
                amt && <div className="pop">
                    <div className="pop_inner">
                        <h3>Enter the price at which you would like to sell the token</h3><br/>
                        <input type="text" value={price} onChange={handle} required />
                        <button type="submit" className="yes" onClick={submit} >Submit</button>
                    </div>
                    </div>
            }
            {
                war && <div className="pop">
                    <div className="pop_inner">
                        <h3>Selling Price should not exceed invoice amount</h3><br/>
                        <button className="yes" onClick={cw}>Ok</button>
                        </div>
            </div>}
            {q && <div className="pop">
            <div className="pop_inner">
            <h2>Wondering why you can't sell this token?</h2><br/>
            {(status==="false")?<h3>-This token is not approved</h3>:<h3>-You are not the owner of this token</h3>}
            <button className="yes" onClick={()=>{setQ(false)}}>Got it</button>
            </div>
            </div>}
            {
                his && <div className="pop">
                    <div className="inner">
                    <table>
                        <thead>
                            <tr>
                            <th>
                                Wallet Addresses
                            </th>
                            </tr>
                        </thead>
                        <tbody>

                            {wal.map((item,index) =>(
                                <tr key={index}  className="hist">
                                    <td>
                                        {item}
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                    <button onClick={close_history} className="yes">Close</button>
                    </div>
                    </div>
            }
            
    </div>

    )
}
export default Preview;

