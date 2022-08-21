import Caver from 'caver-js';
import KIP17ABI from '../abi/KIP17TokenABI.json';
import {ACCESS_KEY_ID,SECRET_ACCESS_KEY,CHAIN_ID,COUNT_CONTRACT_ADDRESS,NFT_CONTRACT_ADDRESS } from '../Constants';


const option = {
    headers: [
      {
        name: "Authorization",
        value: "Basic " + Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64")
      },
      { name: "x-chain-id", value: CHAIN_ID },
    ]
  }
  
  const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn",option));  //API
  const NFTContract = new caver.contract(KIP17ABI,NFT_CONTRACT_ADDRESS);

  
  export const fetchCardsOf = async (address) => {
      const _balance = await NFTContract.methods.balanceOf(address).call();
      console.log(_balance);
      const tokenIds =[];
      for (let i =0;i<_balance;i++){
        const id = await NFTContract.methods.tokenOfOwnerByIndex(address,i).call();
        tokenIds.push(id);
      }
      const tokenURIs =[];
      for (let i =0;i<_balance;i++){
        const uri = await NFTContract.methods.tokenURI(tokenIds[i]).call();
        tokenURIs.push(uri);
      }
      console.log(`${tokenIds}`);
      console.log(`${tokenURIs}`);

      const nfts = [];
      for(let i =0;i<_balance;i++){
        nfts.push({uri: tokenURIs[i],id: tokenIds[i]})
      }
      return nfts;
  }
  
  export const getBalance = (address) =>{
    return caver.rpc.klay.getBalance(address).then((response) =>{
      const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response));
      return balance;
    }
    )
  }

//  const CountContract = new caver.contract(CounterABI,COUNT_CONTRACT_ADDRESS);

//   export const readCount = async () =>{
//     const _count = await CountContract.methods.count().call();
//     console.log(_count);
//   };
  
//   export const setCount = async (newCount) =>{
//     try{
//       const PRIVATE_KEY = '0x01eddeb9dbabe753289a002486849a4fe45b637f7964f68f04b68df9f7121979';
//       const deployer = caver.wallet.keyring.createFromPrivateKey(PRIVATE_KEY);
//       caver.wallet.add(deployer);
  
//       const receipt = await CountContract.methods.setCount(newCount).send({
//         from: deployer.address,
//         gas: "0x4bfd200"
//       })
//       console.log(receipt);
//     }catch(e){
//       console.log(`ERROR ${e}`);
//     }
//   } 
  