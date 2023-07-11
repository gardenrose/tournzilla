import './css/Homepage.css';
import './css/ModalLight.css';
import './css/Tournaments.css';
import './css/Misc.css';
import { mainTitle, matchesSpace, blankspace, playerNameLink, 
  profileDialog, formatDateUS, isPotentionOf2, termsTitle, extraPart, occurencesInArray, alphabet, f4231 } from './Constants';
import {useEffect, useState} from "react";
import { navigate } from "@reach/router";
import { connect } from 'react-redux';
import { loadUser, checkAuthenticated } from "./actions/auth";
import Modal from './Modal';

const TournamentCreateAddTeams = (props) => { 

  const [selectedTeams, setSelectedTeams] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [wrongMsg, setWrongMsg] = useState(null);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [showCreatingMsg, setShowCreatingMsg] = useState(false)
  
  const searchParams = new URLSearchParams(props.location.search);
  const tournamentParam = searchParams.get("tournamentData");
  let tournamentData = null;

  if (tournamentParam) {
    try {
      tournamentData = JSON.parse(decodeURIComponent(tournamentParam));
    } catch (error) {
      console.error("Error parsing tournament parameter:", error);
    }
  }

  useEffect(() => {
    props.checkAuthenticated();
    props.loadUser();
    filterTeams();
  },[])

  function updateSelectedTeams(itemid) {
    setWrongMsg(null);
    setShowWarning(false);
    let count = document.querySelectorAll('input[type="checkbox"]:checked');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    if (count.length === parseInt(tournamentData?.participantSize)) {
      checkboxes.forEach((checkbox) => {
        checkbox.disabled = true;
      })
    }
    const checkbox = document.querySelector(`#participantcheck${itemid}`);
    if (checkbox.checked) {
      count += 1;
      setSelectedTeams([...selectedTeams, itemid].sort(() => Math.random() - 0.5))
    } else {
      setSelectedTeams(selectedTeams.filter(x => x !== itemid));
      count -= 1;
    }
  }

  function resetSelected() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.disabled = false;
      checkbox.checked = false;
    })
    setSelectedTeams([])
  }

  function processSave() {
    //console.log(selectedTeams.length)
    if (selectedTeams.length !== parseInt(tournamentData?.participantSize)) {
      setWrongMsg(`Incorrect number of participants selected. Please select ${tournamentData?.participantSize} teams.`)
      setShowWarning(true)
    } else {
      setShowCreatingMsg(true)
      const fd = new FormData()
      for ( const key in tournamentData ) {
        if (key === "qualifications" || key === "friendly") {
          fd.append(key, tournamentData[key] == 'Yes' ? 'True' : "False");
        }
        else if (key !== "wrongMsg" || key !== "showWarning") {
          fd.append(key, tournamentData[key])
        }
      }
      fd.append('totalteams', tournamentData.participantSize)
      fd.append('totaldays', Math.ceil((Math.abs(new Date(tournamentData.endDate).getTime() - new Date(tournamentData.startDate).getTime()))/ (1000 * 60 * 60 * 24))+1)
      fetch('/api/tournaments/', {
        method: 'POST',
        headers: { 
          'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        body: fd
      })
      .then(postResponse => postResponse.json())
      .then(_ => {
        setTimeout(() => {
          fetch('/api/tournaments/')
          .then(res => res.json())
          .then(allTournaments => {
            const t = allTournaments.reduce(
            (maxTournament, currentTournament) => {
              return currentTournament.championshipid > maxTournament.championshipid
                ? currentTournament
                : maxTournament
            })
            selectedTeams.forEach(tm => {
              const fData = new FormData()
              fData.append("teamid",tm)
              fData.append("tournamentid",t.championshipid)
              fetch(`/api/tournaments/${t.championshipid}/participants/`, {
              method: 'POST',
              headers: { 
                'Authorization': `JWT ${localStorage.getItem('access')}`
              },
              body: fData
            })
          })
            let restVar = 0
            if (tournamentData.resttime === '1 day') {
              restVar = 1
            } else if (tournamentData.resttime === '2 days') {
              restVar = 2
            } else if (tournamentData.resttime === '3 days') {
              restVar = 3
            }
            const startHour = Math.floor(Math.random() * 24)
              const start = new Date();
              start.setHours(startHour, 0, 0);
              const endTime = new Date(start.getTime() + 105 * 60000);
              const endHours = endTime.getHours();
              const endMinutes = endTime.getMinutes();
              const formattedEndTime = `${endHours}:${endMinutes.toString().padStart(2, '0')}:00`;

            if (selectedTeams.length === 2) {
              const fData2 = new FormData()
              
              fData2.append("team1",selectedTeams[0])
              fData2.append("team2",selectedTeams[1])
              
              fData2.append("matchdate", tournamentData.startDate)
              fData2.append("starttime", `${startHour}:00:00`)
              fData2.append("endtime", formattedEndTime)
              fetch(`/api/tournaments/${t.championshipid}/matches/`, {
              method: 'POST',
              headers: { 
                'Authorization': `JWT ${localStorage.getItem('access')}`
              },
              body: fData2
              })
            }
            else if (selectedTeams.length === 3) {
              const fData2 = new FormData()
              const fData3 = new FormData()
              const nextStartDate = new Date(tournamentData.startDate);
              nextStartDate.setDate(nextStartDate.getDate() + restVar + 1)
              fData2.append("team1", selectedTeams[0])
              fData2.append("team2", selectedTeams[1])
              fData3.append("team1", selectedTeams[2])
              fData3.append("team2", 500)
              fData3.append("matchdate", formatDateUS(nextStartDate))
              fData2.append("matchdate", tournamentData.startDate)
              fData2.append("starttime", `${startHour}:00:00`)
              fData2.append("endtime", formattedEndTime)
              fData3.append("starttime", `${startHour}:00:00`)
              fData3.append("endtime", formattedEndTime)
              
              fetch(`/api/tournaments/${t.championshipid}/matches/`, {
                method: 'POST',
                headers: { 
                  'Authorization': `JWT ${localStorage.getItem('access')}`
                },
                body: fData2
                }).then(response => response.json())
                .then(dt => {
                  const editFormData = new FormData()
                  const matchId = dt.matchid;
                  editFormData.append('nextmatchid', matchId + 1)
                  
                  fetch(`/api/tournaments/${t.championshipid}/matches/${matchId}/`, {
                    method: 'PUT',
                    headers: { 
                      'Authorization': `JWT ${localStorage.getItem('access')}`
                    },
                    body: editFormData
                  })
                  fetch(`/api/tournaments/${t.championshipid}/matches/`, {
                    method: 'POST',
                    headers: { 
                      'Authorization': `JWT ${localStorage.getItem('access')}`
                    },
                    body: fData3
                  })
                })
            } else if (parseInt(tournamentData?.participantSize) % 4 === 0 && tournamentData?.qualifications === 'Yes') {
              let letterCount = 0
              for (let i = 0; i < selectedTeams.length; i += 4) {
                const letter = alphabet[letterCount]
                const grp = selectedTeams.slice(i, i + 4);
                const groupFD = new FormData();
                groupFD.append('championshipid', t.championshipid)
                groupFD.append('letter', letter)
                groupFD.append('team1', grp[0])
                groupFD.append('team2', grp[1])
                groupFD.append('team3', grp[2])
                groupFD.append('team4', grp[3])
                groupFD.append('winner', 'None')
                groupFD.append('second', 'None')
                fetch(`/api/groups/${t.championshipid}/`, {
                  method: 'POST',
                  headers: { 
                    'Authorization': `JWT ${localStorage.getItem('access')}`
                  },
                  body: groupFD
                })
                letterCount += 1
              }
              setTimeout(() => {
                fetch(`/api/groups/${t.championshipid}/`)
                .then(grprsp => grprsp.json())
                .then(groupsdata => groupsdata.map(g => {
                  const fd12 = new FormData()
                  fd12.append('team1', g.team1)
                  fd12.append('team2', g.team2)
                  fd12.append('groupid', g.id)
                  fd12.append('drawpossible', 1)
                  fd12.append('matchdate', tournamentData?.startDate)
                  fd12.append('starttime',  `${startHour}:00:00`)
                  fd12.append('endtime',  formattedEndTime)
                  fetch(`/api/tournaments/${t.championshipid}/matches/`, {
                    method: 'POST',
                    headers: { 
                      'Authorization': `JWT ${localStorage.getItem('access')}`
                    },
                    body: fd12
                  })

                  const fd34 = new FormData()
                  fd34.append('team1', g.team3)
                  fd34.append('team2', g.team4)
                  fd34.append('groupid', g.id)
                  fd34.append('drawpossible', 1)
                  fd34.append('matchdate', tournamentData?.startDate)
                  fd34.append('starttime',  `${startHour}:00:00`)
                  fd34.append('endtime',  formattedEndTime)
                  fetch(`/api/tournaments/${t.championshipid}/matches/`, {
                    method: 'POST',
                    headers: { 
                      'Authorization': `JWT ${localStorage.getItem('access')}`
                    },
                    body: fd34
                  })

                  const fd13 = new FormData()
                  const cycle2Date = new Date(tournamentData?.startDate)
                  cycle2Date.setDate(cycle2Date.getDate() + restVar + 1)
                  fd13.append('team1', g.team1)
                  fd13.append('team2', g.team3)
                  fd13.append('groupid', g.id)
                  fd13.append('drawpossible', 1)
                  fd13.append('matchdate', formatDateUS(cycle2Date))
                  fd13.append('starttime',  `${startHour}:00:00`)
                  fd13.append('endtime',  formattedEndTime)
                  fetch(`/api/tournaments/${t.championshipid}/matches/`, {
                    method: 'POST',
                    headers: { 
                      'Authorization': `JWT ${localStorage.getItem('access')}`
                    },
                    body: fd13
                  })

                  const fd24 = new FormData()
                  fd24.append('team1', g.team2)
                  fd24.append('team2', g.team4)
                  fd24.append('groupid', g.id)
                  fd24.append('drawpossible', 1)
                  fd24.append('matchdate', formatDateUS(cycle2Date))
                  fd24.append('starttime',  `${startHour}:00:00`)
                  fd24.append('endtime',  formattedEndTime)
                  fetch(`/api/tournaments/${t.championshipid}/matches/`, {
                    method: 'POST',
                    headers: { 
                      'Authorization': `JWT ${localStorage.getItem('access')}`
                    },
                    body: fd24
                  })

                  const fd14 = new FormData()
                  const cycle3Date = new Date(tournamentData?.startDate)
                  cycle3Date.setDate(cycle3Date.getDate() + restVar + restVar + 2)
                  fd14.append('team1', g.team1)
                  fd14.append('team2', g.team4)
                  fd14.append('groupid', g.id)
                  fd14.append('drawpossible', 1)
                  fd14.append('matchdate', formatDateUS(cycle3Date))
                  fd14.append('starttime',  `${startHour}:00:00`)
                  fd14.append('endtime',  formattedEndTime)
                  fetch(`/api/tournaments/${t.championshipid}/matches/`, {
                    method: 'POST',
                    headers: { 
                      'Authorization': `JWT ${localStorage.getItem('access')}`
                    },
                    body: fd14
                  })

                  const fd23 = new FormData()
                  fd23.append('team1', g.team2)
                  fd23.append('team2', g.team3)
                  fd23.append('groupid', g.id)
                  fd23.append('drawpossible', 1)
                  fd23.append('matchdate', formatDateUS(cycle3Date))
                  fd23.append('starttime',  `${startHour}:00:00`)
                  fd23.append('endtime',  formattedEndTime)
                  fetch(`/api/tournaments/${t.championshipid}/matches/`, {
                    method: 'POST',
                    headers: { 
                      'Authorization': `JWT ${localStorage.getItem('access')}`
                    },
                    body: fd23
                  })
                }))
              }, 2000);

              /*setTimeout(() => {
                fetch(`/api/teams/`)
                .then(rp => rp.json())
                .then(dt => {
                  const tm = dt[0]
                  const frm = f4231
                  console.log(tm)
                  console.log(frm.pos1)
                })
              }, 2000);*/

            } if (tournamentData.qualifications === 'Yes' && parseInt(tournamentData.participantSize) === 4) {
              const fData2 = new FormData()
              
              fData2.append("team1",500)
              fData2.append("team2",500)
              const finalsAfterGroupDate = new Date(tournamentData.startDate)
              finalsAfterGroupDate.setDate(finalsAfterGroupDate.getDate() + 3*restVar + 3)
              
              fData2.append("matchdate", formatDateUS(finalsAfterGroupDate))
              fData2.append("starttime", `${startHour}:00:00`)
              fData2.append("endtime", formattedEndTime)
              fetch(`/api/tournaments/${t.championshipid}/matches/`, {
              method: 'POST',
              headers: { 
                'Authorization': `JWT ${localStorage.getItem('access')}`
              },
              body: fData2
              })
            } 
            else if (!isPotentionOf2 (parseInt(tournamentData?.participantSize)) && parseInt(tournamentData?.participantSize) > 3) {
              const eliminationSize = tournamentData?.qualifications === 'Yes' ? parseInt(tournamentData.participantSize)/2 : parseInt(tournamentData.participantSize)
              const irregularPart = extraPart(eliminationSize)
              const regularPart = eliminationSize - irregularPart
              const alternateStartDate = new Date(tournamentData.startDate)
              alternateStartDate.setDate(alternateStartDate.getDate() + 3 * restVar + 3)
              const fd4 = new FormData()
              let matchIDs = []
              let teamIndex = 0
              fd4.append("matchdate", tournamentData?.qualifications === 'Yes' ? formatDateUS(alternateStartDate) : tournamentData.startDate)
              fd4.append("starttime", `${startHour}:00:00`)
              fd4.append("endtime", formattedEndTime)
              for (let i = 1; i <= eliminationSize; i += 1) {
                fd4.append("team1", 500)
                fd4.append("team2", 500)
                fetch(`/api/tournaments/${t.championshipid}/matches/`, {
                  method: 'POST',
                  headers: { 
                    'Authorization': `JWT ${localStorage.getItem('access')}`
                  },
                  body: fd4
                })
              }

              setTimeout(() => {
                let nextMatchIdCount = irregularPart
                let matchCounter = 1
                let loopStepCount = 1
                let dateOfMatch = new Date(tournamentData?.qualifications === 'Yes' ? alternateStartDate : tournamentData?.startDate)
                let dateSetterCount = 1
                let dateSetterLimit = regularPart / 2

                fetch(`/api/tournaments/${t.championshipid}/matches/`)
                .then(response => response.json())
                .then(dt => {
                  const sortedMatchesById = dt.filter(mtch => mtch.groupid < 1).sort((x,y) =>  x.matchid - y.matchid)
                  for (const match of sortedMatchesById) {
                    if (loopStepCount === 3) {
                      loopStepCount = 1
                    }
                    if (loopStepCount === 2) {  
                      nextMatchIdCount -= 1
                    }
                    if (matchCounter === irregularPart + 1) {
                      loopStepCount = 1
                      nextMatchIdCount = regularPart / 2
                      dateOfMatch.setDate(dateOfMatch.getDate() + restVar + 1)
                    }
                    const fd5 = new FormData()
                    const nextt = match.matchid + nextMatchIdCount
                    fd5.append('nextmatchid', matchCounter === eliminationSize ? 0 : nextt)
                    fd5.append('matchdate',  matchCounter === eliminationSize ? tournamentData?.endDate : formatDateUS(dateOfMatch))
                    if (matchCounter < eliminationSize-1) {
                      matchIDs.push(match.matchid + nextMatchIdCount)
                    }
                    fetch(`/api/tournaments/${t.championshipid}/matches/${match.matchid}/`, {
                      method: 'PUT',
                      headers: { 
                        'Authorization': `JWT ${localStorage.getItem('access')}`
                      },
                      body: fd5
                    })

                    if (matchCounter > irregularPart) {
                      dateSetterCount += 1
                    }
                    if (matchCounter > irregularPart && dateSetterCount > dateSetterLimit) {
                      dateSetterCount = 1
                      dateSetterLimit = dateSetterLimit / 2 
                      dateOfMatch.setDate(dateOfMatch.getDate() + restVar + 1);
                    }

                    matchCounter += 1
                    loopStepCount += 1
                  }
                })
              }, 4000);

              setTimeout(() => {
                fetch(`/api/tournaments/${t.championshipid}/matches/`)
                .then(response1 => response1.json())
                .then(dt1 => {
                  dt1.filter(m => m.groupid < 1).sort((x,y) =>  x.matchid - y.matchid).map(x => {
                    const teamsFD = new FormData()
                    if (tournamentData?.qualifications === 'Yes') {
                      teamsFD.append('team1', 500)
                      teamsFD.append('team2', 500)
                    } else {
                      if (occurencesInArray(x.matchid, matchIDs) === 0) {
                        teamsFD.append('team1', selectedTeams[teamIndex])
                        teamsFD.append('team2', selectedTeams[teamIndex + 1])
                        teamIndex += 2
                      } else if (occurencesInArray(x.matchid, matchIDs) === 1) {
                        teamsFD.append('team1', selectedTeams[teamIndex])
                        teamsFD.append('team2', 500)
                        teamIndex += 1
                      } else {
                        teamsFD.append('team1', 500)
                        teamsFD.append('team2', 500)
                      }
                    }
                    
                    fetch(`/api/tournaments/${t.championshipid}/matches/${x.matchid}/`, {
                      method: 'PUT',
                      headers: { 
                        'Authorization': `JWT ${localStorage.getItem('access')}`
                      },
                      body: teamsFD
                    })
                  })
                })
              }, 8000);

            } else if (parseInt(tournamentData.participantSize) > 3) {
              const eliminationSize = tournamentData?.qualifications === 'Yes' ?
               parseInt(tournamentData.participantSize)/2 : parseInt(tournamentData.participantSize)
              let opponents = selectedTeams
              let nextMatchIdCount = tournamentData?.qualifications === 'Yes' ? selectedTeams.length / 4 : selectedTeams.length / 2 
              let loopStepCount = 1
              const fd4 = new FormData();
              const startHour = Math.floor(Math.random() * 24);
              const start = new Date();
              const alternateStartDate = new Date(tournamentData.startDate)
              alternateStartDate.setDate(alternateStartDate.getDate() + 3 * restVar + 3)
              fd4.append("team1", tournamentData?.qualifications === 'Yes' ? 500 : opponents[0])
              fd4.append("team2", tournamentData?.qualifications === 'Yes' ? 500 : opponents[1])
              fd4.append("matchdate", tournamentData?.qualifications === 'Yes' ? formatDateUS(alternateStartDate) : tournamentData.startDate)
              fd4.append("starttime", `${startHour}:00:00`)
              fd4.append("endtime", formattedEndTime)
              start.setHours(startHour, 0, 0);
              //if (isPotentionOf2(selectedTeams.length)) {
                let teamsCounter = 2
                for (let i = 1; i <= eliminationSize; i += 1) {
                  fetch(`/api/tournaments/${t.championshipid}/matches/`, {
                    method: 'POST',
                    headers: { 
                      'Authorization': `JWT ${localStorage.getItem('access')}`
                    },
                    body: fd4
                  })
                }
                fetch(`/api/tournaments/${t.championshipid}/matches/`)
                .then(response => response.json())
                .then(dt => {
                  const matchId = dt.filter(m => m.groupid < 1)[0]?.matchid;
                  const fd5 = new FormData()
                  fd5.append('nextmatchid', matchId + nextMatchIdCount)

                  fetch(`/api/tournaments/${t.championshipid}/matches/${matchId}/`, {
                    method: 'PUT',
                    headers: { 
                      'Authorization': `JWT ${localStorage.getItem('access')}`
                    },
                    body: fd5
                  })
                  nextMatchIdCount = nextMatchIdCount - 1
                  let dateSetter = tournamentData?.qualifications === 'Yes' ? selectedTeams.length / 4 : selectedTeams.length / 2
                  let dateCounter = 2
                  let matchDateTmp = new Date(tournamentData?.qualifications === 'Yes' ? alternateStartDate : tournamentData.startDate)
                  for (let mToCreate = matchId+1 ; mToCreate <= matchId + eliminationSize - 1; mToCreate += 1 ) {
                    
                    if (loopStepCount === 3) {
                      loopStepCount = 1
                    }
                    const fdTmp = new FormData()
                    if (opponents?.length > teamsCounter + 1 && formatDateUS(matchDateTmp) === tournamentData?.startDate) {
                      
                      fdTmp.append("team1", tournamentData?.qualifications === 'Yes' ? 500 : opponents[teamsCounter])
                      fdTmp.append("team2", tournamentData?.qualifications === 'Yes' ? 500 : opponents[teamsCounter + 1])
                    } else {
                      fdTmp.append('team1', 500)
                      fdTmp.append('team2', 500)
                    }

                    if (mToCreate === matchId + eliminationSize - 1) {
                      fdTmp.append('nextmatchid', 0)
                      fdTmp.append('matchdate', tournamentData.endDate)
                    } else {
                      fdTmp.append('nextmatchid', mToCreate + nextMatchIdCount)
                      if (dateCounter > dateSetter) {
                        dateSetter /= 2
                        dateCounter = 1
                        matchDateTmp.setDate(matchDateTmp.getDate() + restVar + 1);
                      }
                      fdTmp.append('matchdate', formatDateUS(matchDateTmp))
                    }
                    fdTmp.append("starttime", `${startHour}:00:00`)
                    fdTmp.append("endtime", formattedEndTime)
                    fetch(`/api/tournaments/${t.championshipid}/matches/${mToCreate}/`, {
                      method: 'PUT',
                      headers: { 
                        'Authorization': `JWT ${localStorage.getItem('access')}`
                      },
                      body: fdTmp
                    })
                    if (loopStepCount === 2) {  
                      nextMatchIdCount -= 1
                    }
                    loopStepCount += 1
                    dateCounter += 1
                    teamsCounter += 2
                  }
                })
              //} 
            }
          })
        }, 2000)
      })
      .then(_ => {
        setTimeout(() => {
        navigate("/tournaments")
        }, 8000);
      })
    }
  }

  function filterTeams() {
    let overlapFound = false;
    fetch(`/api/tournaments/`)
      .then((response) => response.json())
      .then((data) => {
      fetch('/api/teams/')
        .then(response => response.json())
        .then(tms => {
        let filteredTeams = tms.filter(i => i.isvalid)
          .filter(t => tournamentData.gender === 'all' || t.gender.toLowerCase() === tournamentData.gender.toLowerCase())
        data.map(x => {
        if (tournamentsOverlap(tournamentData?.startDate, tournamentData?.endDate, x.startDate, x.endDate)) {
          overlapFound = true;
          //console.log("overlapping brooo")
          //console.log("this start: " + tournamentData?.startDate + " overlap start: " + x.startDate)
          //console.log("this end: " + tournamentData?.endDate + " overlap end: " + x.endDate)
          fetch(`/api/tournaments/${x.championshipid}/participants/`)
          .then(partc => partc.json())
          .then(participants => {
            filteredTeams = filteredTeams.filter(ft => !participants.map(pt => pt.teamid).includes(ft.id))
            setAvailableTeams(filteredTeams)
              //.filter(t => !participants.map(p => p.id).indexOf(t.id) > 0)
          })
        }
        })
        if (!overlapFound) {
          setAvailableTeams(filteredTeams)
        }
        })
    });
  }

  function tournamentsOverlap(startDate1, endDate1, startDate2, endDate2) {
    return (endDate1 >= startDate2 && startDate1 <= endDate2);
  }

  return(
    <div className={blankspace}>
      <div>
        &nbsp;&nbsp;&nbsp;&nbsp;<h1 align='center' className={mainTitle}>Create tournament</h1>
        {
          showCreatingMsg ? (
          <Modal id='root'>
          <div className="deletion-dialog">
            <dialog open className={profileDialog}>
            <span>
              <h1 className={termsTitle}>Creating tournament...</h1>
            </span>
            </dialog>
          </div>
        </Modal>
          ):null
        }
        <div align='center'>
            {availableTeams.length < parseInt(tournamentData?.participantSize) 
            ? null 
            : <>
                <button className='modal-btn margin-left-xl' onClick={() => processSave()}>Save</button>
                &nbsp;&nbsp;<button className='modal-btn' onClick={() => resetSelected()}>Reset selection</button>
              </>}
            &nbsp;&nbsp;
            <button onClick={() => navigate(`/tournaments/create?tournamentData=${encodeURIComponent(JSON.stringify(tournamentData))}`)} className='modal-btn'>Back</button>
            {showWarning ? <p className='inline-warnings margin-left-xl'>{wrongMsg}</p> : null}

        </div>
        <div className='create-wrapper'>
          <span className='create-wrapper2'>
          <div className={matchesSpace}>
          <div className= {availableTeams.length < tournamentData?.participantSize ? undefined : 'mathces-teams-container'}>
          {availableTeams.length < tournamentData?.participantSize 
          ? <p className='warnings' align='center'>Unfortunately, there are not enough available teams for this tournament.
            Try changing the start date or number of teams.</p> 
          : availableTeams.map( (item) => {return (
            <div>
              <input type="checkbox" id={`participantcheck${item.id}`} onChange={() => updateSelectedTeams(item.id)}></input>
              <img src={item.itemphoto} className='rank-image'></img>
              &nbsp;
              <label htmlFor={`participantcheck${item.id}`} id="participantname" className={playerNameLink}>{item.name}</label>
              <br/><br/>
            </div>)})}
          </div>
         </div>
          </span>
          </div>
    </div>
    </div>
  )}

  const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
  });
  
  export default connect(mapStateToProps, {checkAuthenticated, loadUser})(TournamentCreateAddTeams);