import "./css/Profile.css";
import male from "./images/male.png";
import female from "./images/female.png";
import Table from "./Table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import Modal from "./Modal";
import "./css/Modal.css";
import { positions, countries, profileBlankspace, profileCard, profileUsername, playerStatsCard, 
  playerProfileTitles, stroke, profileDialog, modalLabels, modalInput, getAgeFromBday,
  getCountryWithFlag, formatDateEU, formatMarketValue, calendarInput, formatDateUS, 
  termsTitle, getCountryWithoutFlag } from "./Constants";
import React, {useEffect, useState} from "react";
import { connect } from 'react-redux';
import { loadUser, checkAuthenticated } from "./actions/auth";
import ErrorPage from "./ErrorPage";
import { navigate } from "@reach/router";
import './css/Users.css';


const PlayerProfile = (props) => {
  const [player, setPlayer] = useState({})
  const [teams, setTeams] = useState({})
  const [team, setTeam] = useState({})
  const [show, setShow] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showRetire, setShowRetire] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showAddMarket, setShowAddMarket] = useState(false);
  const [showEditMarket, setShowEditMarket] = useState(false);
  const [profileImg, setProfileImg] = useState(player?.profilephoto)
  const [profileImgPreview, setProfileImgPreview] = useState(player?.profilephoto);
  const [pageError, setError] = useState(false)
  const [data, setData] = useState([])
  const [warning, setWarning] = useState(null)
  const [marketYearTmp, setMarketYearTmp] = useState(new Date().getFullYear())
  const [marketValueTmp, setMarketValueTmp] = useState(0)
  const [goalsOrSaves, setGoalsSaves] = useState(0)
  const [modalPositionText, setModalPositionText] = useState("Goals")
  
   async function handleSavePlayerInfo() {
    setWarning(null)
    if (document.getElementById("fname").value !== '') {
      const formData = new FormData();
      if (profileImg === undefined || typeof profileImg === 'string') {
        formData.append('profilephoto', player.profilephoto)
      }
      else {
        formData.append('profilephoto', profileImg, profileImg.name)
      }
      for ( var key in player ) {
        if (key.toString() !== 'profilephoto' && key.toString() !== 'goals' && key.toString() !== 'saves') {
          formData.append(key, player[key])
        }
      }
      if (modalPositionText === "Saves") {
        formData.append('saves', goalsOrSaves)
      } else {
        formData.append('goals', goalsOrSaves)
      }
      await fetch(`/api/players/${player?.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        body: formData
      },
      )
      fetch(`/api/players/${props.id}/`)
      .then((response) => response.json())
      .then(playerData => {
        setPlayer(playerData)
      })
    }
  }

  function transferPlayer(teamIdToTransfer) {
    setWarning(null)
    const fd = new FormData();
    fd.append('transfers', player.transfers + 1);
    fd.append('currentteam', teamIdToTransfer);
    fetch(`/api/players/${player?.id}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `JWT ${localStorage.getItem('access')}`
      },
      body: fd
    })
    .then(data => data.json())
    .then(resp => {
      if (resp?.message) {
        console.log(resp.message)
        setWarning(resp.message)
      } else {
        setShowTransfer(false)
        player.transfers = player.transfers + 1
      }
    })
    fetch(`/api/teams/${teamIdToTransfer}/`)
        .then(response => response.json())
        .then(theTeam => setTeam(theTeam))
  }

  function updateModalPositionText (pos) {
    if (pos === 'Goalkeeper') {
      setModalPositionText("Saves")
      setGoalsSaves(player?.saves)
    } else {
      setModalPositionText("Goals")
      setGoalsSaves(player?.goals)
    }
  }

  useEffect(() => {
    fetch(`/api/players/${props.id}/`)
    .then(response => {
      if (response.status === 500 || response.status === 404) {
        setError(true);
        return
      } else {
        return response.json();
      }
    })
    .then(thePlayer => {
      if (thePlayer?.position === "Goalkeeper") {
        setModalPositionText("Saves")
        setGoalsSaves(thePlayer?.saves)
      } else {
        setGoalsSaves(thePlayer?.goals)
      }
      setPlayer(thePlayer)
      fetch(`/api/teams/${thePlayer?.currentteam}/`)
      .then(response => response.json())
      .then(theTeam => setTeam(theTeam))
      fetch(`/api/teams/`)
      .then(response => response.json())
      .then(tms => setTeams(tms.filter(x => x.gender.toLowerCase() === thePlayer?.gender.toLowerCase())))
    })
    fetch(`/api/marketvalue/${props.id}/`)
    .then(resp => resp.json())
    .then(dt => setData(dt.map(item => ({
      name: item.year.toString(),
      mv: item.price
    }))))
  }, []);

  function setDefaults() {
    setProfileImg(player?.profilephoto);
    setProfileImgPreview(player?.profilephoto);
    fetch(`/api/players/${props.id}/`)
    .then((response) => response.json())
    .then(plData => setPlayer(plData))
  }

  function handleDeletePlayer() {
    fetch(`/api/players/${props.id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `JWT ${localStorage.getItem('access')}`
      }
    })
    .then(() => navigate('/players'))
  }

  function handleRetired(id) { 
    let fd = new FormData()
    fd.append("retired", true)
    fetch(`/api/players/${id}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `JWT ${localStorage.getItem('access')}`
      },
      body: fd
    })
    .then(_ => {
      player.retired = true
      player.currentteam = null
    })
  }

  function imageHandler (e) {
    const reader = new FileReader();
    reader.onload = () =>{
      if(reader.readyState === 2){
        setProfileImgPreview(reader.result)
        setProfileImg(e.target.files[0])
      }
    }
    reader.readAsDataURL(e.target.files[0])
  };

  function handleAddMarketValue(marketvalue, year) {
    const fd = new FormData();
    fd.append('price', marketvalue)
    fetch(`/api/marketvalueadd/${props.id}/${year}/`, {
      method: 'POST',
      headers: {
        'Authorization': `JWT ${localStorage.getItem('access')}`
      },
      body: fd
    })
    .then( _ => {
      fetch(`/api/marketvalue/${props.id}/`)
      .then(resp => resp.json())
      .then(dt => setData(dt.map(item => ({
        name: item.year.toString(),
        mv: item.price
      }))))
    })
    setShowAddMarket(false);
  }

  function handleEditMarketValues() {
    const years = document.querySelectorAll('input[id*="mvYear"]');
    const prices = document.querySelectorAll('input[id*="mvPrice"]');
    years.forEach((yearInput, index) => {
      const priceInput = prices[index];
      handleAddMarketValue(priceInput.value, yearInput.value)
    });
    setShowEditMarket(false);
  }

  function handleDeleteMarketValue(pid, yr) {
    fetch(`/api/marketvalueadd/${pid}/${yr}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `JWT ${localStorage.getItem('access')}`
      }
    })
    .then( _ => {
      fetch(`/api/marketvalue/${props.id}/`)
      .then(resp => resp.json())
      .then(dt => setData(dt.map(item => ({
        name: item.year.toString(),
        mv: item.price
      }))))
    })
  }

  return pageError ? <ErrorPage /> : (
    <div className={profileBlankspace}>
      <div>
        {
          show ? (
              <Modal id='root'>
                  <div className="deletion-dialog2 deletion-dialog3">
                      <dialog open className={profileDialog}>
                      <span>
                        <label className={modalLabels}>Player name:</label>
                        <input className={modalInput} defaultValue={player.name} onChange={(e) => player.name = e.target.value} type="text" id="fname" name="fname"/><br/><br/>
                        <label className={modalLabels}>Date of birth:</label>
                        <input type="date" id="bday" name="event-start"
                          className={calendarInput}
                          defaultValue={String(new Date(player?.birthday).getFullYear()+'-'+('0'+(new Date(player?.birthday).getMonth()+1)).slice(-2)+'-'+('0'+new Date(player?.birthday).getDate()).slice(-2))}
                          min={String(new Date().getFullYear()-150+'-'+('0'+(new Date().getMonth()+1)).slice(-2)+'-'+('0'+new Date().getDate()).slice(-2))}
                          max={String(new Date().getFullYear()-10+'-'+('0'+(new Date().getMonth()+1)).slice(-2)+'-'+('0'+new Date().getDate()).slice(-2))}
                          onChange={e => player.birthday = formatDateUS(e.target.value)}>
                        </input><br/><br/>
                        <label className={modalLabels}>Nationality:</label>
                        <select className={modalInput} defaultValue={getCountryWithFlag(player?.country)} onChange = {(e) => player.country = e.target.value === "???" ? e.target.value : getCountryWithoutFlag(e.target.value)}>{countries.map( (item) => {return <option>{item}</option>})}</select><br/><br/>
                        <img src={profileImgPreview} className='photo-in-modal'></img>
                        <br></br>
                        <input type="file" accept="image/*" onChange={e => imageHandler(e)}/>
                        <br></br> 
                        <label className={modalLabels}>Jersey name:</label>
                        <input className={modalInput} defaultValue={player.jerseyname} onChange={(e) => player.jerseyname = e.target.value} type="text" id="jname" /><br/><br/>
                        <label className={modalLabels}>Jersey number:</label>
                        <input className={modalInput} defaultValue={player.jerseynumber} onChange={(e) => player.jerseynumber = e.target.value} type="number" id="jnumba" /><br/><br/>
                        <label className={modalLabels}>Started playing:</label>
                        <input className={modalInput} type="number" id="started" min={new Date(player?.birthday).getFullYear()+14} max={new Date().getFullYear()} defaultValue={player?.startedplaying} onChange={(e) => player.startedplaying = parseInt(e.target.value)}/><br/><br/>
                        {warning ?<p className="inline-warnings">{warning}</p> : null}
                       </span>
                      <span>
                        <label className={modalLabels}>Position:</label>
                        <select className={modalInput} defaultValue={player?.position} onChange = {(e) => {player.position = e.target.value; updateModalPositionText(e.target.value)}}>{positions.map( (item) => {return <option>{item}</option>})}</select>
                        <br/><br/>
                        <label className={modalLabels}>Height in m:</label>
                        <input className={modalInput} type="number" id="weight" min="1.40" step="0.01" defaultValue={player?.height} onChange={(e) => player.height = parseFloat(e.target.value)}/><br/><br/>
                        <label className={modalLabels}>Weight in kg:</label>
                        <input className={modalInput} type="number" id="height" min="50" defaultValue={player?.weight} onChange={(e) => player.weight = parseFloat(e.target.value)}/><br/><br/>
                        <label className={modalLabels}>{modalPositionText}:</label>
                        <input className={modalInput} type="number" id="goals" min="0" value={goalsOrSaves} onChange={(e) => setGoalsSaves(parseInt(e.target.value))}/><br/><br/>
                        <label className={modalLabels}>Yellow cards:</label>
                        <input className={modalInput} type="number" id="yellows" min="0" defaultValue={player?.yellowcards} onChange={(e) => player.yellowcards = parseInt(e.target.value)}/><br/><br/>
                        <label className={modalLabels}>Red cards:</label>
                        <input className={modalInput} type="number" id="reds" min="0" defaultValue={player?.redcards} onChange={(e) => player.redcards = parseInt(e.target.value)}/><br/><br/>
                        <label className={modalLabels}>Games played:</label>
                        <input className={modalInput} type="number" id="gplayed" min="0" defaultValue={player?.gamesplayed} onChange={(e) => player.gamesplayed = parseInt(e.target.value)}/><br/><br/>
                        <label className={modalLabels}>Transfers:</label>
                        <input className={modalInput} type="number" id="transfers" min="0" defaultValue={player?.transfers} onChange={(e) => player.transfers = parseInt(e.target.value)}/><br/><br/>
                        <label className={modalLabels}>Assists:</label>
                        <input className={modalInput} type="number" id="assists" min="0" defaultValue={player?.assists} onChange={(e) => player.assists = parseInt(e.target.value)}/><br/><br/>
                      </span>
                      <div>
                          <button className='modal-btn' onClick={() => {setShow(false);handleSavePlayerInfo()}}>Save</button><br></br>
                          <button className='modal-btn' onClick={() => {setDefaults();setShow(false)}}>Cancel</button>
                      </div>
                      </dialog>
                  </div>
              </Modal>
          ):null
        }
        {
          showDelete ?  (
            <Modal id='root'>
              <div className="deletion-dialog">
                <dialog open className={profileDialog}>
                <span>
                  <h1 className={termsTitle}>Confirm delete</h1>
                  <br/><br/>
                </span>
                <div>
                    <button className='modal-btn' onClick={() => {setShowDelete(false);handleDeletePlayer()}}>Save</button><br></br>
                    <button className='modal-btn' onClick={() => setShowDelete(false)}>Cancel</button>
                </div>
                </dialog>
              </div>
          </Modal>
        ):null
        }
        {
          showTransfer ?  (
            <Modal id='root'>
              <div className="deletion-dialog">
                <dialog open className={profileDialog}>
                <span>
                  <h1 className={termsTitle}>Transfer player</h1>
                  <select className={modalInput} defaultValue={team ? team?.id + " " + team?.name : teams[0]} onChange = {(e) => {player.currentteam = parseInt(e.target.value.split(" ")[0])}}>{teams.map( (item) => {return <option>{item.id + " " + item.name}</option>})}</select><br/><br/>
                  {warning ? <p className="inline-warnings">{warning}</p> : null}
                  <br/><br/>
                </span>
                <div>
                    <button className='modal-btn' onClick={() => {transferPlayer(player.currentteam)}}>Save</button><br></br>
                    <button className='modal-btn' onClick={() => setShowTransfer(false)}>Cancel</button>
                </div>
                </dialog>
              </div>
          </Modal>
        ):null
        }
        {
          showAddMarket ?  (
            <Modal id='root'>
              <div className="deletion-dialog">
                <dialog open className={profileDialog}>
                <span>
                  <h1 className={termsTitle}>Add market value &nbsp;</h1>
                  <label className={modalLabels}>Year:</label>
                  <input className={modalInput} type="number" min={player?.startedplaying} max={new Date().getFullYear()} defaultValue={new Date().getFullYear()} onChange = {(e) => {setMarketYearTmp(parseInt(e.target.value))}}>
                  </input><br/><br/>
                  <label className={modalLabels}>Price ($):</label>
                  <input className={modalInput} type="number" id="price" min="0" max="500000000" defaultValue={marketValueTmp} onChange={(e) => setMarketValueTmp(parseInt(e.target.value))}/><br/><br/>
                  <br/><br/>
                </span>
                <div>
                    <button className='modal-btn' onClick={() => handleAddMarketValue(marketValueTmp, marketYearTmp)}>Save</button><br></br>
                    <button className='modal-btn' onClick={() => setShowAddMarket(false)}>Cancel</button>
                </div>
                </dialog>
              </div>
          </Modal>
        ):null
        }
        {
          showRetire ?  (
            <Modal id='root'>
              <div className="deletion-dialog">
                <dialog open className={profileDialog}>
                <span>
                  <h1 className={termsTitle}>Retire player?</h1>
                  <br/><br/>
                </span>
                <div>
                    <button className='modal-btn' onClick={() => {setShowRetire(false);handleRetired(props.id)}}>Save</button><br></br>
                    <button className='modal-btn' onClick={() => setShowRetire(false)}>Cancel</button>
                </div>
                </dialog>
              </div>
          </Modal>
        ):null
        }
        {
          showEditMarket ?  (
            <Modal id='root'>
              <div className="deletion-dialog">
                <dialog open className={profileDialog}>
                <span className="scrollable-marketvalue">
                  <h1 className={termsTitle}>Edit market values &nbsp;</h1>
                  {data.map(x => {
                    return <span className="flex-form small-right-padding">
                      <label className={modalLabels}>Year:</label>
                      <input id={`mvYear${x.name}`} disabled className={modalInput} type="number" min={player?.startedplaying} max={new Date().getFullYear()} defaultValue={x.name}>
                      </input><br/><br/>
                      <label className={modalLabels}>Price ($):</label>
                      <input id={`mvPrice$${x.mv}`} className={modalInput} type="number" min="0" max="500000000" defaultValue={x.mv}/><br/><br/>
                      <button className="bin-forum"><i className="fa fa-trash-o" aria-hidden="true" onClick={() => handleDeleteMarketValue(props.id, x.name)}></i>&nbsp;&nbsp;</button>
                   </span>
                  })}
                  <br/><br/>
                </span>
                <div>
                    <button className='modal-btn' onClick={() => handleEditMarketValues()}>Save</button><br></br>
                    <button className='modal-btn' onClick={() => setShowEditMarket(false)}>Cancel</button>
                </div>
                </dialog>
              </div>
          </Modal>
        ):null
        }
        </div>
        <div className="profile-parts">
          <div className="profile-container">
            <div className={profileCard}>
              <div className="player-edit-dropdown">
                <ul className="profile-flag">
                  <li>
                    {props.user?.is_staff ? <i className="fa fa-pencil profile-fa" aria-hidden="true"></i> : null}
                    <div className="dropdown-content">
                      <a onClick={() => {setDefaults();setShow(true)}}>Edit player info</a>
                      <a onClick={() => setShowTransfer(true)}>Transfer</a>
                      {!player.retired && <a onClick={() => setShowRetire(true)}>Retire</a>}
                      <a onClick={() => setShowDelete(true)}>Delete player</a>
                  </div>
                  </li>
                </ul>
              </div>
              <img
                src={player.profilephoto}
                className="player-photo"
              />
              <br></br>
              <br></br>
              <div className="player-profile-main">
                <img
                  className="profile-gender"
                  src={player.gender === 'male' ? male : female}
                ></img>
                <h1 className={profileUsername}>{player.jerseyname} ({player.jerseynumber})</h1>
                <img
                  className="profile-team-icon"
                  src={team?.logo}
                ></img>
              </div>
              <hr />
              <p className='profile-label-text2'><b>Full name:&nbsp;</b>{player.name}</p>
              <p className='profile-label-text2'><b>Birthday:&nbsp;</b>{player.birthday ? formatDateEU(player.birthday) : "???"} (Age {getAgeFromBday(player.birthday) ?? "???"})</p>
              <p className='profile-label-text2'><b>Nationality:&nbsp;</b>{getCountryWithFlag(player.country)}</p>
              <hr />
              <div className="profile-container">
                <div className="content">
                </div>
              </div>
            </div>
            <div className='flex-cards'>
                <div className={playerStatsCard}>
                <br></br>
                <h1 className={playerProfileTitles}>Player stats</h1>
                  <br></br>
                    <Table 
                      title1="Position" title2="Height(m)" title3="Weight(kg)" title4="Current team" title5={player.position === "Goalkeeper" ? "Saves" : "Goals"}
                      value1={player.position} value2={player.height ?? "???"} value3={player.weight ?? "???"} value4={team.name ?? '-'} value5={goalsOrSaves}
                    />
                    <br></br>
                    <Table 
                      title1="Yellow cards" title2="Red cards" title3="Games played" title4="Total transfers" title5="Assists"
                      value1={player.yellowcards} value2={player.redcards} value3={player.gamesplayed} value4={player.transfers} value5={player.assists}
                    /><br></br><br></br>
                    <span>
                      <h1 className={playerProfileTitles}>Market value in USD 💰</h1>
                     {props.user?.is_staff ? <div className="market-value-buttons">
                        <button className="card-button-goto" onClick={() => setShowAddMarket(true)}>Add</button>
                        <button className="card-button-goto" onClick={() => setShowEditMarket(true)}>Edit</button>
                      </div> : null}
                    </span>
                    <br/><br/><br/>
                    <LineChart width={800} height={300} data={data}>
                      <XAxis stroke='grey' dataKey="name"/>
                      <YAxis stroke='grey' tickFormatter={formatMarketValue}/>
                      <CartesianGrid stroke="grey" strokeDasharray="5 5"/>
                      <Line type="monotone" dataKey="mv" stroke={stroke} />
                    </LineChart>
                    <hr/>
                </div>
            </div>
          </div>
        </div>
    </div>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});

export default connect(mapStateToProps, {checkAuthenticated, loadUser})(PlayerProfile);
