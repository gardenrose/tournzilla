import "./css/Profile.css";
import Modal from "./Modal";
import "./css/Modal.css";
import './css/Misc.css';
import { positions, countries, profileBlankspace, profileDialog, modalLabels, 
        modalInput, mainTitle,  calendarInput, formatDateUS, getCountryWithoutFlag } from "./Constants";
import React, {useEffect, useState} from "react";
import { connect } from 'react-redux';
import { loadUser, checkAuthenticated } from "./actions/auth";
import ErrorPage from "./ErrorPage";
import { navigate } from "@reach/router";
import moment from 'moment';


const AddPlayer = (props) => {
  const [teams, setTeams] = useState([])
  const [goals, setGoals] = useState(0);
  const [name, setName] = useState('');
  const [jerseyName, setJerseyName] = useState('');
  const [jerseynumber, setJerseyNumber] = useState(0);
  const [weight, setWeight] = useState(80);
  const [height, setHeight] = useState(1.90);
  const [yellows, setYellows] = useState(0);
  const [reds, setReds] = useState(0);
  const [curentTeam, setTeam] = useState({});
  const [assists, setAssists] = useState(0);
  const [playerPosition, setPosition] = useState(positions[1]);
  const [playerNationality, setNationality] = useState(countries[1]);
  const [gamesplayed, setGames] = useState(0);
  const [transfers, setTransfers] = useState(0);
  const [birthday, setBirthday] = useState(moment().add(-16, 'years').format("yyyy-MM-DD"))
  const [showWarning, setShowWarning] = useState(false);  
  const [wrongMsg, setWrongMsg] = useState(null)
  const [rating, setRating] = useState(1000);
  const [profilephoto, setProfilePhoto] = useState("../../media/genericplayer.png");
  const [imagePreview, setImgPreview] = useState("../../media/genericplayer.png");

  const onChangeGoals = event => {
    console.log("Goals changed");
    setGoals(event.target.value);
  };
  const onChangeHeight = event => {
    setHeight(event.target.value);
  };
  const onChangeWeight = event => {
    setWeight(event.target.value);
  };
  const onChangeYellows = event => {
    setYellows(event.target.value);
  };
  const onChangeReds = event => {
    setReds(event.target.value);
  };
  const onChangeGamesPlayed = event => {
    setGames(event.target.value);
  };
  const onChangeAssists = event => {
    setAssists(event.target.value);
  };
  const onChangeTransfers = event => {
    setTransfers(event.target.value);
  };
  const onChangeName = event => {
    setName(event.target.value);
  };
  const onChangeJerseyName = event => {
    setJerseyName(event.target.value);
  };
  const onChangeJerseyNumber = event => {
    setJerseyNumber(event.target.value);
  };
  const onChangeTeam = event => {
    setTeam(getTeamByName(event.target.value))
  }
  const onChangeRating = event => {
    setRating(event.target.value)
  }

  function imageHandler (e) {
    const reader = new FileReader();
    reader.onload = () => {
      if(reader.readyState === 2) {
        setImgPreview(reader.result)
        setProfilePhoto(e.target.files[0])
      }
    }
    reader.readAsDataURL(e.target.files[0])
  };

  useEffect(() => {
    props.checkAuthenticated();
    props.loadUser();
    fetch('/api/teams/')
    .then(response => response.json())
    .then(allTeams => {
        setTeams(allTeams);
        setTeam(allTeams.filter(x => x.id === parseInt(props.id))[0]);
    })
  }, []);

  function handleAdd() {
    if (document.getElementById('fname').value === '' || document.getElementById('jname').value === '') {
        setWrongMsg('Fill all the required fields');
        setShowWarning(true)
    }
    else {
        const formData = new FormData()
        formData.append('name', name)
        formData.append('jerseyname', jerseyName)
        formData.append('birthday', typeof birthday === 'number' ? "???" : birthday)
        formData.append('currentteam', curentTeam.id)
        formData.append('country', playerNationality !== "???" ? getCountryWithoutFlag(playerNationality) : playerNationality)
        formData.append('jerseynumber', jerseynumber)
        formData.append('rating', rating)
        formData.append('position', playerPosition)
        formData.append('height', height)
        formData.append('weight', weight)
        formData.append('goals', goals)
        formData.append('redcards', reds)
        formData.append('yellowcards', yellows)
        formData.append('gamesplayed', gamesplayed)
        formData.append('transfers', transfers)
        formData.append('assists', assists)
        curentTeam ? formData.append('curentteam', curentTeam?.id) :null
        console.log(profilephoto)
        console.log(typeof profilephoto)
        if (profilephoto === undefined || profilephoto === null || typeof profilephoto === 'string') {
            setProfilePhoto("../../media/genericplayer.png")
            formData.append('profilephoto', profilephoto)
        }
        else {
        formData.append('profilephoto', profilephoto, profilephoto.name)
        }
        for (const value of formData.values()) {
            console.log(value);
          }
        fetch(`/api/players/${curentTeam.id}/`, {
            method: 'POST',
            headers: {
              'Authorization': `JWT ${localStorage.getItem('access')}`
            },
            body: formData
        })
        .then(data => data.json())
        .then(response => {
        if (response.message) {
            setWrongMsg(response.message)
            setShowWarning(true)
        } else {
            navigate(-1)
        }
        })
    }
  }

  function getTeamByName(name) {
    return teams.filter(x => x.name === name)[0]
  }

  return !props?.user?.is_staff ? <ErrorPage /> 
    : (
    <div className={profileBlankspace}>
        <h1 align='center' className={mainTitle}>Create player</h1>
        <br/>
        <Modal id='root'>
            <div className="modal-dialog margin-top-s">
                <dialog open className={profileDialog}>
                <span>
                <label className={modalLabels}>Full name:<label className='inline-warnings'>*</label></label>
                <input className={modalInput} onChange={onChangeName} type="text" id="fname" name="fname"/><br/><br/>
                <label className={modalLabels}>Name on jersey:<label className='inline-warnings'>*</label></label>
                <input className={modalInput} onChange={onChangeJerseyName} type="text" id="jname" name="fname"/><br/><br/>
                <label className={modalLabels}>Date of birth:</label>
                <input type="date" id="bday" name="event-start"
                    className={calendarInput}
                    defaultValue={birthday}
                    min={String(new Date().getFullYear()-50+'-'+('0'+(new Date().getMonth()+1)).slice(-2)+'-'+('0'+new Date().getDate()).slice(-2))}
                    max={String(new Date().getFullYear()-16+'-'+('0'+(new Date().getMonth()+1)).slice(-2)+'-'+('0'+new Date().getDate()).slice(-2))}
                    onChange={e => setBirthday(typeof birthday === 'number' ? "???" :formatDateUS(e.target.value))}>
                </input><br/><br/>
                <label className={modalLabels}>Current team:</label>
                <select className={modalInput} value={curentTeam.name} onChange = {onChangeTeam}>{teams.map( (item) => {return <option>{item.name}</option>})}</select><br/><br/>
                <label className={modalLabels}>Nationality:</label>
                <select className={modalInput} defaultValue={playerNationality} onChange = {(e) => setNationality(e.target.value)}>{countries.map( (item) => {return <option>{item}</option>})}</select><br/><br/>
                <img
                src={imagePreview}
                className="medium-photo"></img><br></br>
                <input type="file" accept="image/*" onChange={e => imageHandler(e)}/>
                <label className={modalLabels}>Rating:</label>
                <input className={modalInput} type="number" defaultValue={1000} min={200} max={1800} onChange = {onChangeRating}/><br/><br/>
                <label className={modalLabels}>Jersey number:</label>
                <input className={modalInput} type="number" defaultValue={jerseynumber} min={0} max={99} onChange = {onChangeJerseyNumber}/><br/><br/>  
                </span>
                <span>
                <label className={modalLabels}>Preferred position:</label>
                <select className={modalInput} defaultValue={playerPosition} onChange = {(e) => setPosition(e.target.value)}>{positions.map( (item) => {return <option>{item}</option>})}</select>
                <br/><br/>
                <label className={modalLabels}>Height in m:</label>
                <input className={modalInput} type="number" id="weight" min="1.40" step="0.01" defaultValue={height} onChange={onChangeHeight}/><br/><br/>
                <label className={modalLabels}>Weight in kg:</label>
                <input className={modalInput} type="number" id="height" min="50" defaultValue={weight} onChange={onChangeWeight}/><br/><br/>
                <label className={modalLabels}>Goals:</label>
                <input className={modalInput} type="number" id="goals" min="0" defaultValue={0} onChange={onChangeGoals}/><br/><br/>
                <label className={modalLabels}>Yellow cards:</label>
                <input className={modalInput} type="number" id="yellows" min="0" defaultValue={0} onChange={onChangeYellows}/><br/><br/>
                <label className={modalLabels}>Red cards:</label>
                <input className={modalInput} type="number" id="reds" min="0" defaultValue={0} onChange={onChangeReds}/><br/><br/>
                <label className={modalLabels}>Games played:</label>
                <input className={modalInput} type="number" id="gplayed" min="0" defaultValue={0} onChange={onChangeGamesPlayed}/><br/><br/>
                <label className={modalLabels}>Transfers:</label>
                <input className={modalInput} type="number" id="transfers" min="0" defaultValue={0} onChange={onChangeTransfers}/><br/><br/>
                <label className={modalLabels}>Assists:</label>
                <input className={modalInput} type="number" id="assists" min="0" defaultValue={0} onChange={onChangeAssists}/><br/><br/>
                </span>
                <div>
                    <button className='modal-btn' onClick={() => handleAdd()}>Save</button><br></br>
                    <button className='modal-btn' onClick={() => navigate(-1)}>Cancel</button>
                    {showWarning ? <p className="warnings">{wrongMsg}</p> :null}
                </div>
                </dialog>
            </div>
        </Modal>                   
    </div>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});

export default connect(mapStateToProps, {checkAuthenticated, loadUser})(AddPlayer);