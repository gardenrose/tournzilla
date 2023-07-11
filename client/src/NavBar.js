import './css/NavBar.css';
import logo from './images/logo.png';
import { Link, navigate } from "@reach/router";
import React, {useEffect} from "react";
import {connect} from 'react-redux';
import {logout} from './actions/auth';
import {checkAuthenticated, loadUser} from './actions/auth';
import { visit } from './Constants';


document.body.style.setProperty("--primary-color", "white");
function setTheme () {
    window.localStorage.setItem('theme', document.querySelector('#switch:checked') !== null ?JSON.stringify("light") :JSON.stringify("dark"));
    window.location = window.location
}

const NavBar = (props) => {

    const handleLogout = () => {
        props.logout();
        navigate("/login")
    }

    useEffect(() => {
        props.checkAuthenticated();
        props.loadUser();
    }, []);
    
    useEffect(() => {
        document.getElementById("switch").checked = JSON.parse(window.localStorage.getItem('theme'))==="light";
        //console.log(props)
    }, []);

  return (
    <div className="area">
    <nav className="main-menu">
        <ul>
            <li>
                <a>
                    <span>
                        <img src={logo} width='56' height='68'></img>
                        <h1 className="nav-title">Tournzilla</h1>
                    </span>
                </a>
            </li>
            <br></br>
            <li>
                <Link to={"/"}>
                    <i className="fa fa-home fa-2x"></i>
                    <span className="nav-text">
                        Home
                    </span>
                </Link>
            
            </li>
            <li className="has-subnav">
            <Link to={"/tournaments"}>
                    <i className="fa fa-trophy"></i>
                    <span className="nav-text">
                        Tournaments
                    </span></Link>
            </li>
                <li className="has-subnav">
                <Link to={"/teams"}>
                <i className="fa fa-users"></i>
                    <span className="nav-text">
                        Teams
                    </span> </Link>
                
            </li>
            <li className="has-subnav">
            <Link to={"/players"}>
                <i className="fa fa-user"></i>
                    <span className="nav-text">
                        Players
                    </span></Link>
            </li>
            <li className='has-subnav'>
            {props.isAuthenticated 
                ?(<Link to={`/favorites/${props.user?.id}`}>
                    <i className="fa fa-star"></i>
                    <span className="nav-text">
                        Favorites
                    </span>
                </Link>) 
                :null}
            </li>
            <li>
            <Link to={"/rankings"}>
                    <i className="fa fa-list"></i>
                    <span className="nav-text">
                        Rankings
                    </span></Link>
            </li>
            <li>
            <Link to={"/news"}>
                <i className="fa fa-globe" aria-hidden="true"></i>
                    <span className="nav-text">
                        Newsletter
                    </span></Link>
            </li>
            <li>
            <Link to={"/forum"}>
                <i className="fa fa-comments" aria-hidden="true"></i>
                    <span className="nav-text">
                        Forum
                    </span></Link>
            </li>
        </ul>
        <ul className="lower">
            <li>
            {props.isAuthenticated && props.user
                ?(<Link to={`/userlist/${props.user?.id}`} onClick={() => visit(`/userlist/${props.user?.id}`)}>
                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    <span className="nav-text">
                        Profile
                    </span>
                </Link>)
                :null}
            </li>
            <li>
            {props.isAuthenticated && props.user?.is_staff
                ?(<Link to={`/reports`} onClick={() => visit(`/reports`)}>
                    <i className="fa fa-list-alt" aria-hidden="true"></i>
                    <span className="nav-text">
                        Reports
                    </span>
                </Link>)
                :null}
            </li>
            <li>
            {props.isAuthenticated
                ?(<Link to={`/achievements/${props.user?.id}`}>
                    <i className="fa fa-tags"></i>
                    <span className="nav-text">
                        Achievements
                    </span>
                </Link>)
                :null}
            </li>
            <li>
            <Link to={"/login"} onClick={() => !props.isAuthenticated ?navigate("/login") :handleLogout()}>
                    <i className="fa fa-power-off fa-2x"></i>
                    <span className="nav-text">
                        {props.isAuthenticated ? "Logout" : "Login"}
                    </span>
                </Link>
            </li>  
        </ul>
    </nav>
    <div className='header'>
        <a className='header-text' href='/about'>About us</a>
        <a className='header-text' href='/contact'>Contact</a>
        <a className='header-text' href='/privacypolicy'>Privacy policy</a>
        <a className='header-text' href='/termsandconditions'>Terms and conditions</a>
        {props.isAuthenticated && props.user ?<img className='header-img' src={props.user.profilephoto}></img> :null}
        <input type="checkbox" className='input-checkbox' id="switch" onClick={() => setTheme()}/>
        <label className='navbar-label' htmlFor="switch">Toggle</label>
    </div>
    </div>
   
  );
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
});

export default connect(mapStateToProps, {checkAuthenticated, loadUser, logout})(NavBar);
