import React,{useEffect, useState} from "react";
import logo from './logo.svg';
import QRCode from "qrcode.react";
import {getBalance,fetchCardsOf} from './api/UseCaver';
import * as KlipAPI from './api/UseKlip'; 
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import './market.css'
import {Alert,Container,Card, Nav,Form,Button} from "react-bootstrap";

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
  const [tab,setTab] = useState('MINT');
  const [mintImageUrl,setMintImageUrl] = useState("");
  //tab
  //mintinput
  //modal
  //fetchMarketNFTs
  //fetchMyNFT
  //onClickMint
  //onClickMyCard
  //onClickMarketCard

  const fetchMarketNFTs = async () =>{
    const _nfts = await fetchCardsOf(myAddress);
    setNfts(_nfts);
  }


  const fetchMyNFTs = async () =>{
    const _nfts = await fetchCardsOf("0x4BBF656d74e011EF2121FD6D5E8303F271Fdd53B");
    console.log(_nfts);
    setNfts(_nfts);
    console.log(nfts);
  };

  const getUserData = async () =>{
    KlipAPI.getAddress(setQrvalue,async (address)=>{  
      setMyAddress(address);
      const _balance = await getBalance(address);  //비동기(async) await 
      setMyBalance(_balance);
    });
  };
  useEffect(()=>{
    fetchMyNFTs();
  },[])
  //getUserData
  //getBalance
  return (
    <div className="App">
      <div style ={{backgroundColor : "gray", padding : 10}}>
        <div style ={{
          fontSize:25,
          fontWeight:"bold"
        }}>
          내 지갑
        </div>
        <div>
          {myAddress}
        </div>
        <Alert onClick = {getUserData} variant = {"balance"} 
        style = {{
          borderColor:"#A4B9C6",  
          backgroundColor : "#A4B9C6",
          fontSize :25
          }}>
            {myBalance}
        </Alert>
          {tab === "MARKET" || tab === "WALLET"? (
            <div className="container" style ={{padding : 0, width : "100%"}}>
              {nfts.map((nft,index) => {
                <Card.Img className="img-responsiveS" src = {nfts[index].uri}/>
              })}
            </div>
          ) :null}

          {tab === "MINT" ?
          <div className = "container" style = {{padding :0,width:"100%"}}>
            <Card className = "text-center" style ={{color:"black", height: "50%",borderColor:"#C5B358"}}>
              <Card.Body style = {{opacity : 0.9, backgroundColor : "black"}}>
                {mintImageUrl !== "" ? <Card.Img src = {mintImageUrl} height = {"50%"}/> : null}
                <Form>
                  <Form.Group>
                    <Form.Control
                    value = {mintImageUrl}
                    onChange = {(e) => {
                      console.log(e.target.value);
                      setMintImageUrl(e.target.value);
                    }}
                    type = "text"
                    placeholder="이미지 주소를 입력해주세요"/>
                  </Form.Group>
                  <Button>발행하기</Button>
                </Form>
              </Card.Body>
            </Card>
          </div>:null}
           
      </div>
        {/*주소 잔고*/}
        {/*갤러리 */}
        {/*발행 페이지 */}
        {/*탭 */}  
        {/*모달 */}
      <Container style = {{
        backgroundColor :"white",
        width:300,
        height:300,
        padding:20
        }}>
        <QRCode size = {256} value = {qrvalue} style = {{     
          margin:"auto"
          }}/>
      </Container>
      <button onClick = {fetchMyNFTs}>123123123123</button>


      {/*nav바*/}
      <nav style = {{backgroundColor :"1b1717",height:45}} className = "navbar fixed-bottom navbar-light" role = "navigation">
        <Nav className="w-100">
          <div classname ="d-flex flex-row- justify-content-around w-100">
            <div onClick={() => {
              setTab("MARKET");
              fetchMarketNFTs();
            }} className = "row d-flex flex-column justify-content-center align-items-center">
              <div>MARKET</div>
            </div>
            
            <div onClick={() => {
              setTab("MINT");
            }} className = "row d-flex flex-column justify-content-center align-items-center">
              <div>MINT</div>
            </div>

            <div onClick={() => {
              setTab("WALLET");
              fetchMyNFTs();
            }} className = "row d-flex flex-column justify-content-center align-items-center">
              <div>WALLET</div>
            </div>
          </div>
        </Nav>
      </nav>
      
    </div>
  );
}

export default App;
