import './css/Homepage.css';
import './css/ModalLight.css';
import './css/Tournaments.css';
import './css/Misc.css';
import { countries, mainTitle, modalLabels, modalInput, calendarInput, 
         blankspace, isPotentionOf2, formatDateUS, getCountryWithoutFlag } from './Constants';
import {useState, useEffect} from "react";
import { navigate } from "@reach/router";
import { connect } from 'react-redux';
import { loadUser, checkAuthenticated } from "./actions/auth";


const TournamentCreate = (props) => { 

  const tomorrow = new Date();
  tomorrow.setDate(new Date().getDate() + 1);

  const searchParams = new URLSearchParams(props.location.search);
  const tournamentParam = searchParams ?  searchParams.get("tournamentData") : null;

  const [tournamentData, setTournamentData] = useState(JSON.parse(decodeURIComponent(tournamentParam)) ?? {
    name: '',
    host: getCountryWithoutFlag(countries[0]),
    qualifications: "No",
    friendly: "No",
    gender: 'all',
    startDate: formatDateUS(tomorrow),
    endDate: formatDateUS(tomorrow),
    participantSize: 2,
    resttime: '1 day'
  });

  const [showWarning, setShowWarning] = useState(false);
  const [wrongMsg, setWrongMsg] = useState(null);
  const [disableQuals, setDisableQuals] = useState(true);


  function saveData() {
    tournamentData.wrongMsg = null;
    tournamentData.showWarning = false;
    if (tournamentData.name === '') {
      setWrongMsg("Tournament name cannot be empty.");
      setShowWarning(true);
    } else if (tournamentData.participantSize < 2 || tournamentData.participantSize > 32) {
      setWrongMsg("Incorrect number of teams. Must be between 2 and 32.");
      setShowWarning(true);
    } else if (new Date(tournamentData.startDate) <= new Date() || new Date(tournamentData.startDate).toString() === 'Invalid Date') {
      setWrongMsg('Invalid date. Please select a valid day in the future (tomorrow or later).');
      setShowWarning(true);
    } else {
      navigate(`/tournaments/create/add-teams?tournamentData=${encodeURIComponent(JSON.stringify(tournamentData))}`);
    }
  }

  function calculateEndDate(startDt, quals, size, teamRest) {
    let totalDays = 0;
    let restVar = 0;
    let tempEnd = new Date(startDt)
    let tempNoOfTeams = size
    if (teamRest === '1 day') {
      restVar = 1
    } else if (teamRest === '2 days') {
      restVar = 2
    } else if (teamRest === '3 days') {
      restVar = 3
    }
    if (parseInt(size) === 2) {
      setTournamentData(prevState => ({...prevState, endDate: startDt}));
    } else if (parseInt(size) === 3) {
      tempEnd.setDate(tempEnd.getDate() + restVar + 1);
      setTournamentData(prevState => ({...prevState, endDate: formatDateUS(tempEnd)}));
    } else {
      if (quals === "Yes") {
        if (size === 4) {
          totalDays += (2 + 3 * restVar);
        }
        totalDays += (3 + 3 * restVar);
        tempNoOfTeams = tempNoOfTeams / 2;
      }
      if (!isPotentionOf2(parseInt(tempNoOfTeams))) {
        totalDays += restVar + 1
      } 
      while(!isPotentionOf2(parseInt(tempNoOfTeams))) {
        tempNoOfTeams -= 1;
      }
      while (tempNoOfTeams > 2) {
        totalDays += 1 + restVar
        tempNoOfTeams /= 2
      }
      totalDays += 1
      tempEnd.setDate(tempEnd.getDate() + totalDays);
      setTournamentData(prevState => ({...prevState, endDate: formatDateUS(tempEnd)}));
    }
  }


  useEffect(() => {
    props.checkAuthenticated();
    props.loadUser();
  }, []);

  useEffect(() => {
    if (tournamentData.participantSize === 0 || tournamentData.participantSize % 4 !== 0) {
      setTournamentData(prevState => ({...prevState, qualifications: 'No'}));
      setDisableQuals(true)
    } else {
      setDisableQuals(false)
    }
  }, [tournamentData.participantSize]);

  return(
    <div className={blankspace}>
      <div>
        <div>
        &nbsp;&nbsp;&nbsp;&nbsp;<h1 align='center' className={mainTitle}>Create tournament</h1>
        <div align='center'>
            <button className='modal-btn margin-left-xl' onClick={() => saveData()}>Next</button>
            &nbsp;&nbsp;
            <button onClick={() => navigate('/tournaments')} className='modal-btn'>Cancel</button>
            {showWarning 
            ? <p className='inline-warnings margin-left-xl'>{wrongMsg}</p> 
            : null}
        </div>
        <div className='create-wrapper'>
          <span className='create-wrapper1'>
            <label className={modalLabels}>Tournament name:<label className='inline-warnings'>*</label></label>
            <input className={modalInput} type="text" id="fname" defaultValue={tournamentData.name} onChange={(e) => setTournamentData(prevState => ({...prevState, name: e.target.value}))}/>
            <label className={modalLabels}>Number of teams:<label className='inline-warnings'>*</label></label>
            <input className={modalInput} type="number" id="teamsnumber" min="2" max="32" defaultValue={tournamentData.participantSize} onChange={(e) => {
              setTournamentData(prevState => ({...prevState, participantSize: e.target.value}))
              calculateEndDate(tournamentData.startDate, tournamentData.qualifications, e.target.value, tournamentData.resttime);
              }}/>
            <label className={modalLabels}>Qualifications:<label className='inline-warnings'>*</label></label>
            <select className={modalInput}
              id='qualidropdown'
              value={disableQuals ? "No" : tournamentData.qualifications}
              disabled={disableQuals}
              onChange = {(e) => {
                setTournamentData(prevState => ({...prevState, qualifications: e.target.value}))
                calculateEndDate(tournamentData.startDate, e.target.value, tournamentData.participantSize, tournamentData.resttime);
                }}>
              <option>No</option>
              <option>Yes</option>
            </select>
            <label className={modalLabels}>Host country:<label className='inline-warnings'>*</label></label>
            <select className={modalInput} 
              defaultValue={tournamentData.host}
              onChange = {(e) => setTournamentData(prevState => ({...prevState, host: getCountryWithoutFlag(e.target.value)}))}>
              {countries.map( (item) => {return <option>{item}</option>})}
            </select>
            <label className={modalLabels} htmlFor="start">Start date:<label className='inline-warnings'>*</label></label>
            <input type="date" id="start" name="event-start"
              className={calendarInput}
              onChange={(e) => {
                setTournamentData(prevState => ({...prevState, startDate: e.target.value}));
                calculateEndDate(e.target.value, tournamentData.qualifications, tournamentData.participantSize, tournamentData.resttime);
              }}
              defaultValue={tournamentData.startDate}
              min={String(new Date().getFullYear()+'-'+('0'+(new Date().getMonth()+1)).slice(-2)+'-'+('0'+new Date().getDate()).slice(-2))}>
            </input>
            <label className={modalLabels}>Friendly:<label className='inline-warnings'>*</label></label>
            <select className={modalInput}
              defaultValue={tournamentData.friendly}
              onChange = {(e) => setTournamentData(prevState => ({...prevState, friendly: e.target.value}))}>
              <option>Yes</option>
              <option>No</option>
            </select>
            <label className={modalLabels}>Players:<label className='inline-warnings'>*</label></label>
            <select className={modalInput}
              defaultValue={tournamentData.gender}
              onChange = {(e) => setTournamentData(prevState => ({...prevState, gender: e.target.value}))}>
              <option>all</option>
              <option>male</option>
              <option>female</option>
            </select>
            <label className={modalLabels}>Recovery time:<label className='inline-warnings'>*</label></label>
            <select className={modalInput}
              defaultValue={tournamentData.resttime}
              onChange = {(e) => {
                setTournamentData(prevState => ({...prevState, resttime: e.target.value}))
                calculateEndDate(tournamentData.startDate, tournamentData.qualifications, tournamentData.participantSize, e.target.value);
                }}>
              <option>No recovery time</option>
              <option>1 day</option>
              <option>2 days</option>
              <option>3 days</option>
            </select>
          </span>
          </div>
    </div> 
    </div>
    </div>
  )}

  const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
  });
  
  export default connect(mapStateToProps, {checkAuthenticated, loadUser})(TournamentCreate);