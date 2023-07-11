import './css/Homepage.css';
import './css/Ranking.css';
import { blankspace, mainTitle, rankHeading, rankingCard, modalInput, countries, modalLabels, getCountryWithoutFlag } from './Constants';
import { useEffect } from 'react';
import { useState } from 'react';
import { navigate } from '@reach/router';


function Rankings() {

  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [selectedGender, setSelectedGender] = useState('All')
  const [selectedCountry, setSelectedCountry] = useState('All')

  useEffect(() => {
    fetch('/api/teams/')
    .then(response => response.json())
    .then(allTeams => {setTeams(allTeams);setFilteredTeams(allTeams)})
  }, []);

  useEffect(() => {
    fetch('/api/players/')
    .then(response => response.json())
    .then(allPlayers => {setPlayers(allPlayers);setFilteredPlayers(allPlayers)})
  }, []);

  function filterStuff(filter1, filter2) {
    if (filter1 === 'All' && filter2 === 'All') {
      setFilteredPlayers(players)
      setFilteredTeams(teams)
    } else if (filter1 === 'All' && filter2 !== 'All'){
      setFilteredPlayers(players.filter(x=>x.gender.toLowerCase() === filter2.toLowerCase()))
      setFilteredTeams(teams.filter(x=>x.gender.toLowerCase() === filter2.toLowerCase()))
    } else if (filter1 !== 'All' && filter2 === 'All') {
      setFilteredPlayers(players.filter(x=>x.country === getCountryWithoutFlag(filter1)))
      setFilteredTeams(teams.filter(x=>x.country === getCountryWithoutFlag(filter1)))
    }
    else {
      setFilteredPlayers(players.filter(x=>x.country === getCountryWithoutFlag(filter1)).filter(x=>x.gender.toLowerCase() === filter2.toLowerCase()))
      setFilteredTeams(teams.filter(x=>x.country === getCountryWithoutFlag(filter1)).filter(x=>x.gender.toLowerCase() === filter2.toLowerCase()))
    }
  }

  return (
    <div className={blankspace}>
        <div >
        &nbsp;&nbsp;&nbsp;&nbsp;<h1 align='center' className={mainTitle}>RANKINGS</h1>
        <div className='rating-container'>
          <div>
          <label className={modalLabels}>Country:</label>
          <select 
            className={modalInput} 
            defaultValue='All'
            onChange = {(e) => {setSelectedCountry(e.target.value);filterStuff(e.target.value, selectedGender)}}>
            <option>All</option>{countries.map( (item) => {return <option>{item}</option>})}
          </select>
          <br/><br/>
          <label className={modalLabels}>Gender:</label>
          <select 
            className={modalInput} 
            defaultValue='All'
            onChange = {(e) => {setSelectedGender(e.target.value);filterStuff(selectedCountry, e.target.value)}}>
            <option>All</option>
            <option>Male</option>
            <option>Female</option>
          </select>
          </div>
          <div>
            <h1 className={rankHeading}>
              Teams
            </h1>
            {filteredTeams.sort((a,b) => {return b.rating-a.rating}).map((item) => 
            {return (
              <div>
                <button className={rankingCard} onClick={() => navigate(`/teams/${item.id}`)}>
                  <b>{filteredTeams.indexOf(item)+1}.&nbsp;&nbsp;</b>{item.rating}&nbsp;&nbsp; <img src={item.logo} className='rank-image'></img><b>&nbsp;&nbsp;{item.name}</b>
                </button>
              </div>)}
            )}
          </div>
          <div>
            <h1 className={rankHeading}>
              Players
            </h1>
            {filteredPlayers.sort((a,b) => 
            {return b.rating-a.rating}).map((item) => 
            {return (
              <div>
                <button className={rankingCard} onClick={() => navigate(`/players/${item.id}`)}>
                  <b>{filteredPlayers.indexOf(item)+1}.</b> &nbsp;{item.rating}&nbsp;&nbsp;<img src={item.profilephoto} className='rank-image'></img>&nbsp;&nbsp;<b>{item.jerseyname}</b>
                </button>
              </div>)})}
          </div>
        </div>
        <br></br>
       </div>
    </div>
  );
}

export default Rankings;
