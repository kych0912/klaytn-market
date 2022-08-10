import React,{useState} from "react";
import logo from './logo.svg';
import QRCode from "qrcode.react";
import './App.css';
import * as KlipAPI from './api/UseKlip'; 
import {getBalance,readCount,setCount} from './api/UseCaver';

const DEFAULT_QR_CODE = 'DEFAULT';
const DEFAULT_ADDRESS = "0x000000000000000";

function App() {
  //state data
  //global data
  //address
  //nft
  const [nfts,setNfts] = useState([]);

  const [myBalance,setMyBalance] = useState('0');
  
  const [myAddress,setMyAddress] = useState('0x00000000000000000');

  //UI

  const [qrvalue,setQrvalue] = useState(DEFAULT_QR_CODE);
  //tab
  //mintinput
  //modal
  //fetchMarketNFTs
  //fetchMyNFT
  //onClickMint
  //onClickMyCard
  //onClickMarketCard

  const getUserData = () =>{
    KlipAPI.getAddress(setQrvalue,async (address)=>{  
      setMyAddress(address);
      const _balance = await getBalance(address);  //비동기(async) await 
      setMyBalance(_balance);
    });
  }

  //getUserData
  //getBalance

  return (
    <div className="App">
        {/*주소 잔고*/}
        {/*갤러리 */}
        {/*발행 페이지 */}
        {/*탭 */}
        {/*모달 */}
        <div onClick = {getUserData}>
          잔고:{myBalance}
          주소:{myAddress}
        </div>
        <QRCode value = {qrvalue}/>
    </div>
  );
}

export default App;
