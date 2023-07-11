import './css/Homepage.css';
import { Link, navigate } from "@reach/router";
import { blankspace, mainTitle, termsTitle, playerNameLink } from './Constants';
import { connect } from "react-redux";
import { loadUser, checkAuthenticated } from "./actions/auth";
import React, {useEffect, useState} from "react";

const Players = (props) => {

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    props.checkAuthenticated();
    props.loadUser();
  }, []);

  useEffect(() => {
    fetch('/api/players/')
    .then(response => response.json())
    .then(plyrs => {setPlayers(plyrs); console.log(plyrs[0].jerseyname)});
  }, []);

  return (
    <div className={blankspace}>
        <div >
        &nbsp;&nbsp;&nbsp;&nbsp;<h1 align='center' className={mainTitle}>Players</h1>
        <hr></hr>
        <h2 className={termsTitle}>A</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "A").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
         <hr></hr>
        <h2 className={termsTitle}>B</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "B").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
         <hr></hr>
        <h2 className={termsTitle}>C</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "C").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
         <hr></hr>
        <h2 className={termsTitle}>D</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "D").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
         <hr></hr>
        <h2 className={termsTitle}>E</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "E").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
         <hr></hr>
        <h2 className={termsTitle}>F</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "F").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
        <hr></hr>
        <h2 className={termsTitle}>G</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "G").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
         <hr></hr>
        <h2 className={termsTitle}>H</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "H").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
         <hr></hr>
        <h2 className={termsTitle}>I</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "I").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
         <hr></hr>
        <h2 className={termsTitle}>J</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "J").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
         <hr></hr>
        <h2 className={termsTitle}>K</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "K").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
         <hr></hr>
        <h2 className={termsTitle}>L</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "L").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
         <hr></hr>
        <h2 className={termsTitle}>M</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "M").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
        <hr></hr>
        <h2 className={termsTitle}>N</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "N").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
         <hr></hr>
        <h2 className={termsTitle}>O</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "O").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
         <hr></hr>
        <h2 className={termsTitle}>P</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "P").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
         <hr></hr>
        <h2 className={termsTitle}>Q</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "Q").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
         <hr></hr>
        <h2 className={termsTitle}>R</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "R").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
         <hr></hr>
        <h2 className={termsTitle}>S</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "S").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
         <hr></hr>
        <h2 className={termsTitle}>T</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "T").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
        <hr></hr>
        <h2 className={termsTitle}>U</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "U").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
         <hr></hr>
        <h2 className={termsTitle}>V</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "V").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
         <hr></hr>
        <h2 className={termsTitle}>W</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "W").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
         <hr></hr>
        <h2 className={termsTitle}>X</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "X").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
         <hr></hr>
        <h2 className={termsTitle}>Y</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "Y").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
         <hr></hr>
        <h2 className={termsTitle}>Z</h2>
        <div className='container-list-links'>
        {players.filter((el) => el.jerseyname[0].toUpperCase() === "Z").map((item) => {return (
          <Link className={playerNameLink} to={`/players/${item.id}`}><p>{item.jerseyname}</p>
          </Link>
       )}
        )}
         </div>
         <hr></hr>
       </div>
    </div>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});

export default connect(mapStateToProps, {checkAuthenticated, loadUser}) (Players);
