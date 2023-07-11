import './css/Homepage.css';
import Table from './Table';
import { contactSubtitle, mainTitle, termsTitle,
     playerNameLink, matchBackground, matchPage} from './Constants';
import { SingleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { loadUser, checkAuthenticated } from "./actions/auth";
import ErrorPage from './ErrorPage';
import { navigate } from '@reach/router';

const createMatch = (match, team1, team2) => {
  return {
  "id": match?.matchid !== 0 ? match.matchid : null,
  "nextMatchId": match?.nextmatchid  !== 0 ? match.nextmatchid : null, // Id for the nextMatch in the bracket, if it's final match it must be null OR undefined
  "tournamentRoundText": "Elimination", // Text for Round Header
  "startTime": match?.matchdate, // ili formatDateEU(match.matchdate) za Europsko formatiranje vremena
  "state": "WALK_OVER", // 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | 'DONE' | 'SCORE_DONE' Only needed to decide walkovers and if teamNames are TBD (to be decided)
  "participants": [
    {
      "id": team1?.id, // Unique identifier of any kind
      "resultText": match?.winner === team1?.id ? "WON" : "", // Any string works
      "isWinner": match?.winner === team1?.id ? true : false,
      "status": null, // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | null
      "name": team1?.name
    },
    {
      "id":  team2?.id,
      "resultText": match?.winner === team2?.id ? "WON" : "",
      "isWinner": match?.winner === team2?.id ? true : false,
      "status": null, // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY'
      "name": team2?.name
    }
  ], "thirdPlaceMatchText": "Third place"
}}

const TournamentMatches = (props) => {

  const [footballMatches, setFootballMatches] = useState([])
  const [groups, setGroups] = useState([])
  const [teams, setTeams] = useState([])
  const [current, setCurrent] = useState({})
  const [hasErrors, setHasErrors] = useState(false)
  const [groupMatches, setGroupMatches] = useState([])

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
      fetch(`/api/tournaments/${props.id}/matches/`)
      .then(rspp => rspp.json())
      .then(matchez => {
        if (matchez) {
          setGroupMatches(matchez)
          const promise = matchez
            .filter((mat) => mat.groupid < 1)
            .sort((a, b) => a.matchid - b.matchid)
            .map(async m => {
              const [tm1, tm2] = await Promise.all([
                fetch(`/api/teams/${m.team1}/`).then((re) => re.json()),
                fetch(`/api/teams/${m.team2}/`).then((res) => res.json()),
              ]);
              return ({ match: m, team1: tm1, team2: tm2 });
            });
    
          Promise.all(promise)
            .then((matchesWithTeams) => {
              const sortedMatches = matchesWithTeams
                .map(({ match, team1, team2 }) => createMatch(match, team1, team2))
                .sort((a, b) => a.matchid - b.matchid);
    
              setFootballMatches(sortedMatches);
              console.log(sortedMatches);
            })
        }
      });
      fetch(`/api/groups/${props.id}/`)
      .then(respo => respo.json())
      .then(grps => {
        setGroups(grps)
      })
      fetch(`/api/teams/`)
      .then(tmResponse => tmResponse.json())
      .then(tms => setTeams(tms))
    });
  }, [])

  function findMatchByOpponents(team1ID, team2ID) {
    navigate(`/tournaments/${props.id}/matches/${groupMatches.find(mtch => mtch.team1 === team1ID && mtch.team2 === team2ID)?.matchid}`)
  }

  return hasErrors ? <ErrorPage /> : (
    <div className={matchPage}>
        <div>
        &nbsp;&nbsp;&nbsp;&nbsp;<h1 align='center' className={mainTitle}>{current?.name}</h1>
        <button className='card-button-goto margin-left-xl' onClick={() => navigate(`/tournaments/${props.id}`)}>Back to championship info</button>
        <div>
        {current.qualifications && <div>
          <hr/>
          <h2 className={termsTitle}>GROUP QUALIFICATIONS</h2>
          {groups.sort((a, b) => a.letter.localeCompare(b.letter)).map(g => <div>
          <h2 className={contactSubtitle}>GROUP {g.letter}</h2>
          <div className='discussion-flex2'>
          <Table
              multipleRows={true} wide
              pos1="1" team1={teams.find(tm => tm.id === g.team1)?.name} pld1="0" w1="0" d1="0" l1="0" gf1="0" ga1="0" gd1="0" pts1="0"
              pos2="2" team2={teams.find(tm => tm.id === g.team2)?.name} pld2="0" w2="0" d2="0" l2="0" gf2="0" ga2="0" gd2="0" pts2="0"
              pos3="3" team3={teams.find(tm => tm.id === g.team3)?.name} pld3="0" w3="0" d3="0" l3="0" gf3="0" ga3="0" gd3="0" pts3="0"
              pos4="4" team4={teams.find(tm => tm.id === g.team4)?.name} pld4="0" w4="0" d4="0" l4="0" gf4="0" ga4="0" gd4="0" pts4="0"
          />
          <div>
            <p className={playerNameLink} onClick={() => findMatchByOpponents(g.team1, g.team2)}>{teams.find(tm => tm.id === g.team1)?.name} - {teams.find(tm => tm.id === g.team2)?.name}</p>
            <p className={playerNameLink} onClick={() => findMatchByOpponents(g.team1, g.team3)}>{teams.find(tm => tm.id === g.team1)?.name} - {teams.find(tm => tm.id === g.team3)?.name}</p>
            <p className={playerNameLink} onClick={() => findMatchByOpponents(g.team1, g.team4)}>{teams.find(tm => tm.id === g.team1)?.name} - {teams.find(tm => tm.id === g.team4)?.name}</p>
          </div>
          <div>
            <p className={playerNameLink} onClick={() => findMatchByOpponents(g.team3, g.team4)}>{teams.find(tm => tm.id === g.team3)?.name} - {teams.find(tm => tm.id === g.team4)?.name}</p>
            <p className={playerNameLink} onClick={() => findMatchByOpponents(g.team2, g.team4)}>{teams.find(tm => tm.id === g.team2)?.name} - {teams.find(tm => tm.id === g.team4)?.name}</p>
            <p className={playerNameLink} onClick={() => findMatchByOpponents(g.team2, g.team3)}>{teams.find(tm => tm.id === g.team2)?.name} - {teams.find(tm => tm.id === g.team3)?.name}</p>
          </div>
        </div>
        </div>)}
        </div>}
        </div>
        <hr/>
        <h2 className={termsTitle}>MATCHES</h2>
        <div className='centered-flex'>
        {footballMatches && footballMatches.length > 0 && <SingleEliminationBracket
          matches={footballMatches}
          matchComponent={Match}
          onMatchClick={(match) => navigate(`/tournaments/${props.id}/matches/${match.match.id}`)}
          svgWrapper={({ children, ...props }) => (
            <SVGViewer width={1300} matchBackground={matchBackground} SVGBackground={matchBackground} {...props} >{children}</SVGViewer>
          )}
        />}
        </div>
       </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, { checkAuthenticated, loadUser })(TournamentMatches);
