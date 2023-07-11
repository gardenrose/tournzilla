import './css/Homepage.css';
import './css/Forum.css';
import './css/Login.css';
import logo from './images/logo.png';
import { blankspace, mainTitle, rankHeading, modalInput, loginArea, emptyFieldMsg, termsTitle, factDialog } from './Constants';
import { navigate } from "@reach/router";
import React, {useState} from "react";
import { connect } from 'react-redux';
import { resetPassword } from './actions/auth';
import Modal from './Modal';

const PasswordReset = (props) => {

  const [email, setEmail] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  function handleResetPassword() {
    setShowWarning(false);
    if (email === "") {
      setShowWarning(true);
    } else {
      props.resetPassword(email);
      setShowNotif(true);
    }
  }

  if (showNotif) {
    setTimeout(() => setShowNotif(false), 5000);
    setTimeout(() => navigate("/"), 5000);
  }

 return (
    <div className={blankspace}>
        <div >
        &nbsp;&nbsp;&nbsp;&nbsp;<h1 align='center' className={mainTitle}>Reset your password</h1>
        <br/>
        <div className={loginArea}>
            <img src={logo} className='login-logo'></img>
            <div className='login-credentials'>
                <label className={rankHeading}><b>Email:</b></label>
                <br/>
                <input className={modalInput} onChange={(e) => setEmail(e.target.value)} required></input>
                <br/>
            </div>
        </div>
        <br/>
        {showWarning ?<p className='warnings'>{emptyFieldMsg}</p> :null}
        <button className='confirm-button card-button-goto' onClick={() => handleResetPassword()}>Request new password</button>
        {
            showNotif ? (
                <Modal id='root'>
                    <div className="fact-modal-dialog">
                        <dialog open className={factDialog}>
                        <span>
                          <h2 className={termsTitle}>An email has been sent to you. Redirecting you to homepage...</h2>
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

export default connect(null, { resetPassword })(PasswordReset);
