import { scoreChange, sideNumber, matchSideStatsCard, profileDialog, termsTitle, 
modalLabels, modalInput } from './Constants';
import './css/ContentCard.css';
import React, {useState, useEffect} from "react";
import './css/LightMode.css';
import Modal from "./Modal";
import { connect } from 'react-redux';
import { loadUser, checkAuthenticated } from "./actions/auth";

const StatsCard = ({title, isAdminLogged, isPercentage, initial1st, initial2nd, opensModal=false, modalTitle, matchid, championshipid, disable, players1, players2, minutes=null}) => {

    const [first, setFirst] = useState(initial1st);
    const [second, setSecond] = useState(initial2nd);
    const [showModal, setShowModal] = useState(false);
    const [firstPlayers, setFirstPlayers] = useState([]) 
    const [secondPlayers, setSecondPlayers] = useState([]) 
    const [modalLeftSide, setModalLeftSide] = useState(false)

    const [player, setPlayer] = useState(null)
    const [playerIn, setPlayerIn] = useState(null)

    useEffect(() => {
        setFirst(initial1st);
    }, [initial1st])

    useEffect(() => {
        setSecond(initial2nd);
    }, [initial2nd])

    useEffect(() => {
      setFirstPlayers(players1);
  }, [players1])

    useEffect(() => {
      setSecondPlayers(players2);
  }, [players2])

    function handleIncrement(isFirst) {
        if (isPercentage) {
            if (isFirst && first < 100) {
                setFirst(first+1);
                updateWithoutModal(title, first+1, true)
            }
            else if (!isFirst && second < 100) {
                setFirst(first-1);
                updateWithoutModal(title, first-1, false)
            }
        } else {
            if (isFirst) {
                setFirst(first+1);
                updateWithoutModal(title, first+1, true)
            }
            else {
                setSecond(second+1);
                updateWithoutModal(title, second+1, false)
            }
        }
    }

    function openModalWithTitle(isModalLeftSide) {
        setModalLeftSide(isModalLeftSide)
        setShowModal(true)
    }

    function updateWithoutModal(title, value, isLeftSide) {
        const fData = new FormData()
        if (title === "Ball possession") {
            fData.append('possession', value);
            fetch(`/api/tournaments/${championshipid}/matches/${matchid}/`, {
                method: 'PUT',
                headers: { 
                  'Authorization': `JWT ${localStorage.getItem('access')}`
                },
                body: fData
              })
        } else if (title === "Attempted shots on target") {
            if (isLeftSide) {
                fData.append('targets1', value);
              } else {
                fData.append('targets2', value);
              }
            fetch(`/api/tournaments/${championshipid}/matches/${matchid}/`, {
                method: 'PUT',
                headers: { 
                  'Authorization': `JWT ${localStorage.getItem('access')}`
                },
                body: fData
              })
        } else if (title === "Corners") {
            if (isLeftSide) {
                fData.append('corners1', value);
              } else {
                fData.append('corners2', value);
              }
            fetch(`/api/tournaments/${championshipid}/matches/${matchid}/`, {
                method: 'PUT',
                headers: { 
                  'Authorization': `JWT ${localStorage.getItem('access')}`
                },
                body: fData
              })
        } else if (title === "Fouls committed") {
            if (isLeftSide) {
                fData.append('fouls1', value);
              } else {
                fData.append('fouls2', value);
              }
            fetch(`/api/tournaments/${championshipid}/matches/${matchid}/`, {
                method: 'PUT',
                headers: { 
                  'Authorization': `JWT ${localStorage.getItem('access')}`
                },
                body: fData
              })
        } else if (title === "Offsides") {
            if (isLeftSide) {
                fData.append('offsides1', value);
              } else {
                fData.append('offsides2', value);
              }
            fetch(`/api/tournaments/${championshipid}/matches/${matchid}/`, {
                method: 'PUT',
                headers: { 
                  'Authorization': `JWT ${localStorage.getItem('access')}`
                },
                body: fData
              })
        } else if (title === "Saves") {
            if (isLeftSide) {
                fData.append('saves1', value);
              } else {
                fData.append('saves2', value);
              }
            fetch(`/api/tournaments/${championshipid}/matches/${matchid}/`, {
                method: 'PUT',
                headers: { 
                  'Authorization': `JWT ${localStorage.getItem('access')}`
                },
                body: fData
            })
        }
    }


  function addYellowCard() {
    const fd1 = new FormData()
    //const player = plyrs.find(x => x.jerseyname === yellowGetter)
    if (player && minutes?.includes(":")) {
      fetch(`/api/players/`)
      .then(res => res.json())
      .then(data => {
        let foundPlayer = data.find(pl => pl.jerseyname === player)
        console.log(foundPlayer)
        if (foundPlayer) {
          fd1.append('playerid', foundPlayer.id)
          fd1.append('jerseyname', foundPlayer.jerseyname)
          fd1.append('minute', parseInt(minutes.split(":")[0])+1)
          fd1.append('matchid', matchid)
          fd1.append('team', foundPlayer.currentteam)
          console.log([...fd1])
          fetch(`/api/yellowcards/${matchid}/`, {
            method: 'POST',
            headers: { 
              'Authorization': `JWT ${localStorage.getItem('access')}`
            },
            body: fd1
          }).then(_ => setShowModal(false))
        }
      })
      
    }
  }

  function addRedCard() {
    const fd1 = new FormData()
    if (player && minutes?.includes(":")) {
      fd1.append('playerid', player.id)
      fd1.append('jerseyname', player.jerseyname)
      fd1.append('minute', parseInt(minutes.split(":")[0])+1)
      fd1.append('matchid', matchid)
      fd1.append('team', player.currentteam)
      console.log([...fd1])
      fetch(`/api/yellowcards/${matchid}/`, {
        method: 'POST',
        headers: { 
          'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        body: fd1
      }).then(_ => setShowModal(false))
    }
  }

  function addSubstitution() {
    const fd1 = new FormData()
    const player = players1.concat(players2).find(x => x.jerseyname === goalscorer)
    if (player && minutes?.includes(":")) {
      fd1.append('playerout', player.id)
      fd1.append('jerseyname', player.jerseyname)
      fd1.append('subminute', parseInt(minutes.split(":")[0])+1)
      fd1.append('matchid', matchid)
      fd1.append('team', player.currentteam)
      console.log([...fd1])
      fetch(`/api/yellowcards/${matchid}/`, {
        method: 'POST',
        headers: { 
          'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        body: fd1
      }).then(_ => setShowModal(false))
    }
  }

  function decideWhatToDoModal() {
    if (modalTitle === 'Red card 🟥') {
      addRedCard()
    } else if (modalTitle === 'Substitution 🔴🟢') {
      addSubstitution()
    } else if ('Yellow card 🟨') {
      addYellowCard()
    }
  }

  return (
    <div className="match-side-stats">
        {
          showModal ?  (
            <Modal id='root'>
              <div className="deletion-dialog">
                <dialog open className={profileDialog}>
                <span>
                  <h1 className={termsTitle}>{modalTitle}&nbsp;</h1>
                  <label className={modalLabels}>{modalTitle === 'Substitution 🔴🟢' ? 'Player out' : 'Player'}</label>
                  {modalTitle === 'Substitution 🔴🟢' && <label className={modalLabels}>Player in</label>}
                  <select onChange={(e) => setPlayer(e.target.value)} className={modalInput}>
                    {(modalLeftSide ? firstPlayers : secondPlayers).map(pl => <option>{pl?.jerseyname}</option>)}
                  </select><br/><br/>
                </span>
                <div>
                    <button className='modal-btn' onClick={() => decideWhatToDoModal()}>Save</button><br></br>
                    <button className='modal-btn' onClick={() => setShowModal(false)}>Cancel</button>
                </div>
                </dialog>
              </div>
          </Modal>
        ):null
        }
        {isAdminLogged && !disable ? <button className={`${scoreChange} pointer-button`} id="plus1st" onClick={() => opensModal ? openModalWithTitle(true) : handleIncrement(true)}>+</button> : null}
        <label className={sideNumber}>{first}{isPercentage ? "%" : null}</label>
        <button className={matchSideStatsCard}>{title}</button>
        <label className={sideNumber}>{isPercentage ? 100 - first : second}{isPercentage ? "%" : null}</label>
        {isAdminLogged && !disable ? <button className={`${scoreChange} pointer-button`} id="plus2nd" onClick={() => {opensModal ? openModalWithTitle(false) : handleIncrement(false)}}>+</button> : null}
    </div>
  );
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
  });
  
  export default connect(mapStateToProps, {checkAuthenticated, loadUser})(StatsCard);
