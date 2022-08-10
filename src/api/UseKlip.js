import axios from "axios";
import { COUNT_CONTRACT_ADDRESS } from "../Constants";

export const setCount = (count, setQrvalue) =>{

    axios.post(
        "https://a2a-api.klipwallet.com/v2/a2a/prepare",{
            bapp:{
                name: "KLAYTN_MARKET"
            },
            type:"execute_contract",
            transaction:{
                to: COUNT_CONTRACT_ADDRESS,
                abi:'{ "constant": false, "inputs": [ { "name": "_count", "type": "uint256" } ], "name": "setCount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }',
                value: "0",
                params: `[\"${count}\"]`
            }
        }
    ).then(response =>{
        const request_key = response.data.request_key;
        const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
        setQrvalue(qrcode);
        let timerid = setInterval(() =>{
            axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then((res) =>{
                if(res.data.result){
                    console.log(JSON.stringify(res.data.result) );
                    clearInterval()
                }
            })
        },1000)

    })
}

export const getAddress = (setQrvalue,callback) =>{

    axios.post(
        "https://a2a-api.klipwallet.com/v2/a2a/prepare",{
            bapp:{
                name: "KLAYTN_MARKET"
            },
            type:"auth"
        }
    ).then(response =>{
        const request_key = response.data.request_key;
        const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
        setQrvalue(qrcode);
        let timerid = setInterval(() =>{
            axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then((res) =>{
                if(res.data.result){
                    console.log(JSON.stringify(res.data.result) );
                    callback(res.data.result.klaytn_address);
                    clearInterval()
                }
            })
        },1000)

    })
}