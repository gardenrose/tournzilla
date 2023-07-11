import './css/Homepage.css';
import { Link, navigate } from "@reach/router";
import { blankspace, mainTitle, playerNameLink, activeMatchCard } from './Constants';
import { useEffect, useState } from 'react';
import { detectThirdAndForthPlace, getMatchesInProgress, transformFormation } from './Deciders';

function ActiveMatches() {

  const [matches, setMatches] = useState([])
  const [teams, setTeams] = useState([])

  useEffect(() => {
    getMatchesInProgress()
    fetch('/api/teams/')
    .then(rs => rs.json())
    .then(tms => setTeams(tms))
    fetch('/api/tournaments/')
    .then(res => res.json())
    .then(data => {
      data.map(x => {
        fetch(`/api/tournaments/${x.championshipid}/matches/`)
        .then(res2 => res2.json())
        .then(matchez => {
          const matchesInProgress = matchez.filter(x => x.status === 'In progress')
          setMatches(matchesInProgress)
        })
      })
    })
  }, [])

  return (
    <div className={blankspace}>
        <div >
        &nbsp;&nbsp;&nbsp;&nbsp;<h1 align='center' className={mainTitle}>ACTIVE MATCHES</h1>
        <div className='active-match-container'>
            {matches.map((item) => 
            {return (
              <div>
                <p className={playerNameLink}><u>Details</u></p>
                <button className={activeMatchCard}>
                  <b>{item.score1}{item.score1 < 10 ?<>&nbsp;&nbsp;</> :null}</b> <img src={teams.find(item.team1).logo} className='rank-image'></img><b>&nbsp;&nbsp;{teams.find(item.team1).name}</b>
                </button><br/>
                <button className={activeMatchCard}>
                  <b>{item.score2}{item.score2 < 10 ?<>&nbsp;&nbsp;</> :null}</b> <img src={teams.find(item.team2).logo} className='rank-image'></img><b>&nbsp;&nbsp;{teams.find(item.team2).name}</b>
                </button>
              </div>)}
            )}
        </div>
        <br/>
       </div>
    </div>
  );
}

export default ActiveMatches;