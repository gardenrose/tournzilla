import './css/Homepage.css';
import './css/Tournaments.css';
import './css/LightMode.css';
import ContentCard from './ContentCard';
import { navigate } from "@reach/router";
import { blankspace, termsTitle, factDialog, contactSubtitle, mainTitle,
   getCountryWithFlag, timesChampion, profileDialog, modalLabels, modalInput, 
   cardDesc, countries, getCountryWithoutFlag} from './Constants';
import React, {useEffect, useState} from "react";
import Table from './Table';
import { PieChart, Pie, Cell, Legend } from "recharts";
import male from "./images/male.png";
import female from "./images/female.png";
import wintrophy from "./images/trophy.webp";
import silvermedal from './images/silver-medal.png';
import bronzemedal from './images/bronze-medal.webp';
import { connect } from 'react-redux';
import { loadUser, checkAuthenticated } from "./actions/auth";
import Modal from './Modal';
import PlayerPhotos from './PlayerPhotos';
import ErrorPage from './ErrorPage';

const TeamDetails = (props) => {

  const [showModal, setShowModal] = useState(false);
  const [favs, setFavs] = useState([]);
  const [team, setTeam] = useState({});
  const [createTeamState, setCreateTeamState] = useState(team)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [wrongInputMsg, setWrongInputMsg] = useState(undefined);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const [coachImgPreview, setCoachImgPreview] = useState(team.coachphoto);
  const [jersey1Preview, setJersey1ImgPreview] = useState(team.jersey1);
  const [jersey2Preview, setJersey2Preview] = useState(team.jersey2);
  const [itemPhotoImgPreview, setItemPhotoImgPreview] = useState(team.itemphoto);
  const [logoImgPreview, setLogoImgPreview] = useState(team.logo);
  const [pageError, setError] = useState(false);
  const [topScorers, setTopScorers] = useState([])

  useEffect(() => {
    props.checkAuthenticated();
    props.loadUser();
    if (props.user?.id) {
      fetch(`/api/favorites/${props.user?.id}/`)
        .then(response => response.json())
        .then(data => setFavs(data))
    }
    fetch(`/api/players/`)
    .then(response => response.json())
    .then(scorers => {
      setTopScorers(scorers.filter(x => x.currentteam === parseInt(props.id))
      .filter(x => x.position !== 'Goalkeeper')
      .sort((a, b) => b.goals - a.goals))
    })
  }, []);

  function deleteTeam() {
    fetch(`/api/teams/${props.id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type':'application/json', 
        'Authorization': `JWT ${localStorage.getItem('access')}`
      }
    })
    .then(() => navigate('/teams'))
  }

  async function handleFavorites(userid) {
    if (favs.filter(x => x.id === parseInt(props.id)).length > 0 && userid && document.getElementById('fvrz').textContent=='Unfavorize') {
      await fetch(`/api/favorites/${userid}/${props.id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type':'application/json', 
          'Authorization': `JWT ${localStorage.getItem('access')}`
        }
      });
      await fetch(`/api/favorites/${props.user.id}/`)
        .then(response => response.json())
        .then(data => setFavs(data))
      document.getElementById('fvrz').textContent='Favorize'
    } else if (props.user && document.getElementById('fvrz').textContent=='Favorize'){
      await fetch(`/api/favorites/${userid}/`, {
        method: 'POST',
        headers: {
          'Content-Type':'application/json', 
          'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        body: JSON.stringify({"userid":userid, "teamid": parseInt(props.id)})
      });
      await fetch(`/api/favorites/${props.user.id}/`)
        .then(response => response.json())
        .then(data => setFavs(data))
      document.getElementById('fvrz').textContent='Unfavorize'
    }
  }

  const chartWidth=460;

  var COLORS = ["#FFBB28", "#FF8042"];
    var possessionData = [
        {
          name: "Team",
          value: team.possession
        },
        {
          name: "Opponent",
          value: 100 - team.possession
        }
    ];

    var shootingData = [
      {
        name: "Shoots on target",
        value: team.shootingaccuracy
      },
      {
        name: "Shoots off target",
        value: 100 - team.shootingaccuracy
      }
  ];

  var goalsData = [
    {
      name: "Scored for",
      value: (team.goals * 100)/(team.goals + team.concededgoals)
    },
    {
      name: "Scored against",
      value: (team.concededgoals * 100)/(team.goals + team.concededgoals)
    }
  ];

  useEffect(() => {
      fetch(`/api/teams/${props.id}/`)
      .then(response => {if (response.status === 500) {
        setError(true);
      } else {
        return response.json();
      }})
      .then(theTeam => {
        setTeam(theTeam);
        setCreateTeamState(theTeam);
        setItemPhotoImgPreview(theTeam.itemphoto);
        setCoachImgPreview(theTeam.coachphoto);
        setLogoImgPreview(theTeam.logo);
        setJersey1ImgPreview(theTeam.jersey1);
        setJersey2Preview(theTeam.jersey2);
      })
    }, []);

    async function handleEdit () {
      const formData = new FormData();
      if (createTeamState.coachphoto === undefined || typeof createTeamState.coachphoto === 'string') {
        setCreateTeamState({...createTeamState, coachphoto: '../../media/default_photo.jpeg'})
        formData.append('coachphoto', createTeamState['coachphoto'])
      }
      else {
        formData.append('coachphoto', createTeamState['coachphoto'], createTeamState['coachphoto'].name)
      }
      if (createTeamState.jersey1 === undefined || typeof createTeamState.jersey1 === 'string') {
        setCreateTeamState({...createTeamState, jersey1: '../../media/default_photo.jpeg'})
        formData.append('jersey1', createTeamState['jersey1'])
      }
      else {
        formData.append('jersey1', createTeamState['jersey1'], createTeamState['jersey1'].name)
      }
      if (createTeamState.jersey2 === undefined || typeof createTeamState.jersey2 === 'string') {
        setCreateTeamState({...createTeamState, jersey2: '../../media/default_photo.jpeg'})
        formData.append('jersey2', createTeamState['jersey2'])
      }
      else {
        formData.append('jersey2', createTeamState['jersey2'], createTeamState['jersey2'].name)
      }
      if (createTeamState.logo === undefined || typeof createTeamState.logo === 'string') {
        setCreateTeamState({...createTeamState, logo: '../../media/default_logo.png'})
        formData.append('logo', createTeamState['logo'])
      }
      else {
        formData.append('logo', createTeamState['logo'], createTeamState['logo'].name)
      }
      if (createTeamState.itemphoto === undefined || typeof createTeamState.itemphoto === 'string') {
        setCreateTeamState({...createTeamState, itemphoto: '../../media/default_photo.jpeg'})
        formData.append('itemphoto', createTeamState['itemphoto'])
      }
      else {
        formData.append('itemphoto', createTeamState['itemphoto'], createTeamState['itemphoto'].name)
      }
      for ( var key in createTeamState ) {
        if (key.toString() !== 'coachphoto' && key.toString() !== 'jersey1' && key.toString() !== 'jersey2'
          && key.toString() !== 'logo' && key.toString() !== 'itemphoto'){
            formData.append(key, createTeamState[key]);
        }
      }
      await fetch(`/api/teams/${props.id}/`, {
        method: 'put',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        body: formData })
        .then((response) => response.json())
        .then((data) => {
          setWrongInputMsg(data?.message)
          if (!data?.message) {
            setShowModal(false)
            fetch(`/api/teams/${props.id}`)
            .then(response => response.json())
            .then(tm => setTeam(tm))
          }
      });
      await fetch(`/api/teams/${props.id}/`)
      .then(response => response.json())
      .then(theTeam => {
        setTeam(theTeam);
        setCreateTeamState(theTeam);
        setItemPhotoImgPreview(theTeam.itemphoto);
        setCoachImgPreview(theTeam.coachphoto);
        setLogoImgPreview(theTeam.logo);
        setJersey1ImgPreview(theTeam.jersey1);
        setJersey2Preview(theTeam.jersey2);
      })
    }

    function setDefaults() {
      setWrongInputMsg(undefined);
      setCreateTeamState(team);
    }

    function imageHandler (e, imgPosition) {
      const reader = new FileReader();
      reader.onload = () =>{
        if(reader.readyState === 2){
          if (imgPosition === 1) {
            setCoachImgPreview(reader.result)
            setCreateTeamState({...createTeamState, coachphoto:e.target.files[0]})
          }
          else if (imgPosition === 2) {
            setJersey1ImgPreview(reader.result)
            setCreateTeamState({...createTeamState, jersey1:e.target.files[0]})
          }
          else if (imgPosition === 3) {
            setJersey2Preview(reader.result)
            setCreateTeamState({...createTeamState, jersey2:e.target.files[0]})
          }
          else if (imgPosition === 4) {
            setItemPhotoImgPreview(reader.result)
            setCreateTeamState({...createTeamState, itemphoto:e.target.files[0]})
          }
          else if (imgPosition === 5) {
            setLogoImgPreview(reader.result)
            setCreateTeamState({...createTeamState, logo:e.target.files[0]})
          }
        }
      }
      reader.readAsDataURL(e.target.files[0])
    };

    return pageError ? <ErrorPage /> 
    : (
    <div  className={blankspace}>
        <div>
          {props.user ? <button onClick={()=>{handleFavorites(props.user?.id)}} id='fvrz' className='add-btn'>{favs.filter(x => x.id === parseInt(props.id)).length > 0 ? "Unfavorize" : "Favorize"}</button> :null}
          &nbsp;&nbsp;
          {props.user?.is_staff ? <button onClick={() => {setDefaults();setShowModal(true)}} className='card-button-positive'>Edit</button> :null}
          {props.user?.is_staff ? <button onClick={handleShowDeleteModal} className='card-button-negative'>Delete</button> :null}
          &nbsp;&nbsp;&nbsp;&nbsp;<h1 align='center' className={mainTitle}>{team.name}</h1>
          <img src={team.logo} className="team-logo-icon"></img>
          <img
            className="profile-gender"
            src={team.gender === 'male' ? male : female}>
          </img>       
          <p className='misc-inline-title'>{team.slogan ? `„${team.slogan} ”` :null}</p>
          <img src={wintrophy} className='wintrophy'></img>
          <p className={timesChampion}>{team.timeschampion}</p>
          <img src={silvermedal} className='wintrophy'></img>
          <p className={timesChampion}>{team.timessecond}</p>
          <img src={bronzemedal} className='wintrophy'></img>
          <p className={timesChampion}>{team.timesthird}</p>
          <span className='misc-span'>
            <p className='misc-inline-text'>{team.country ? getCountryWithFlag(team.country) :null}</p>&nbsp;&nbsp;
            <p className='misc-inline-text'>{team.foundationyear ? team.foundationyear : null}</p>
          </span>
          <div className="modal-wrapper">
          { showDeleteModal ? (
                  <Modal id='root'>
                      <div className="deletion-dialog">
                          <dialog open className={factDialog}>
                          <span>
                            <h1 className={termsTitle}>Confirm delete</h1>
                          </span>
                          &nbsp;&nbsp;&nbsp;
                          <div>
                            <button className='modal-btn' onClick={() => deleteTeam()}>Delete</button><br></br>
                            <button className='modal-btn' onClick={handleCloseDeleteModal}>Cancel</button><br></br>
                          </div>
                          </dialog>
                      </div>
                  </Modal>
              ) : null
            }
          </div> 
          <div>
          {
            showModal ? (
              <Modal id='root'>
                <div className="modal-dialog">
                  <dialog open className={`${profileDialog} scrollable-modal`}>
                  <span className='scrollable-container'>
                    <label className={modalLabels}>Team name:<label className='inline-warnings'>*</label></label>
                    <input className={modalInput} defaultValue={team.name} type="text" onChange={e=>setCreateTeamState({...createTeamState, name: e.target.value})} /><br/><br/>
                    <label className={modalLabels}>Gender:<label className='inline-warnings'>*</label></label>
                    <select className={modalInput} defaultValue={team.gender} onChange = {e => createTeamState.gender=e.target.value}>
                      <option>male</option>
                      <option>female</option>
                    </select><br/><br/>
                    <label className={modalLabels}>Total wins:</label>
                    <input className={modalInput} type="number" defaultValue={team.totalwins} min={0} onChange = {e=>setCreateTeamState({...createTeamState, totalwins: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Total draws:</label>
                    <input className={modalInput} type="number" defaultValue={team.totaldraws} min={0} onChange = {e=>setCreateTeamState({...createTeamState, totaldraws: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Total losses:</label>
                    <input className={modalInput} type="number" defaultValue={team.totallosses} min={0} onChange = {e=>setCreateTeamState({...createTeamState, totallosses: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Goals scored:</label>
                    <input className={modalInput} type="number" defaultValue={team.goals} min={0} onChange = {e=>setCreateTeamState({...createTeamState, goals: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Goals conceded:</label>
                    <input className={modalInput} type="number" defaultValue={team.concededgoals} min={0} onChange = {e=>setCreateTeamState({...createTeamState, concededgoals: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Yellow cards:</label>
                    <input className={modalInput} type="number" defaultValue={team.yellowcards} min={0} onChange = {e=>setCreateTeamState({...createTeamState, yellowcards: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Red cards:</label>
                    <input className={modalInput} type="number" defaultValue={team.redcards} min={0} onChange = {e=>setCreateTeamState({...createTeamState, redcards: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Saves:</label>
                    <input className={modalInput} type="number" defaultValue={team.saves} min={0} onChange = {e=>setCreateTeamState({...createTeamState, saves: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Offsides:</label>
                    <input className={modalInput} type="number" defaultValue={team.offsides} min={0} onChange = {e=>setCreateTeamState({...createTeamState, offsides: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Fouls:</label>
                    <input className={modalInput} type="number" defaultValue={team.fouls} min={0} onChange = {e=>setCreateTeamState({...createTeamState, fouls: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Shot precision (%):</label>
                    <input className={modalInput} type="number" defaultValue={team.shootingaccuracy} min={0} max={100} onChange = {e=>setCreateTeamState({...createTeamState, shootingaccuracy: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Possession (%):</label>
                    <input className={modalInput} type="number" defaultValue={team.possession} min={0} max={100} onChange = {e=>setCreateTeamState({...createTeamState, possession: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Rating:</label>
                    <input className={modalInput} type="number" defaultValue={team.rating} min={200} max={1800} onChange = {e=>setCreateTeamState({...createTeamState, rating: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Coach name:<label className='inline-warnings'>*</label></label>
                    <input className={modalInput} type="text" defaultValue={team.coachname} onChange = {e=>setCreateTeamState({...createTeamState, coachname: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Coach description:</label>
                    <input className={modalInput} type="text" defaultValue={team.coachdesc} onChange = {e=>setCreateTeamState({...createTeamState, coachdesc: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Times champion:</label>
                    <input className={modalInput} type="number" defaultValue={team.timeschampion} min={0} max={100} onChange = {e=>setCreateTeamState({...createTeamState, timeschampion: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Times second:</label>
                    <input className={modalInput} type="number" defaultValue={team.timessecond} min={0} max={100} onChange = {e=>setCreateTeamState({...createTeamState, timessecond: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Times third:</label>
                    <input className={modalInput} type="number" defaultValue={team.timesthird} min={0} max={100} onChange = {e=>setCreateTeamState({...createTeamState, timesthird: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Slogan:</label>
                    <input className={modalInput} type="text" defaultValue={team.slogan} onChange = {e=>setCreateTeamState({...createTeamState, slogan: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Foundation year:</label>
                    <input className={modalInput} type="number" defaultValue={team.foundationyear} onChange = {e=>setCreateTeamState({...createTeamState, foundationyear: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Country:</label>
                    <select 
                      className={modalInput} 
                      defaultValue={getCountryWithFlag(team.country)} 
                      onChange = {e=>setCreateTeamState({...createTeamState, country: e.target.value === "???" ? e.target.value : getCountryWithoutFlag(e.target.value)})}>
                      <option>???</option>{countries.map( (item) => {return <option>{item}</option>})}
                    </select>
                    </span>
                    <br></br>
                    <span className='scrollable-container-images'>
                      <span>
                        <label className={modalLabels}>Coach photo:</label>
                        <img
                        src={coachImgPreview}
                        width="220" height="140"></img><br></br>
                        <input type="file" accept="image/*" className={cardDesc} onChange={e => imageHandler(e, 1)}/>
                      </span>
                    <span>
                      <label className={modalLabels}>Main jersey:</label>
                      <img
                      src={jersey1Preview}
                      width="220" height="140"></img><br></br>
                      <input type="file" accept="image/*" className={cardDesc} onChange={e => imageHandler(e, 2)}/>
                    </span>
                    <span>
                        <label className={modalLabels}>Substitute jersey:</label>
                        <img
                        src={jersey2Preview}
                        width="220" height="140"></img><br></br>
                        <input type="file" accept="image/*" className={cardDesc} onChange={e => imageHandler(e, 3)}/>
                      </span>
                      <span>
                        <label className={modalLabels}>List item photo:</label>
                        <img
                        src={itemPhotoImgPreview}
                        width="220" height="140"></img><br></br>
                        <input type="file" accept="image/*" className={cardDesc} onChange={e => imageHandler(e, 4)}/>
                      </span>
                      <span>
                        <label className={modalLabels}>Logo:</label>
                        <br/>
                        <img
                        src={logoImgPreview}
                        width="110" height="140"></img><br></br>
                        <input type="file" accept="image/*" className={cardDesc} onChange={e => imageHandler(e, 5)}/>
                      </span>
                  </span>
                  <br/>
                  <div className='modal-btns-and-msg'>
                    <button className='modal-btn' onClick={() => handleEdit()}>Save</button>
                    <br></br>
                    <button className='modal-btn' onClick={() => setShowModal(false)}>Cancel</button>
                    <p className='warnings'>{wrongInputMsg}</p>
                  </div>
                  </dialog>
                </div>
              </Modal>
            ):null
          }
        </div>
          <br></br>
          <br></br>
          <div className='team-stats'>
          <Table 
            title1="Times participated" title2="Total wins" title3="Total draws" title4="Total losses" title5="Goals"
            value1={team.totalwins+team.totaldraws+team.totallosses} value2={team.totalwins} value3={team.totaldraws} value4={team.totallosses} value5={team.goals}
          />
          <br/>
          <Table 
            title1="Yellow cards" title2="Red cards" title3="Saves" title4="Offsides" title5="Fouls"
            value1={team.yellowcards} value2={team.redcards} value3={team.saves} value4={team.offsides} value5={team.fouls}
          />
          </div>
          <br></br>
          <div className='container'>
          <ContentCard
              className='card-tournament' 
              image={team.coachphoto}
              topic='COACH' 
              title={team.coachname}
              description={team.coachdesc}
              buttonText={null}
              extraButton={false}
              buttonText2={null}
              color={8}>
          </ContentCard>
          <ContentCard
              className='card-tournament' 
              image={team.jersey1}
              topic='Equipment' 
              title="Jersey 1"
              description="Main jersey also knows as Home jersey"
              buttonText={null}
              extraButton={true}
              buttonText2={null}
              color={9}>
          </ContentCard>
          <ContentCard
              className='card-tournament' 
              image={team.jersey2}
              topic='Equipment' 
              title="Jersey 2"
              description="Jersey 2 also knows as Away jersey"
              buttonText={null}
              extraButton={true}
              buttonText2={null}
              color={9}>
          </ContentCard>
          </div>
          <div className='team-stats'>
            <hr></hr>
          {topScorers?.length > 4 && <h1 className={contactSubtitle}>Top scorers</h1>}
          {topScorers?.length > 4 && <Table 
            title1="1" title2="2" title3="3" title4="4" title5="5"
            value1={topScorers[0].jerseyname} value2={topScorers[1].jerseyname} 
            value3={topScorers[2].jerseyname} value4={topScorers[3].jerseyname} 
            value5={topScorers[4].jerseyname}
          />}
          <div className='pies-container'>
            <div>
            <h1 className={contactSubtitle}>Possession</h1>
              <PieChart width={chartWidth} height={300}>
                <Pie
                  data={possessionData}
                  color="#000000"
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                >
                  {possessionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                  ))}
                </Pie>
                <Legend />
            </PieChart>
            </div>
          <div>
          <h1 className={contactSubtitle}>Shooting accuracy</h1>
          <PieChart width={chartWidth} height={300}>
            <Pie
              data={shootingData}
              color="#000000"
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
            >
              {shootingData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
              ))}
            </Pie>
            <Legend />
        </PieChart>
          </div>
        
          <div>
          <h1 className={contactSubtitle}>Goals distribution</h1>
          <PieChart width={chartWidth} height={300}>
            <Pie
              data={goalsData}
              color="#000000"
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
            >
              {goalsData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
              ))}
            </Pie>
            <Legend />
        </PieChart>
          </div>
        </div>
          </div>
        </div>
        <br></br>
        <hr></hr>
        <PlayerPhotos id={props.id} isAuth={props.user?.is_staff}/>
        <br></br><br></br>
    </div>
    
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});

export default connect(mapStateToProps, {checkAuthenticated, loadUser})(TeamDetails);
