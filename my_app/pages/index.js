import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Web3Modal from "web3modal"
import {providers, Contract} from "ethers";
import { useEffect,useRef,useState } from 'react';
import {WHITELIST_CONTRACT_ADDRESS,abi} from "../constants"

export default function Home() {

  const [walletconnected,setwalletconnected] = useState(false);
  const [joinedWhitelist,setjoinedWhitelist]=useState(false);
  const [loading ,setloading] =useState(false);
  const [numberofWhitelisted ,setnumberofWhitelisted] =useState(0);
  const Web3ModalRef = useRef();  

  const getProviderorSigner = async (needSigner =false)=>{
    const provider =await Web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const {chainId} = await web3Provider.getNetwork();
    
    if(chainId !==5){
      window.alert("Change the network to Goerli");
      throw new Error("Change network to goerli");
  
    }
    if(needSigner){
      const Signer =  web3Provider.getSigner();
      return Signer;
      console.log("signer recieved");
    }
    return web3Provider;
  };

  const addAddresstoWhiteList = async () =>{
    try{
      const signer = await getProviderorSigner(true);
      const WhiteListContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,abi,signer);
      
        const tx =await WhiteListContract.addAddressToWhitelist();
        setloading(true); 
        await tx.wait();
        setloading(false);
        await getNumberOfWhitelisted();
        setjoinedWhitelist(true);
        console.log("address added to whitelist")
    }
    catch(err){
      console.error(err);
    }
  };
  const getNumberOfWhitelisted = async() =>{
    try{
      const provider = await getProviderorSigner();
      const WhiteListContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,abi,provider);
        const _numberofWhitelisted = await WhiteListContract.numAddressesWhitelisted();
        setnumberofWhitelisted(_numberofWhitelisted);
        console.log("_numberofwhitelisted",_numberofWhitelisted);
        console.log("number of whitelisted",numberofWhitelisted);
    }
    catch(err){
      console.error(err);
    }
  };

  const checkifAddressinwhitelist = async ()=>{
    try{
      const signer =await getProviderorSigner(true);
      const WhiteListContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,abi,signer);
        const address = await signer.getAddress(); 
        const _joinedWhitelist = await WhiteListContract.whitelistedAddresses(address);
        setjoinedWhitelist(_joinedWhitelist);

      }
      catch(err){
        console.error(err);
      }
};

const connectWallet = async () =>{
  try{
    await getProviderorSigner();
    setwalletconnected(true);
console.log("wallet connected");
  checkifAddressinwhitelist();

  getNumberOfWhitelisted();
  }
  catch(err){
    console.error(err);
  }
};
const RenderBtn = () =>{
  if(walletconnected){
    if(joinedWhitelist){
      return(
        <div className ={styles.description}>
          Thanks for joining the whitelist!!
        </div>
      );
    }
    else if(loading){
      return(
        <button className = {styles.button}>Loading......</button>
      );
    }
    else{
return(
  <button className={styles.button} onClick={addAddresstoWhiteList}>Join the Whitelist!!</button>
);
    }
  }
  else{
    return(
      <button className={styles.button} onClick ={connectWallet}>Connect your wallet here!!</button>
    );
  }
};
useEffect(()=>{
  if(!walletconnected){
    Web3ModalRef.current = new Web3Modal({
      network : "goerli",
      providerOptions: {},
      disableInjectedProvider:false,
    });
    connectWallet();
    console.log("Connecting wallet!")
  }
});

return(
  <div>
    <Head>
      <title>Whitelist Dapp</title>
      <meta name="Description" content="Whitelist-dapp"/>
    </Head>
    <div className={styles.main}>
      <div> 
      <h1 className={styles.title}>
        Welcome to CryptoDevs !
      </h1>
      <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
           <h2> {parseInt(numberofWhitelisted._hex)} have already joined the Whitelist</h2>
          </div>
          {RenderBtn()}
        </div>
        <div>
         </div> 
  </div>
    <footer className={styles.footer}>
    Made with &#10084; by Crypto Devs
  </footer>
  </div>
);
}