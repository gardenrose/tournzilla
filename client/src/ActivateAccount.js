import "./css/Login.css";
import "./css/TermsConditions.css";
import "./css/ContentCard.css";
import './css/Homepage.css';
import './css/Forum.css';
import './css/LightMode.css';
import Modal from "./Modal";
import {profileBlankspace, mainTitle, factDialog, termsTitle} from "./Constants";
import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";
import {connect} from 'react-redux';
import { verify } from "./actions/auth";

const ActivateAccount = (props) => {

  const [showNotif, setShowNotif] = useState(false);
  const [verified, setVerified] = useState(false);
  const successMsg = "Verification successful.";

  const handleConfirmation = () => {
      const uid = props?.uid;
      const token = props?.token;

      props.verify(uid, token);
      setVerified(true);
      setShowNotif(true);
  };

  if (verified) {
    setTimeout(() => setShowNotif(false), 5000);
    setTimeout(() => navigate("/login"), 5000);
  }

  return (
    <div className={profileBlankspace}>
      <div>
        &nbsp;&nbsp;&nbsp;&nbsp;<h1 align='center' className={mainTitle}>Verify your account</h1>      
        <br/><br/><br/><br/><br/><br/><br/>
        <button className='confirm-button card-button-goto' onClick={() => handleConfirmation()}>Verify</button>
        <div className="modal-wrapper">
          {
            showNotif ? (
                <Modal id='root'>
                    <div className="fact-modal-dialog">
                        <dialog open className={factDialog}>
                        <span>
                          <h2 className={termsTitle}> {props.message ?? successMsg} Redirecting you to login...</h2>
                        </span>
                        </dialog>
                    </div>
                </Modal>
            ):null
          }
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) =>({
  message: state.auth.message
});

export default connect(mapStateToProps, { verify })(ActivateAccount);
