import React, { useState, useRef } from 'react';
import firebase from '../firebase';

function Auth() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [verificationNumber, setverificationNumber] = useState('');
  const [verificationCode, setverificationCode] = useState('');

  const recaptchaRef = useRef(null);
  const handleSendOtp = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.innerHTML = '<div id="recaptcha-container"> </div>';
      const verifier = new firebase.auth.RecaptchaVerifier(
        'recaptcha-container',
        { size: 'invisible' }
      );
      firebase
        .auth()
        .signInWithPhoneNumber(mobileNumber, verifier)
        .then((confirmationResult) => {
          setverificationNumber(confirmationResult.verificationId);
          alert('OTP sent successfully');
        })
        .catch((err) => {
          console.log('🚀 ~ handleSendOtp ~ err:', err);
        });
    }
  };

  const handleVerifyOtp = () => {
    const creds = firebase.auth.PhoneAuthProvider.credential(
      verificationNumber,
      verificationCode
    );
    firebase
      .auth()
      .signInWithCredential(creds)
      .then((userCredential) => {
        console.log(
          '🚀 ~ firebase.auth ~ JSON.stringify(userCredential)}:',
          JSON.stringify(userCredential)
        );
        alert(
          `Otp verified successfully for the user ${JSON.stringify(
            userCredential
          )}`
        );
      })
      .catch((err) => {
        console.log('🚀 ~ firebase.auth ~ err:', err);
      });
  };
  return (
    <div>
      <h1>mobile otp authentication</h1>
      <div ref={recaptchaRef}></div>
      <div className='sendOtpSection'>
        <input
          type='tel'
          placeholder='+919876543211'
          value={mobileNumber}
          onChange={(e) => {
            setMobileNumber(e.target.value);
          }}
        />
        <button onClick={handleSendOtp} style={{ backgroundColor: 'red' }}>
          Send OTP
        </button>
      </div>

      <div className='verifyOtpSection'>
        <input
          type='text'
          placeholder='Enter OTP'
          value={verificationCode}
          onChange={(e) => setverificationCode(e.target.value)}
        />
        <button onClick={handleVerifyOtp} style={{ backgroundColor: 'red' }}>
          Verify OTP
        </button>
      </div>
    </div>
  );
}

export default Auth;
