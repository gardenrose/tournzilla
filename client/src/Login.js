import './css/Homepage.css';
import './css/Forum.css';
import './css/Login.css';
import logo from './images/logo.png';
import { blankspace, mainTitle, rankHeading, modalInput, loginArea } from './Constants';
import React, {useState} from "react";
import {connect} from 'react-redux';
import {login} from './actions/auth';
import { navigate } from '@reach/router';

const Login = (props) => {
  const [passwd, setPasswd] = useState("");
  const [uname, setUname] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  function handleLogin() {
    setShowWarning(true);
    props.login(uname, passwd);
  }

  if (props.isAuthenticated) {
    navigate("/");
  }

 return (
    <div className={blankspace}>
        <div >
        &nbsp;&nbsp;&nbsp;&nbsp;<h1 align='center' className={mainTitle}>Login</h1>      
        <span className='side-buttons'>
            <label className={rankHeading}><b>Don't have account?</b></label>
            <br/>
            <a href='/register'><button className='side-buttons card-button-goto'>Register instead</button></a>
            <br/><br/>
            <label className={rankHeading}><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Forgot password?</b></label>
            <br/>
            <a href='/resetpassword'><button className='side-buttons card-button-goto'>Reset password</button></a>
        </span>
        <br/>
        <div className={loginArea}>
            <img src={logo} className='login-logo'></img>
            <div className='login-credentials'>
                <label className={rankHeading}><b>Username:</b></label>
                <br/>
                <input className={modalInput} id="username" onChange={(e) => setUname(e.target.value)} required></input>
                <br/><br/>
                <label className={rankHeading}><b>Password:</b></label>
                <br/>
                <input type="password" className={modalInput} onChange={(e) => setPasswd(e.target.value)} required></input>
            </div>
        </div>
        {showWarning ?<p className='warnings'>{props.message}</p> :null}
        <br/>
        <button className='confirm-button card-button-goto' onClick={() => handleLogin()}>Login</button>
       </div>
    </div>
  );
}

const mapStateToProps = (state) =>({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  message: state.auth.message
});

export default connect(mapStateToProps, {login})(Login);
