import './css/Homepage.css';
import './css/Forum.css';
import './css/Login.css';
import './css/LightMode.css';
import logo from './images/logo.png';
import { blankspace, mainTitle, rankHeading, modalInput, loginArea, registerSuccessMsg } from './Constants';
import React, {useState} from "react";
import { connect } from 'react-redux';
import { register } from './actions/auth';
import { Link } from '@reach/router';


const Register = (props) => {

  const [passwd, setPasswd] = useState("");
  const [uname, setUname] = useState("");
  const [re_passwd, setRepasswd] = useState("");
  const [email, setEmail] = useState("");
  //const [warning, setWarning] = useState(null);

  function handleRegister() {
      props.register(email, uname, passwd, re_passwd);
    }

 return (
    <div className={blankspace}>
        <div >
        &nbsp;&nbsp;&nbsp;&nbsp;<h1 align='center' className={mainTitle}>Register</h1>      
        <span className='side-buttons'>
            <label className={rankHeading}><b>Already have an account?</b></label>
            <br/><br/>
            <Link to="/login"><button className='side-buttons card-button-goto'>Login instead</button></Link>
        </span>
        <div className={loginArea}>
            <img src={logo} className='login-logo'></img>
            <div className='login-credentials'>
                <label className={rankHeading}><b>Email:</b></label>
                <br/>
                <input className={modalInput} onChange={(e) => setEmail(e.target.value)}></input>
                <br/>
                <label className={rankHeading}><b>Username:</b></label>
                <br/>
                <input className={modalInput} onChange={(e) => setUname(e.target.value)}></input>
                <br/>
                <label className={rankHeading}><b>Password:</b></label>
                <br/>
                <input className={modalInput} type="password" onChange={(e) => setPasswd(e.target.value)}></input>
                <br/>
                <label className={rankHeading}><b>Confirm password:</b></label>
                <br/>
                <input className={modalInput} type="password" onChange={(e) => setRepasswd(e.target.value)}></input>
            </div>
        </div>
        <br/>
        {<p className={props.message === registerSuccessMsg ? 'notifs' : 'warnings'}>{props.message}</p>}
        <button className='confirm-button card-button-goto' onClick={() => {handleRegister()}}>Register</button>
        <div className="modal-wrapper">
       </div>
    </div>
  </div>
  )
};

const mapStateToProps = state => ({
  message: state.auth.message,
});

export default connect(mapStateToProps, {register})(Register);
