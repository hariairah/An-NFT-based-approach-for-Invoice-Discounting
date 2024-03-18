import "./Portfolio.css"
import axios from 'axios';
import React, { useState,useEffect } from 'react';

function Portfolio(){

const [data,setData]=useState([])
const[data1,setData1]=useState([])
const[flag,setFlag]=useState(false)
const[play,setPlay]=useState(true)
const[play1,setPlay1]=useState(true)
const[wallet,setWallet]=useState()
const refresh=async(x) =>{
    setData(data =>[...data,x])
    await new Promise(r => setTimeout(r,2000))
    let url='https://invoice-disc.onrender.com/ERC721/getInvoiceData?tokenId='
    url=url.concat(x)
    await axios.get(url)
    .then((response) =>{
        console.log(response.data.invoiceData)
        let val=response.data.invoiceData
        setData(data =>[...data,{tokenID:x,due_date:val.due_date,invoice_amount:val.invoice_amount,status:val.is_approved}])
    })
    .catch((error) =>{
        console.error(error)
    })
    

}
const refresh1=async(y) =>{
        await new Promise(r => setTimeout(r,2000))
        let url='https://invoice-disc.onrender.com/ERC721/getInvoiceData?tokenId='
        url=url.concat(y)
        await axios.get(url)
        .then((response) =>{
            console.log(response.data.invoiceData)
            let val=response.data.invoiceData
            setData1(data1 =>[...data1,{tokenID:y,due_date:val.due_date,invoice_amount:val.invoice_amount,status:val.is_approved}])
        })
        .catch((error) =>{
            console.error(error)
        })
        
    

}
const res=async({tokens}) =>{
    for(const element of tokens)
    {
    await new Promise(r => setTimeout(r,2000))
    let url='https://invoice-disc.onrender.com/ERC721/getOwnerOf?tokenId='
    url=url.concat(element)
    await axios.get(url)
    .then((response) =>{
        if(response.data.tokenOwner.toUpperCase()===wallet.toUpperCase())
        refresh(element)
        else
        refresh1(element)
    })
    .catch((error) =>{
        console.error(error)
    })

}
setFlag(true)
}
const Api=() =>{
    setPlay(false)
    setData(data =>[])
    setData1(data1 =>[])
    let tokens=[]
    let url='https://invoice-disc.onrender.com/etherscan/getERC721Details?address='
    url=url.concat(wallet)
    axios.get(url)
    .then((response) => {
        for(const element of response.data.result)
        tokens.push(element.tokenID)
        tokens=[...new Set(tokens)]
            res({tokens})
    })
    .catch((error) => {
        console.error(error)
    })
    
}
const retrive=async() =>{
    setPlay1(false)
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
    console.log("Metamask not found")
}
useEffect(()=>{
    if(wallet && play)
    {
        setPlay(false)
        console.log("wallet",wallet)
        Api()
    }
})
if(play1)
retrive()
return(<div className="pending">
<h1 className="head"><u>Portfolio Window</u></h1>
{ flag &&  <div>
<h2 className="heading"><u>Pending Investments</u></h2>
<table>
           <thead>
            <tr className="yt">
                <th>
                TokenID:
                </th>
                <th>
                Due Date
                </th>
                <th>
                Invoice Amount
                </th>
                <th>
                Preview
                </th>
            </tr>
           </thead>
           <tbody>
                {data.filter(item=> item.tokenID).map((item,index) =>(

                    <tr key={index} className={item.status==="true"?"row":"rowr"}>
                        <td className="info">{item.tokenID}</td>
                        <td className="info">{item.due_date}</td>
                        <td className="info">{item.invoice_amount}</td>
                        <td className="info"><a href={`/main-app/preview/:${item.tokenID}`} className="button">Preview</a></td>
                        
                    </tr>
                ))}
            </tbody>
</table>
<br/><br/><br/><br/>
<h2 className="heading"><u>Returned Investments</u></h2>
<table>
<thead>
            <tr className="yt">
                <th>
                TokenID:
                </th>
                <th>
                Due Date
                </th>
                <th>
                Invoice Amount
                </th>
                <th>
                Preview
                </th>
            </tr>
           </thead>
           <tbody>
                {data1.filter(item=>item.tokenID).map((item,index) =>(
                                        <tr key={index} className="row">
                                        <td className="info">{item.tokenID}</td>
                                        <td className="info">{item.due_date}</td>
                                        <td className="info">{item.invoice_amount}</td>
                                        <td className="info"><a href={`/main-app/preview/:${item.tokenID}`} className="button">Preview</a></td>
                                    </tr>

            ))}
            </tbody>
</table>
</div>}
</div>
)

}
export default Portfolio;