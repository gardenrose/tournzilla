import "./css/Homepage.css";
import "./css/Tournaments.css";
import "./css/Formation.css";
import "./css/Formation451.css";
import "./css/Formation442.css";
import StatsCard from "./StatsCard";
import {
  blankspace,
  mainTitle,
  rankHeading,
  opponentName,
  termsTitle,
  opponentLabel,
  scoreInput,
  playerNameLink,
  scoreChange,
  getCountryWithFlag,
  tournamentBasic,
  formatDateEU,
  profileDialog,
  modalInput,
  modalLabels,
  FIRST_HALF,
  SECOND_HALF,
  SECOND_EXTENSION,
  THIRD_EXTENSION,
  PENALTIES
} from "./Constants";
import React, { useState, useEffect } from "react";
import Formation from "./Formation";
import { connect } from 'react-redux';
import { loadUser, checkAuthenticated } from "./actions/auth";
import male from "./images/male.png";
import female from "./images/female.png";
import Modal from "./Modal";
import ErrorPage from "./ErrorPage";
import { endEarly, singleMatchDecider1, tournamentDecider } from "./Deciders";

const MatchDetails = (props) => {
  const [matchInfo, setMatchInfo] = useState({})
  const [time, setTime] = useState(0);
  const [showFormation1, setShowFormation1] = useState(false);
  const [showFormation2, setShowFormation2] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [team1, setTeam1] = useState({})
  const [team2, setTeam2] = useState({})
  const [title, setTitle] = useState('');
  const [hasErrors, setHasErrors] = useState(false)
  const [players1, setPlayers1] = useState([])
  const [players2, setPlayers2] = useState([])
  const [goals, setGoals] = useState([])
  const [redCards, setRedcards] = useState([])
  const [yellowCards, setYellowcards] = useState([])
  const [substitutions, setSubstitutions] = useState([])
  const [saves, setSaves] = useState([])
  const [modalTitle, setModalTitle] = useState('Red card 🟥')
  const [goalscorer, setGoalscorer] = useState(null)
  const [penaltyScorer1, setPenaltyScorer1] = useState(null)
  const [penaltyScorer2, setPenaltyScorer2] = useState(null)
  const [buttonsDisabled, setButtonsDisabled] = useState(true)
  const [disableExtension, setDisableExtension] = useState(true)
  const [label, setLabel] = useState('')
  const [showExtendModal, setShowExtendModal] = useState(false)
  const [extension, setExtension] = useState([])
  const [showEndModal, setShowEndModal] = useState(false)
  const [friendly, setFriendly] = useState(false)
  const [showRefereeModal, setShowRefereeModal] = useState(false)
  const [showPenaltyModal, setShowPenaltyModal] = useState(false)
  const [reason, setReason] = useState('')
  const [scorerTeam, setScorerTeam] = useState(team1)
  const [penaltyValue1, setPenaltyValue1] = useState('goal')
  const [penaltyValue2, setPenaltyValue2] = useState('goal')
  const [existingPenalties, setExistingPenalties] = useState([])
  const [referee, setReferee] = useState({})
  const [updatedFormation1, setUpdatedFormation1] = useState([])
  const [updatedFormation2, setUpdatedFormation2] = useState([])
  const [tournament, setTournament] = useState({})
  const [selectedWinner, setSelectedWinner] = useState(null)

  function retireReferee() {
    if (matchInfo && matchInfo.referee) {
      fetch(`/api/referees/${matchInfo.referee?.replace(" ", "%20")}/`, {
        method: 'PUT',
          headers: { 
            'Authorization': `JWT ${localStorage.getItem('access')}`
          }
      })
    }
  }

  function getCurrentSituation() {
    fetch(`/api/tournaments/${props.id}/`)
    .then(resp => {
      if (resp.status === 500 || resp.status === 404) {
        setHasErrors(true)
      } else {
        return resp.json();
      }
    })
    .then((data) => {
      setTournament(data)
      setTitle(data.name)
      setFriendly(data.friendly)
    })
    fetch(`/api/penalties/${parseInt(props?.mid)}/`)
      .then(resp => resp.json())
      .then(pens => {
        setExistingPenalties(pens);
    });
    fetch(`/api/tournaments/${props.id}/matches/${props.mid}/`)
      .then((response) => {
        if (response.status === 500 || response.status === 404) {
          setHasErrors(true)
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setMatchInfo(data)
        setExtension(parseInt(data.extension))
        fetch(`/api/teams/${data.team1}/`)
        .then(rsp1 => rsp1.json())
        .then(tm1 => {
          setTeam1(tm1)
          setSelectedWinner(tm1.id)
          fetch(`/api/teams/${data.team2}/`)
          .then(rsp2 => rsp2.json())
          .then(tm2 => {
            setTeam2(tm2)
            fetch('/api/players/')
            .then(playerresp => playerresp.json())
            .then(playersdata => {
              setPlayers1(playersdata.filter(x1 => x1.currentteam === tm1.id))
              setPlayers2(playersdata.filter(x2 => x2.currentteam === tm2.id))
              fetch(`/api/formations/${props.mid}/`)
            .then(rspforms => rspforms.json())
            .then(footballFormations => {
              const formation1 = footballFormations[0]
              const jerseyNames1 = []
                for (let i = 1; i <= 11; i++) {
                  const jerseyKey = `jersey${i}`;
                  if (jerseyKey in formation1) {
                    jerseyNames1.push(formation1[jerseyKey].includes(" (preferred)") ? formation1[jerseyKey].replace(" (preferred)", "") : formation1[jerseyKey]);
                  }
                }
                setGoalscorer(jerseyNames1[0])

                const formation2 = footballFormations[1]
                const jerseyNames2 = []
                for (let i = 1; i <= 11; i++) {
                  const jerseyKey = `jersey${i}`;
                  if (jerseyKey in formation2) {
                    
                    jerseyNames2.push(formation2[jerseyKey].includes(" (preferred)") ? formation2[jerseyKey].replace(" (preferred)", "") : formation2[jerseyKey]);
                  }
                }
                fetch(`/api/redcards/${props.id}/`)
                .then(rsp4 => rsp4.json())
                .then(reds => {
                  fetch(`/api/substitutions/${props.mid}/`)
                  .then(rsp6 => rsp6.json())
                  .then(subs => {
                    let formation1Tmp = []
                    let formation2Tmp = []
                    setSubstitutions(subs)
                    //console.log(subs)
                    setRedcards(reds.filter(x => x.matchid === parseInt(props.mid)))
                    
                    formation1Tmp = jerseyNames1.filter((player) => !reds.some((red) => red.jerseyname === player.replace(/^\d+\s+/, '')));
                    formation2Tmp = jerseyNames2.filter((player) => !reds.some((red) => red.jerseyname === player.replace(/^\d+\s+/, '')));
                    //console.log(formation1Tmp)
                    subs.map(sub => {
                      const tmpPlayerIn = playersdata.find(plyr => plyr.jerseyname === sub.injerseyname)
                      const tmpPlayerOut = playersdata.find(plyr => plyr.jerseyname === sub.outjerseyname)
                      const formattedPlayerIn = tmpPlayerIn.jerseynumber + " " + tmpPlayerIn.jerseyname
                      const formattedPlayerOut = tmpPlayerOut.jerseynumber + " " + tmpPlayerOut.jerseyname
                      //console.log(formattedPlayerIn, formattedPlayerOut)
                      if (formation1Tmp.includes(formattedPlayerOut)) {
                        formation1Tmp = formation1Tmp.filter(el => el !== formattedPlayerOut)
                        formation1Tmp.push(formattedPlayerIn)
                      } else if (formation2Tmp.includes(formattedPlayerOut)) {
                        formation2Tmp = formation2Tmp.filter(el => el !== formattedPlayerOut)
                        formation2Tmp.push(formattedPlayerIn)
                      }
                    })
                    setUpdatedFormation1(formation1Tmp)
                    setUpdatedFormation2(formation2Tmp)
                    setGoalscorer(formation1Tmp[0])
                    setPenaltyScorer1(formation1Tmp[0])
                    setPenaltyScorer2(formation2Tmp[0])
                  })
                  
                })
              
            })
            })
            
           
            
          })
        })
      });
  }

  useEffect(() => {
    tournamentDecider(props.id)
    getCurrentSituation()
  },[])

  useEffect(() => {
    const interval = setInterval(getCurrentSituation, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTime(time + 1)
    const interval = setInterval(() => setTime(time + 1), 1000)
    setButtonsDisabled(true)
    if (tournament) {
      let lbl = singleMatchDecider1(tournament, matchInfo)
      setLabel(lbl)
      if (lbl === FIRST_HALF) {
        setLabel(`${minutes}:${seconds}`)
        setButtonsDisabled(false)
      } else if (lbl === SECOND_HALF) {
        setLabel(`${minutes-15}:${seconds}`)
        setButtonsDisabled(false)
      } else if (lbl === SECOND_EXTENSION) {
        setLabel(`${minutes-20-parseInt(matchInfo.extension)}:${seconds}`)
        setButtonsDisabled(false)
      } else if (lbl === THIRD_EXTENSION) {
        setLabel(`${minutes-25-parseInt(matchInfo.extension)}:${seconds}`)
        setButtonsDisabled(false)
      } else if (lbl === PENALTIES) {
        setShowPenaltyModal(true)
      }
    }
    return () => clearInterval(interval);
  }, [time])

  useEffect(() => {
    if (matchInfo && matchInfo.referee) {
      fetch(`/api/referees/${matchInfo.referee?.replace(" ", "%20")}/`)
      .then(res => res.json())
      .then(ref => setReferee(ref))
    }
    fetch(`/api/goals/${props.mid}/`)
    .then(rsp3 => rsp3.json())
    .then(gls => {
      setGoals(gls)
    })
    
    fetch(`/api/yellowcards/${props.mid}/`)
    .then(rsp5 => rsp5.json())
    .then(yells => {
      setYellowcards(yells)
    })
  }, [matchInfo])

  const elapsedTime = new Date().getTime() - new Date(matchInfo?.matchdate + "T" + matchInfo?.starttime).getTime();
  const minutes = Math.floor(elapsedTime / (1000 * 60)).toString().padStart(2, '0');
  const seconds = Math.floor((elapsedTime / 1000) % 60).toString().padStart(2, '0');

  function addGoal() {
    const fd1 = new FormData()
    //console.log(goalscorer)
    fetch(`/api/players/`)
    .then(rsp => rsp.json())
    .then(players => {
      const playerJerseyname = updatedFormation1.concat(updatedFormation2).find(x => x === goalscorer);
      const player = players.find(x => x.jerseyname === playerJerseyname.replace(/^\d+\s+/, ''))
      let jerseyUpdate = player.jerseyname
      if (updatedFormation1.includes(playerJerseyname) && scorerTeam.id === matchInfo.team2 
        || updatedFormation2.includes(playerJerseyname) && scorerTeam.id === matchInfo.team1) {
          jerseyUpdate = player?.jerseyname + " (O.G.)"
        }
      fd1.append('scoredby', player?.id ?? null)
      fd1.append('jerseyname', jerseyUpdate)
      fd1.append('minute', parseInt(minutes)+1)
      fd1.append('matchid', props.mid)
      fd1.append('team', scorerTeam.id)
      setShowGoalModal(false)
      fetch(`/api/goals/${matchInfo?.matchid}/`, {
        method: 'POST',
        headers: { 
          'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        body: fd1
      })
    })
    
  }

  function resolvePenalties() {
    fetch(`/api/penalties/${parseInt(props?.mid)}/`)
    .then(res => res.json())
    .then(data => {
      if (data.length >= 10) {
        const pens1 = data.filter(x => x.team === team1.id).filter(x => x.hit)
        const pens2 = data.filter(x => x.team === team2.id).filter(x => x.hit)
        const fd2 = new FormData()
        const fd3 = new FormData()
        if (pens1.length > pens2.length) {
          fd2.append('winner', team1.id)
          fd2.append('status', 'Finished')
          fetch(`/api/tournaments/${props.id}/matches/${props.mid}/`, {
            method: 'PUT',
            headers: { 
              'Authorization': `JWT ${localStorage.getItem('access')}`
            },
            body: fd2
          });
          if (!matchInfo.nextmatchid && !matchInfo.groupid) {
            const fdd = new FormData()
            fdd.append('winner', team1.id)
            fdd.append('secondplace', team2.id)
            fdd.append('status', 'Finished')
            fetch(`/api/tournaments/${props.id}/`, {
              method: 'PUT',
              headers: { 
                'Authorization': `JWT ${localStorage.getItem('access')}`
              },
              body: fdd
            });
          } else {
            fetch(`/api/tournaments/${props.id}/matches/${matchInfo.nextmatchid}/`)
            .then(rsp => rsp.json())
            .then(dataa => {
              if (dataa.team1 === 500 && dataa.team2 !== team1.id) {
                fd3.append('team1', team1.id)
              } else if (dataa.team2 === 500 && dataa.team1 !== team1.id) {
                fd3.append('team2', team1.id)
              }
              fetch(`/api/tournaments/${props.id}/matches/${matchInfo.nextmatchid}/`, {
                method: 'put',
                headers: { 
                  'Authorization': `JWT ${localStorage.getItem('access')}`
                },
                body: fd3
              });
            })
          }
          
        } else if (pens2.length > pens1.length) {
          fd2.append('winner', team2.id)
          fd2.append('secondplace', team1.id)
          fd2.append('status', 'Finished')
          fetch(`/api/tournaments/${props.id}/matches/${props.mid}/`, {
            method: 'PUT',
            headers: { 
              'Authorization': `JWT ${localStorage.getItem('access')}`
            },
            body: fd2
          });
          if (!matchInfo.nextmatchid && !matchInfo.groupid) {
            const fdd = new FormData()
            fdd.append('winner', team2.id)
            fdd.append('status', 'Finished')
            fetch(`/api/tournaments/${props.id}/`, {
              method: 'PUT',
              headers: { 
                'Authorization': `JWT ${localStorage.getItem('access')}`
              },
              body: fdd
            });
          } else {
            fetch(`/api/tournaments/${props.id}/matches/${matchInfo.nextmatchid}/`)
            .then(rsp => rsp.json())
            .then(dataa => {
              if (dataa.team1 === 500 && dataa.team2 !== team2.id) {
                fd3.append('team1', team2.id)
              } else if (dataa.team2 === 500 && dataa.team1 !== team2.id) {
                fd3.append('team2', team2.id)
              }
              fetch(`/api/tournaments/${props.id}/matches/${matchInfo.nextmatchid}/`, {
                method: 'put',
                headers: { 
                  'Authorization': `JWT ${localStorage.getItem('access')}`
                },
                body: fd3
              });
            })
          }
          
        }
      }
    })
  }

  function addPenalty() {
    const fd1 = new FormData();
    const fd2 = new FormData();
    const player1 = players1.find(x => x.jerseyname === penaltyScorer1.replace(/^\d+\s+/, ''));
    const player2 = players2.find(x => x.jerseyname === penaltyScorer2.replace(/^\d+\s+/, ''));
    if (player1 && player2) {
      fd1.append('playerid', player1.id);
      fd1.append('playername', player1.jerseyname);
      fd1.append('matchid', parseInt(props.mid));
      fd1.append('team', player1.currentteam);
      fd1.append('hit', penaltyValue1 === 'goal' ? 1 : 0);
      fd2.append('playerid', player2.id);
      fd2.append('playername', player2.jerseyname);
      fd2.append('matchid', parseInt(props.mid));
      fd2.append('team', player2.currentteam);
      fd2.append('hit', penaltyValue2 === 'goal' ? 1 : 0);
      fetch(`/api/penalties/${parseInt(props?.mid)}/`, {
        method: 'POST',
        headers: { 
          'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        body: fd1
      });
      fetch(`/api/penalties/${parseInt(props?.mid)}/`, {
        method: 'POST',
        headers: { 
          'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        body: fd2
      });
      resolvePenalties()
      setShowPenaltyModal(false);
    }
  }
  

  function nullifyGoal(goalid) {
    fetch(`/api/goals/${props.mid}/${goalid}/`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `JWT ${localStorage.getItem('access')}`
      }
    }).then(_ => getCurrentSituation())
  }

  function extendMatch(ext) {
    const fd = new FormData()
    fd.append('extension', ext)
    fetch(`/api/tournaments/${props.id}/matches/${props.mid}/`, {
      method: 'PUT',
      headers: { 
        'Authorization': `JWT ${localStorage.getItem('access')}`
      },
      body: fd
    })
    setShowExtendModal(false)
  }

  return hasErrors ? <ErrorPage/> : (
    <div className={blankspace}>
      <div>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <h1 align="center" className={mainTitle}>{title}</h1>
        {
          showGoalModal ?  (
            <Modal id='root'>
              <div className="deletion-dialog">
                <dialog open className={profileDialog}>
                <span>
                  <h1 className={termsTitle}>{modalTitle}</h1>
                  <label className={modalLabels}>Scored by:</label>
                  <select className={modalInput} defaultValue={updatedFormation1[0]} onChange={(e)=>setGoalscorer(e.target.value)}>
                    {updatedFormation1.concat(updatedFormation2).map(plyr => {
                      return <option>{plyr}</option>
                    })}
                  </select><br/><br/>
                </span>
                <div>
                    <button className='modal-btn' onClick={() => addGoal()}>Save</button><br></br>
                    <button className='modal-btn' onClick={() => setShowGoalModal(false)}>Cancel</button>
                </div>
                </dialog>
              </div>
          </Modal>
        ):null
        }
        {
          showRefereeModal ?  (
            <Modal id='root'>
              <div className="deletion-dialog">
                <dialog open className={profileDialog}>
                <span>
                  <h1 className={termsTitle}>Referee</h1>
                  <label className={modalLabels}>{matchInfo.referee}</label>
                  <br/>
                  <label className={modalLabels}>{`This referee is ${referee.retired ? '' : 'not'} retired`}</label>
                </span><br/>
                <div>
                  {!referee.retired && <button className='modal-btn' onClick={() => retireReferee()}>Retire</button>}
                  <button className='modal-btn' onClick={() => setShowRefereeModal(false)}>Close</button>
                </div>
                </dialog>
              </div>
          </Modal>
        ):null
        }
        {
          showPenaltyModal ?  (
            <Modal id='root'>
              <div className="deletion-dialog">
                <dialog open className={profileDialog}>
                <span>
                  <h1 className={termsTitle}>Penalties 🥅⚽️</h1>
                  <div className="flex-form"><label className={modalLabels}>Scored by:</label>
                  <select className={modalInput} defaultValue={penaltyScorer1} onChange={(e)=>setPenaltyScorer1(e.target.value)}>
                    {updatedFormation1.map(plyr => {
                      return <option>{plyr}</option>
                    })}
                  </select>
                  <select className={modalInput} onChange={e => setPenaltyValue1(e.target.value)}>
                    <option selected>goal</option>
                    <option>miss</option>
                  </select>
                  <img width='40' height= '40' src={"../../"+team1.logo}></img><br/></div>
                  <div className="flex-form"><label className={modalLabels}>Scored by:</label>
                  <select className={modalInput} defaultValue={penaltyScorer2} onChange={(e)=>setPenaltyScorer2(e.target.value)}>
                    {updatedFormation2.map(plyr => {
                      return <option>{plyr}</option>
                    })}
                  </select>
                  <select className={modalInput} onChange={e => setPenaltyValue2(e.target.value)}>
                    <option selected>goal</option>
                    <option>miss</option>
                  </select>
                  <img width='40' height= '40' src={"../../"+team2.logo}></img><br/></div>
                </span>
                <div>
                    <button className='modal-btn' onClick={() => addPenalty()}>Save</button><br></br>
                </div>
                </dialog>
              </div>
          </Modal>
        ):null
        }
        {
          showExtendModal ?  (
            <Modal id='root'>
              <div className="deletion-dialog">
                <dialog open className={profileDialog}>
                <span>
                  <h1 className={termsTitle}>Extend match time</h1>
                  <label className={modalLabels}>Minutes:</label>
                  <input type="number" className={modalInput} min={0} max={20} defaultValue={3} onChange={e => setExtension(e.target.value)}/>
                </span>
                <div>
                    <button className='modal-btn' onClick={() => extendMatch(extension)}>Save</button><br></br>
                    <button className='modal-btn' onClick={() => setShowExtendModal(false)}>Cancel</button>
                </div>
                </dialog>
              </div>
          </Modal>
        ):null
        }
        {
          showEndModal ?  (
            <Modal id='root'>
              <div className="deletion-dialog">
                <dialog open className={profileDialog}>
                <span>
                  <h1 className={termsTitle}>End match earlier&nbsp;</h1>
                  <label className={modalLabels}>Reason:</label>
                  <input type="text" className={modalInput} onChange={e => setReason(e.target.value)}/>
                  <label className={modalLabels} defaultValue={selectedWinner}>Winner:</label>
                  <select className={modalInput} onChange={(e) => setSelectedWinner(e.target.value)}>
                    <option value={team1.id}>{team1.name}</option>
                    <option value={team2.id}>{team2.name}</option>
                  </select>
                </span>
                <div>
                    <button className='modal-btn' onClick={() => {endEarly(tournament, matchInfo, matchInfo.reason, selectedWinner);setShowEndModal(false)}}>Save</button><br></br>
                    <button className='modal-btn' onClick={() => setShowEndModal(false)}>Cancel</button>
                </div>
                </dialog>
              </div>
          </Modal>
        ):null
        }
        {showFormation1  
          ? <Formation isLeftSide={true} onClose={() => setShowFormation1(false)} matchid={parseInt(props.mid)} teamid={team1.id} players={players1} matchdatetime={matchInfo.matchdate + "T" + matchInfo.starttime}/> : null}
        <span className="match-additional">
          &nbsp;&nbsp;&nbsp;{matchInfo?.endedearlier ? <p className={tournamentBasic}>Ended earlier. {matchInfo.endearlyreason}</p> : buttonsDisabled ? null : <button className="card-button-goto" onClick={() => setShowEndModal(true)}>End now</button>}
          &nbsp;&nbsp;&nbsp;{!disableExtension && <button onClick={() => setShowExtendModal(true)} className="card-button-goto">Extend time</button>}
          &nbsp;&nbsp;&nbsp;{team1.id !== 500 && team2 !== 500 && props?.user?.is_staff && referee && <button onClick={() => setShowRefereeModal(true)} className="card-button-goto">Referee info</button>}
          <p className={tournamentBasic}>
          &nbsp;&nbsp;<b>Referee:</b>&nbsp;
          {getCountryWithFlag(referee.country)?.split(" ")[0]} {referee.name}</p>
          <img className="small-image" src={referee.gender === 'male' ? male : referee.gender === 'female' ? female : null}></img>
        </span>
        <div className="formations"></div>
        <div className="details-wrapper">
          <div className="header-match-wrapper">
            <p className={playerNameLink} onClick={() => {setShowFormation1(true)}}><u>Formation</u></p>
            <h2 className={rankHeading}>{label}<p className="inline-warnings">{extension ? ` +${extension}` : ''}</p></h2>
            <p className={playerNameLink}  onClick={() => {setShowFormation2(true)}}><u>Formation</u></p>
          </div>
          {showFormation2  
          ? <Formation onClose={() => setShowFormation2(false)} matchid={parseInt(props.mid)} teamid={team2.id} players={players2} matchdatetime={matchInfo.matchdate + "T" + matchInfo.starttime}/> : null}
          <div className="match-container">
            <img src={"../../"+team1.logo} className="match-detail-img"></img>
            <button className={opponentName}>
              <h2 className={`${termsTitle} ${opponentLabel}`}>{team1.name + (matchInfo?.winner === team1.id ? " 🏆" : "")}</h2>
            </button>
            {!buttonsDisabled && <button className={`${scoreChange} pointer-button score-change-button`}
              onClick={() => {setModalTitle('Goal ⚽');setScorerTeam(team1);setShowGoalModal(true);}}>+</button>}
            <input type="text" disabled className={scoreInput} defaultValue={matchInfo.score1}></input>
            <input
              disabled
              type="text"
              className={scoreInput}
              defaultValue={matchInfo.score2}
            />
            {!buttonsDisabled && <button className={`${scoreChange} pointer-button score-change-button`} 
            onClick={() => {setModalTitle('Goal ⚽');setScorerTeam(team2);setShowGoalModal(true);}}>+</button>}
            <button className={opponentName}>
              <h2 className={`${termsTitle} ${opponentLabel}`}>{team2.name + (matchInfo?.winner === team2.id ? " 🏆" : "")}</h2>
            </button>
            <img src={"../../"+team2.logo} className="match-detail-img"></img>
          </div>
        </div>
        <div className="scorer-container">
          <div className="scorer-group">
            {goals.filter(gl => gl.team === team1.id).map(goal => {
              return <label className={rankHeading}>⚽ {goal.jerseyname} '{goal.minute}
              &nbsp;
              {props?.user?.is_staff ? <button className={scoreChange} id="plus2nd" onClick={() => nullifyGoal(goal.id)}>X</button> : null}
              </label>
            })}
          </div>
          <div className="scorer-group">
            {goals.filter(gl => gl.team === team2.id).map(goal => {
              return <label className={rankHeading}>⚽ {goal.jerseyname} '{goal.minute}
              &nbsp;
              {props?.user?.is_staff  ? <button className={scoreChange} id="plus2nd" onClick={() => nullifyGoal(goal.id)}>X</button> : null}
              </label>
            })}
          </div>
        </div>
        <StatsCard title="Ball possession" championshipid={props.id} matchid={props.mid} isAdminLogged={props?.user?.is_staff } isPercentage initial1st={matchInfo.possession} initial2nd={100-matchInfo.possession} disable={buttonsDisabled}></StatsCard>
        <StatsCard title="Attempted shots on target" championshipid={props.id} matchid={props.mid} isAdminLogged={props?.user?.is_staff } initial1st={matchInfo.targets1} initial2nd={matchInfo.targets2} disable={buttonsDisabled}></StatsCard>
        <StatsCard title="Corners" championshipid={props.id} matchid={props.mid} isAdminLogged={props?.user?.is_staff } initial1st={matchInfo.corners1} initial2nd={matchInfo.corners2} disable={buttonsDisabled}></StatsCard>
        <StatsCard title="Fouls committed" championshipid={props.id} matchid={props.mid} isAdminLogged={props?.user?.is_staff } initial1st={matchInfo.fouls1} initial2nd={matchInfo.fouls2} disable={buttonsDisabled}></StatsCard>
        <StatsCard title="Offsides" championshipid={props.id} matchid={props.mid} isAdminLogged={props?.user?.is_staff } initial1st={matchInfo.offsides1} initial2nd={matchInfo.offsides2} disable={buttonsDisabled}></StatsCard>
        <StatsCard title="Yellow cards" championshipid={props.id} matchid={props.mid} opensModal modalTitle='Yellow card 🟨' isAdminLogged={props?.user?.is_staff } initial1st={0} initial2nd={0} disable={buttonsDisabled} players1={players1} players2={players2} minutes={label}></StatsCard>
          <div className="substitution-container">
            <div className="scorer-group">
            {yellowCards.filter(x => x.team === team1.id).map(r => {
                return <label className={rankHeading}>🟨 {r.jerseyname} '{r.minute}</label>
              })}
            </div>
            <div className="scorer-group">
            {yellowCards.filter(x => x.team === team2.id).map(r => {
                return <label className={rankHeading}>🟨 {r.jerseyname} '{r.minute}</label>
              })}
            </div>
          </div>
        <StatsCard title="Red cards" championshipid={props.id} matchid={props.mid} opensModal modalTitle='Red card 🟥' isAdminLogged={props?.user?.is_staff } minutes={label} initial1st={0} initial2nd={0} disable={buttonsDisabled}></StatsCard>
          <div className="substitution-container">
            <div className="scorer-group">
              {redCards.filter(x => x.team === team1.id).map(r => {
                return <label className={rankHeading}>🟥 {r.jerseyname} '{r.minute}</label>
              })}
            </div>
            <div className="scorer-group">
            {redCards.filter(x => x.team === team2.id).map(r => {
                return <label className={rankHeading}>🟥 {r.jerseyname} '{r.minute}</label>
            })}
            </div>
          </div>
        <StatsCard title="Substitutions" championshipid={props.id} matchid={props.mid} opensModal modalTitle='Substitution 🔴🟢' isAdminLogged={props?.user?.is_staff } initial1st={0} initial2nd={0} minutes={label} disable={buttonsDisabled}></StatsCard>
        <div className="substitution-container">
          <div className="scorer-group">
          {substitutions.filter(x => x.team === team1.id).map(r => {
                return <label className={rankHeading}>🔴 {r.outjerseyname} 🟢 {r.injerseyname} '{r.subminute}</label>
            })}
          </div>
          <div className="scorer-group">
          {substitutions.filter(x => x.team === team2.id).map(r => {
                return <label className={rankHeading}>🔴 {r.outjerseyname} 🟢 {r.injerseyname} '{r.subminute}</label>
            })}
          </div>
        </div>
        <StatsCard title="Saves" championshipid={props.id} matchid={props.mid} isAdminLogged={props?.user?.is_staff} initial1st={matchInfo.saves1} initial2nd={matchInfo.saves2} disable={buttonsDisabled}></StatsCard>
      </div>
      <hr/>
      {existingPenalties.length > 0 && <h2 className={termsTitle}>Penalties</h2>}
      {existingPenalties.length > 0 && <div className="flex-form-centerr">
        <div>
          {existingPenalties.filter(x => x.team === team1.id).map(pen => <div>
            <p className={modalLabels}>{(pen.hit ? "🟢" : "🔴") + " " + pen.playername }</p>
          </div>)}
        </div>
        <div>
          {existingPenalties.filter(x => x.team === team2.id).map(pen => <div>
            <p className={modalLabels}>{(pen.hit ? "🟢" : "🔴") + " " + pen.playername }</p>
          </div>)}
        </div>
      </div>}
      <br/>
    </div>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});

export default connect(mapStateToProps, {checkAuthenticated, loadUser})(MatchDetails);
