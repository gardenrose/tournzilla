import './css/Homepage.css';
import ContentCard from './ContentCard';
import Table from './Table';
import { blankspace, contactSubtitle, countries, formatDateEU, getCountryWithFlag,
   modalLabels, mainTitle, modalInput, profileCard2, termsTitle, 
   tournamentBasic, getCountryWithoutFlag, profileDialog, cardDesc, playerNameLink, makeDefaultFormation, makeCustomFormation} from './Constants';
import { SingleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';
import globe from "./images/globe.png";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { loadUser, checkAuthenticated } from "./actions/auth";
import Modal from './Modal';
import ErrorPage from './ErrorPage';
import { navigate } from '@reach/router';

const TournamentDetails = (props) => {

  const [current, setCurrent] = useState({})
  const [editState, setEditState] = useState(current)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [wrongInputMsg, setWrongInputMsg] = useState(undefined)
  const [mascotPreview, setMascotPreview] = useState(current?.mascot)
  const [openingPreview, setOpeningPreview] = useState(current?.openingphoto)
  const [itemPhotoPreview, setItemPhotoPreview] = useState(current?.itemphoto)
  const [hasErrors, setHasErrors] = useState(false)
  const [winner, setWinner] = useState({})
  const [second, setSecond] = useState({})
  const [third, setThird] = useState({})
  const [fourth, setFourth] = useState({})

  useEffect(() => {
    
    fetch(`/api/tournaments/${props.id}/`)
    .then(response => {
      if (response.status === 500 || response.status === 404) {
      setHasErrors(true)
    } else {
      return response.json();
    }})
    .then(data => {
      setCurrent(data)
      if (data.winner) {
        fetch(`/api/teams/${data.winner}/`)
        .then(res => res.json())
        .then(wnr => setWinner(wnr))
      } if (data.secondplace) {
        fetch(`/api/teams/${data.secondplace}/`)
        .then(res => res.json())
        .then(sec => setSecond(sec))
      } if (data.fourthplace) {
        fetch(`/api/teams/${data.fourthplace}/`)
        .then(res => res.json())
        .then(frth => setFourth(frth))
      } if (data.thirdplace) {
        fetch(`/api/teams/${data.thirdplace}/`)
        .then(res => res.json())
        .then(thrd => setThird(thrd))
      }
      setMascotPreview(data?.mascot)
      setOpeningPreview(data?.openingphoto)
      setItemPhotoPreview(data?.itemphoto)
    });
    fetch(`/api/tournaments/${props.id}/matches/`)
    .then(matchesRsp => matchesRsp.json())
    .then(matches => matches.map(mtch => {
      if (mtch.referee === null && mtch.team1 !== 500 && mtch.team2 !== 500) {
        fetch(`/api/teams/${mtch.team1}/`)
        .then(t1resp => t1resp.json())
        .then(tm1 => {
          fetch(`/api/teams/${mtch.team2}/`)
            .then(tm2resp => tm2resp.json())
            .then(tm2 => {
              fetch(`/api/refereeing/${mtch.matchdate}/`)
                .then(rs => rs.json())
                .then(data => {
                  const referees = data.filter(ref => ref.country !== tm1.country && ref.country !== tm2.country);
                    if (referees.length > 0) {
                      const randomReferee = referees[Math.floor(Math.random() * referees.length)];
                      const fData = new FormData()
                      fData.append('referee', randomReferee.name)
                      fetch(`/api/tournaments/${mtch.championshipid}/matches/${mtch.matchid}/`,{
                        method: 'PUT',
                        headers: { 
                          'Authorization': `JWT ${localStorage.getItem('access')}`
                        },
                        body: fData
                      })
                      fetch(`/api/refereeing/${mtch.matchdate}/`, {
                        method: 'POST',
                        headers: { 
                          'Authorization': `JWT ${localStorage.getItem('access')}`
                        },
                        body: JSON.stringify({"referee":randomReferee.name})
                      })
                    }
                })
            })
        })
      }
      
      
      fetch(`/api/formations/${mtch.matchid}/`)
      .then(formRsp => formRsp.json())
      .then(formations => {
        if (formations?.length === 0) {
          console.log("you need to make formations")
          fetch('/api/players/')
          .then(dt => dt.json())
          .then(players => {
            let players1 = players.filter(pl => pl.currentteam === mtch.team1)
            let players2 = players.filter(pl => pl.currentteam === mtch.team2)
            if (mtch.team1 === 500) {
              fetch(`/api/formations/${mtch.matchid}/`,{
                method: 'POST',
                headers: { 
                  'Authorization': `JWT ${localStorage.getItem('access')}`
                },
                body: makeDefaultFormation(mtch.team1)
              })
            } else {
              fetch(`/api/formations/${mtch.matchid}/`,{
                method: 'POST',
                headers: { 
                  'Authorization': `JWT ${localStorage.getItem('access')}`
                },
                body: makeCustomFormation(mtch.team1, players1)
              })
            }
            if (mtch.team2 === 500) {
              fetch(`/api/formations/${mtch.matchid}/`,{
                method: 'POST',
                headers: { 
                  'Authorization': `JWT ${localStorage.getItem('access')}`
                },
                body: makeDefaultFormation(mtch.team2)
              })
            } else {
              fetch(`/api/formations/${mtch.matchid}/`,{
                method: 'POST',
                headers: { 
                  'Authorization': `JWT ${localStorage.getItem('access')}`
                },
                body: makeCustomFormation(mtch.team2, players2)
              })
            }
          })
        }
      })
    }))
  }, [])

  function setDefaults() {
    setWrongInputMsg(null);
    setEditState(current);
  }

  function imageHandler (e, imgPosition) {
    const reader = new FileReader();
    reader.onload = () => {
      if(reader.readyState === 2){
        if (imgPosition === 1) {
          setMascotPreview(reader.result)
          setEditState({...editState, mascot:e.target.files[0]})
        }
        else if (imgPosition === 2) {
          setOpeningPreview(reader.result)
          setEditState({...editState, openingphoto:e.target.files[0]})
        }
        else if (imgPosition === 3) {
          setItemPhotoPreview(reader.result)
          setEditState({...editState, itemphoto:e.target.files[0]})
        }
      }
    }
    reader.readAsDataURL(e.target.files[0])
  };

  async function handleEdit () {
    const formData = new FormData();
    if (editState.mascot === undefined || typeof editState.mascot === 'string') {
      setEditState({...editState, mascot: '../../media/default_photo.jpeg'})
      formData.append('mascot', editState['mascot'])
    }
    else {
      formData.append('mascot', editState['mascot'], editState['mascot'].name)
    }
    if (editState.openingphoto === undefined || typeof editState.openingphoto === 'string') {
      setEditState({...editState, openingphoto: '../../media/default_photo.jpeg'})
      formData.append('openingphoto', editState['openingphoto'])
    }
    else {
      formData.append('openingphoto', editState['openingphoto'], editState['openingphoto'].name)
    }
    if (editState.itemphoto === undefined || typeof editState.itemphoto === 'string') {
      setEditState({...editState, itemphoto: '../../media/default_photo.jpeg'})
      formData.append('itemphoto', editState['itemphoto'])
    }
    else {
      formData.append('itemphoto', editState['itemphoto'], editState['itemphoto'].name)
    }
    for ( var key in editState ) {
      if (editState[key] !== null && key.toString() !== 'itemphoto' && key.toString() !== 'mascot' && key.toString() !== 'openingphoto'){
          formData.append(key, editState[key]);
      }
    }
    await fetch(`/api/tournaments/${props.id}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `JWT ${localStorage.getItem('access')}`
      },
      body: formData })
      .then((response) => response.json())
      .then((data) => {
        setWrongInputMsg(data?.message)
        if (!data?.message) {
          setShowEdit(false)
          fetch(`/api/tournaments/${props.id}`)
          .then(response => response.json())
          .then(trnm => setCurrent(trnm))
        }
    });
    await fetch(`/api/tournaments/${props.id}/`)
    .then(response => response.json())
    .then(theTournament => {
      setCurrent(theTournament);
      setEditState(theTournament);
      setMascotPreview(theTournament.mascot);
      setOpeningPreview(theTournament.openingphoto);
      setItemPhotoPreview(theTournament.itemphoto);
    })
  }

  function handleDeleteTournament(id) {
    fetch(`/api/tournaments/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type':'application/json', 
        'Authorization': `JWT ${localStorage.getItem('access')}`
      }
    })
    .then(() => navigate('/tournaments'))
  }

  return hasErrors ? <ErrorPage /> : (
    <div className={blankspace}>
        <div >
        &nbsp;&nbsp;&nbsp;&nbsp;<h1 align='center' className={mainTitle}>{current?.name}</h1>
        <button className='add-btn' onClick={() => {setDefaults();setShowEdit(true)}}>edit</button>
        <button className='card-button-negative' onClick={() => setShowDelete(true)}>delete</button>
        {
          showEdit ?  (
            <Modal id='root'>
              <div className="deletion-dialog2 deletion-dialog3">
                <dialog open className={profileDialog}>
                <span>
                  <label className={modalLabels}>Name:</label>
                  <input className={modalInput} defaultValue={current?.name} onChange={(e) => current.name = e.target.value} type="text" id="jname" /><br/><br/>
                  <br/>
                  <label className={modalLabels}>Host country:</label>
                  <select className={modalInput} defaultValue={getCountryWithFlag(current?.host)} onChange = {(e) => current.host = e.target.value === "???" ? e.target.value : getCountryWithoutFlag(e.target.value)}>{countries.map( (item) => {return <option>{item}</option>})}</select><br/><br/>
                  <br/>
                  <label className={modalLabels}>Mascot name:</label>
                  <input className={modalInput} defaultValue={current?.mascotname} onChange={(e) => current.mascotname = e.target.value} type="text" id="jmascot" /><br/><br/>
                  <br/>
                  <label className={modalLabels}>Mascot description:</label>
                  <input className={modalInput} defaultValue={current?.mascotdesc} onChange={(e) => current.mascotdesc = e.target.value} type="text" id="jmdesc" /><br/><br/>
                  <br/>
                  <label className={modalLabels}>Opening description:</label>
                  <input className={modalInput} defaultValue={current?.openingdesc} onChange={(e) => current.openingdesc = e.target.value} type="text" id="jodesc" /><br/><br/>
                  <br/>
                  <label className={modalLabels}>Played in cities:</label>
                  <input type='number' min="0" className={modalInput} defaultValue={current?.cities} onChange={(e) => current.cities = e.target.value} id="jcities" /><br/><br/>
                  <br/>
                  <label className={modalLabels}>Attendance:</label>
                  <input type='number' min="0" className={modalInput} defaultValue={current?.attendance} onChange={(e) => current.attendance = e.target.value} id="attendance" /><br/><br/>
                  <br/>
                </span>
                <span>
                  <label className={modalLabels}>Organization cost ($):</label>
                  <input type='number' min="0" className={modalInput} defaultValue={current?.organisationcost} onChange={(e) => current.organisationcost = e.target.value} id="cost" /><br/><br/>
                  <br/><br/>
                  <img src={mascotPreview} width="220" height="140"></img>
                  <label className={modalLabels}>Mascot image:</label>
                  <input type="file" accept="image/*" className={cardDesc} onChange={e => imageHandler(e, 1)}/>
                  <br></br> 
                  <img src={openingPreview} width="220" height="140"></img>
                  <label className={modalLabels}>Opening image:</label>
                  <input type="file" accept="image/*" className={cardDesc} onChange={e => imageHandler(e, 2)}/>
                  <br></br>
                  <img src={itemPhotoPreview} width="220" height="140"></img>
                  <label className={modalLabels}>List item image:</label>
                  <input type="file" accept="image/*" className={cardDesc} onChange={e => imageHandler(e, 3)}/>
                  <br></br>
                  {wrongInputMsg && <p className="inline-warnings">{wrongInputMsg}</p>}
                </span>
                <div>
                    <button className='modal-btn' onClick={() => handleEdit()}>Save</button><br></br>
                    <button className='modal-btn' onClick={() => setShowEdit(false)}>Cancel</button>
                </div>
                </dialog>
              </div>
            </Modal>
        ):null
        }
        {
          showDelete ? (
          <Modal id='root'>
          <div className="deletion-dialog">
            <dialog open className={profileDialog}>
            <span>
              <h1 className={termsTitle}>Confirm delete</h1>
              <br/><br/>
            </span>
            <div>
                <button className='modal-btn' onClick={() => {setShowDelete(false);handleDeleteTournament(props.id)}}>Delete</button><br></br>
                <button className='modal-btn' onClick={() => setShowDelete(false)}>Cancel</button>
            </div>
            </dialog>
          </div>
        </Modal>
          ):null
        }
        <h2 className={termsTitle}>BASIC INFO</h2>
        <div className='container-list-links'>
        <p className={tournamentBasic}><b>Host country:&nbsp;</b><p>{getCountryWithFlag(current?.host)}</p></p>
        <p className={tournamentBasic}><b>Start date:&nbsp;</b><p>{formatDateEU(current?.startDate)}</p></p>
        <p className={tournamentBasic}><b>End date:&nbsp;</b><p>{formatDateEU(current?.endDate)}</p></p>
        <p className={tournamentBasic}><b>Status:&nbsp;</b><p>{current?.status}</p></p>
        <p className={tournamentBasic}><b>Qualifications:&nbsp;</b><p>{current?.qualifications ? "Yes" : "No"}</p></p>
        <p className={tournamentBasic}><b>Friendly game:&nbsp;</b><p>{current?.friendly ? "Yes" : "No"}</p></p>
        <p className={tournamentBasic}><b>Winner team:&nbsp;</b><p>{winner?.name ?? "???"}</p></p>
        <p className={tournamentBasic}><b>Second place:&nbsp;</b><p>{second?.name ?? "???"}</p></p>
        <p className={tournamentBasic}><b>Third place:&nbsp;</b><p>{third.name?.thirdplace ?? "???"}</p></p>
        <p className={tournamentBasic}><b>Best player:&nbsp;</b><p>{fourth?.name !== '' ? current?.bestplayername : "???"}</p></p>
        <p className={tournamentBasic}><b>Best goalkeeper:&nbsp;</b><p>{current?.bestgkname  !== '' ? current?.bestgkname : "???"}</p></p>
        <p className={tournamentBasic}><b>Matches:&nbsp;</b><p onClick={() => navigate(`/tournaments/${props.id}/matches`)} className={playerNameLink}>Show matches</p></p>
         </div>
        <hr/>
        
        <h2 className={termsTitle}>STATS AND DESCRIPTIONS</h2>
        <div className='container'>
            <ContentCard
              className='card-tournament'
              image={current?.mascot} 
              topic='MASCOTT' 
              title={current?.mascotname}
              description={current?.mascotdesc}
              color={1}>
            </ContentCard>
            <ContentCard
              className='card-tournament' 
              image={current?.openingphoto} 
              topic='HOSTING' 
              title='Cup opening'
              description={current?.openingdesc}
              color={1}>
            </ContentCard>
            <div className={profileCard2}>
                    <img src={globe} height="60" width="63"></img>
                    <div className="profile-labels"></div>
                    <p className='profile-label-text'><b>Venues/cities:&nbsp;</b>{current?.cities ?? "???"}</p>
                    <p className='profile-label-text'><b>Matches played:&nbsp;</b>{current?.matchesplayed}</p>
                    <p className='profile-label-text'><b>Goals scored:&nbsp;</b>{current?.goals}</p>
                    <p className='profile-label-text'><b>Attendance:&nbsp;</b>{current?.attendance}</p>
                    <p className='profile-label-text'><b>Total days:&nbsp;</b>{current?.totaldays}</p>
                    <p className='profile-label-text'><b>Teams competing:&nbsp;</b>{current?.totalteams}</p>
                    <p className='profile-label-text'><b>Estimated organisation cost:&nbsp;</b>{current?.organisationcost} $</p>
                </div>
         </div>
       </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, { checkAuthenticated, loadUser })(TournamentDetails);
