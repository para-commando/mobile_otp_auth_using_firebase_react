import React, { useState, useRef } from 'react';
import firebase from '../firebase';
import './Auth.css';
function Auth() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [verificationNumber, setverificationNumber] = useState('');
  const [verificationCode, setverificationCode] = useState('');

  const recaptchaRef = useRef(null);
  const verifyOtpSectionRef = useRef(null);
  const sendOtpSectionRef = useRef(null);
  const otpSuccessDisplayRef = useRef(null);
  const headingRef = useRef(null);
  const authOtpSectionRefButton = useRef(null);
  const sendingOtpAlertTextRef = useRef(null);
  const verifyingOtpAlertTextRef = useRef(null);
  const handleSendOtp = () => {
    authOtpSectionRefButton.current.style.cursor = 'progress';
    sendingOtpAlertTextRef.current.style.display = 'block';
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
          sendingOtpAlertTextRef.current.style.display = 'none';

          alert('OTP sent successfully');

          verifyOtpSectionRef.current.style.display = 'flex';
          sendOtpSectionRef.current.style.display = 'none';
          authOtpSectionRefButton.current.style.cursor = 'pointer';
        })
        .catch((err) => {
          console.log('🚀 ~ handleSendOtp ~ err:', err);
          alert('Something went wrong, please try again');
          authOtpSectionRefButton.current.style.cursor = 'pointer';
          sendingOtpAlertTextRef.current.style.display = 'none';
        });
    }
  };

  const handleVerifyOtp = () => {
    authOtpSectionRefButton.current.style.cursor = 'progress';
    verifyingOtpAlertTextRef.current.style.display = 'block';
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
        verifyOtpSectionRef.current.style.display = 'none';
        sendOtpSectionRef.current.style.display = 'none';
        otpSuccessDisplayRef.current.style.display = 'block';
        authOtpSectionRefButton.current.style.cursor = 'pointer';
        verifyingOtpAlertTextRef.current.style.display = 'none';
      })
      .catch((err) => {
        alert('Something went wrong, please try again');
        console.log('🚀 ~ firebase.auth ~ err:', err);
        authOtpSectionRefButton.current.style.cursor = 'pointer';
        verifyingOtpAlertTextRef.current.style.display = 'none';
      });
  };

  const VerifyAnotherOtp = () => {
    otpSuccessDisplayRef.current.style.display = 'none';
    sendOtpSectionRef.current.style.display = 'flex';
    verifyOtpSectionRef.current.style.display = 'none';
    headingRef.current.style.display = 'block';
  };

  return (
    <div ref={authOtpSectionRefButton}>
      <h1 ref={headingRef}>mobile otp authentication</h1>
      <div ref={recaptchaRef}></div>
      <div className='sendOtpSection' ref={sendOtpSectionRef}>
        <input
          type='tel'
          placeholder='+919876543211'
          value={mobileNumber}
          onChange={(e) => {
            setMobileNumber(e.target.value);
          }}
        />
        <button onClick={handleSendOtp}>Send OTP</button>
        <div ref={sendingOtpAlertTextRef} className='sendingOtpAlertText'>
          Verifying mobile number and Sending OTP ...
        </div>
      </div>

      <div className='verifyOtpSection' ref={verifyOtpSectionRef}>
        <input
          type='text'
          placeholder='Enter OTP'
          value={verificationCode}
          onChange={(e) => setverificationCode(e.target.value)}
        />
        <button onClick={handleVerifyOtp}>Verify OTP</button>
      </div>
      <div ref={verifyingOtpAlertTextRef} className='verifyingOtpAlertText'>
        Verifying OTP ...
      </div>
      <div className='otpSuccessDisplay' ref={otpSuccessDisplayRef}>
        <p>OTP verified successfully !</p>
        <button onClick={VerifyAnotherOtp}>Send OTP for another number</button>
      </div>
    </div>
  );
}

export default Auth;
