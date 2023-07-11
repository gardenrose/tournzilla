import './css/Homepage.css';
import './css/Forum.css';
import './css/Login.css';
import logo from './images/logo.png';
import { blankspace, mainTitle, rankHeading, modalInput, loginArea, termsTitle, factDialog, emptyFieldMsg } from './Constants';
import { navigate } from "@reach/router";
import React, {useState} from "react";
import { connect } from 'react-redux';
import { resetPasswordConfirm } from './actions/auth';
import Modal from './Modal';

const PasswordResetConfirm = (props) => {

  const uid = props.uid;
  const token = props.token;
  const [newPasswd, setNewPasswd] = useState("");
  const [reNewPasswd, setReNewPasswd] = useState("");
  const [warning, setWarning] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [showNotif, setShowNotif] = useState(props.message);
  const successfulPassChange = "Password changed successfully.";

  function handleResetPasswordConfirm() {
    console.log(props.message)
    setWarning("");
    setShowWarning(false);
    if (newPasswd === "" || reNewPasswd === "") {
      setWarning(emptyFieldMsg);
      setShowWarning(true);
    } else if (newPasswd !== reNewPasswd) {
      setWarning("The two passwords do not match.");
      setShowWarning(true);
    } else if (!isNaN(newPasswd)) {
      setWarning("The password is entirely numeric.");
      setShowWarning(true);
    } else if (newPasswd.length < 8) {
      setWarning("This password is too short. It must contain at least 8 characters.");
      setShowWarning(true);
    } else {
      setShowWarning(false);
      props.resetPasswordConfirm(uid, token, newPasswd, reNewPasswd);
      setShowNotif(true);
    }    
  }

  if (showNotif) {
    setTimeout(() => setShowNotif(false), 5000);
    setTimeout(() => navigate("/login"), 5000);
  }

  return (
    <div className={blankspace}>
      <div >
      &nbsp;&nbsp;&nbsp;&nbsp;<h1 align='center' className={mainTitle}>Set a new password</h1>      
        <br/>
        <div className={loginArea}>
          <img src={logo} className='login-logo'></img>
          <div className='login-credentials'>
            <label className={rankHeading}><b>New password:</b></label>
            <br/>
            <input className={modalInput} type="password" onChange={(e) => setNewPasswd(e.target.value)} required></input>
            <br/>
            <label className={rankHeading}><b>Retype new password:</b></label>
            <br/>
            <input className={modalInput} type="password" onChange={(e) => setReNewPasswd(e.target.value)} required></input>
            <br/>
          </div>
        </div>
        <br/>
        {showWarning ?<p className='warnings'>{warning}</p> :null}
        <button className='confirm-button card-button-goto' onClick={() => handleResetPasswordConfirm()}>Reset password</button>
        {
            showNotif ? (
                <Modal id='root'>
                    <div className="fact-modal-dialog">
                        <dialog open className={factDialog}>
                        <span>
                          <h2 className={termsTitle}>{props.message ?? successfulPassChange} Redirecting you to login...</h2>
                        </span>
                        </dialog>
                    </div>
                </Modal>
            ):null
          }
      </div>
    </div>
  );
}

const mapStateToProps = (state) =>({
  message: state.auth.message
});

export default connect(mapStateToProps, { resetPasswordConfirm })(PasswordResetConfirm);
