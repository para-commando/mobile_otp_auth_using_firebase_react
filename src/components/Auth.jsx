import React, { useState,useRef } from 'react'
import firebase from '../firebase'


function Auth() {
    const [mobileNumber, setMobileNumber] = useState('');
    const [verificationNumber, setverificationNumber] = useState('')
    const recaptchaRef = useRef(null);
    const handleSendOtp = () => {
        const firebaseConfig = {
            apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
            authDomain: import.meta.env.VITE_AUTH_DOMAIN,
            projectId: import.meta.env.VITE_PROJECT_ID,
            storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
            messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
            appId: import.meta.env.VITE_MESSAGING_APP_ID,
            measurementId: import.meta.env.VITE_MEASUREMENT_ID,
          };
           
        if(recaptchaRef.current){
            recaptchaRef.current.innerHTML = '<div id="recaptcha-container"> </div>'   
            const verifier = new firebase.auth.RecaptchaVerifier('recaptcha-container',{size:'invisible'});
            firebase.auth().signInWithPhoneNumber(mobileNumber,verifier).then((confirmationResult)=>{
            setverificationNumber(confirmationResult.verificationId);
            alert('OTP sent successfully')
            }
            ).catch((err) => {
                console.log("🚀 ~ handleSendOtp ~ err:", err)
        
            })         
        }
      
    }
  return (
    <div>
      <h1>mobile otp authentication</h1>
      <div ref={recaptchaRef}>
      </div>
      <input type="tel" placeholder='+919876543211' value={mobileNumber} onChange={e=> { setMobileNumber(e.target.value)
      }}/>
       <button onClick={handleSendOtp} style={{backgroundColor:'red'}}>Send OTP</button>
    </div>
  )
}

export default Auth
