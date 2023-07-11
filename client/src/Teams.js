import './css/Homepage.css';
import ContentCard from './ContentCard';
import { blankspace, countries, getCountryWithFlag, mainTitle, modalInput, 
        modalLabels, profileDialog, cardDesc, getCountryWithoutFlag } from './Constants';
import React, {useEffect, useState} from "react";
import { connect } from "react-redux";
import { loadUser, checkAuthenticated } from "./actions/auth";
import Modal from './Modal';
import './css/Modal.css';
import './css/ContentCard.css';

const Teams = (props) => {

  const [teams, setTeams] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [wrongInputMsg, setWrongInputMsg] = useState(undefined);
  const [coachImgPreview, setCoachImgPreview] = useState('../../media/default_photo.jpeg');
  const [jersey1Preview, setJersey1ImgPreview] = useState('../../media/default_photo.jpeg');
  const [jersey2Preview, setJersey2Preview] = useState('../../media/default_photo.jpeg');
  const [itemPhotoImgPreview, setItemPhotoImgPreview] = useState('../../media/default_photo.jpeg');
  const [logoImgPreview, setLogoImgPreview] = useState('../../media/default_logo.png');

  const initialCreateState = {
    name: '',
    gender: 'male',
    totalwins: 0,
    totaldraws: 0,
    totallosses: 0,
    goals: 0,
    concededgoals: 0,
    yellowcards: 0,
    redcards: 0,
    saves: 0,
    offsides: 0,
    fouls: 0,
    possession: 50,
    shootingaccuracy: 50,
    rating: 1000,
    coachname: '',
    coachphoto: '../../media/default_photo.jpeg',
    coachdesc: '',
    jersey1: '../../media/default_photo.jpeg',
    jersey2: '../../media/default_photo.jpeg',
    logo: '../../media/default_logo.png',
    itemphoto: '../../media/default_photo.jpeg',
    isvalid: false,
    timeschampion: 0,
    timessecond: 0,
    timesthird: 0,
    slogan: '',
    foundationyear: new Date().getFullYear(),
    country: ''
};

  const [createTeamState, setCreateTeamState] = useState(initialCreateState)

  useEffect(() => {
    props.checkAuthenticated();
    props.loadUser();
  }, []);

  useEffect(() => {
    fetch('/api/teams/')
    .then(response => response.json())
    .then(allTeams => setTeams(allTeams));
  }, []);

  async function handleCreate () {
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
    //console.log(createTeamState)
    //console.log(formData)
    await fetch('/api/teams/', {
      method: 'post',
      headers: {
        'Authorization': `JWT ${localStorage.getItem('access')}`
      },
      body: formData })
      .then((response) => response.json())
      .then((data) => {
        setWrongInputMsg(data?.message)
        if (!data?.message) {
          setShowModal(false)
          fetch('/api/teams/')
          .then(response => response.json())
          .then(allTeams => setTeams(allTeams))
        }
    });
  }

  function setDefaults() {
    setWrongInputMsg(undefined);
    setCreateTeamState(initialCreateState);
  }

  const filteredTeams = () => {
    return selectedCountry !== 'All' && selectedGender !== 'All' 
    ? teams.filter(tm => tm.country === selectedCountry &&  tm.gender === selectedGender.toLowerCase())
    : selectedCountry === 'All' && selectedGender !== 'All' ? teams.filter(tm => tm.gender === selectedGender.toLowerCase()) 
    : selectedGender === 'All' && selectedCountry !== 'All' ? teams.filter(tm => tm.country === selectedCountry)
    : teams;
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

  return (
    <div  className={blankspace}>
      &nbsp;&nbsp;&nbsp;&nbsp;<h1 align='center' className={mainTitle}>Teams</h1>
      <div>
          {
            showModal ? (
              <Modal id='root'>
                <div className="modal-dialog">
                  <dialog open className={`${profileDialog} scrollable-modal`}>
                  <span className='scrollable-container'>
                    <label className={modalLabels}>Team name:<label className='inline-warnings'>*</label></label>
                    <input className={modalInput} type="text" onChange={e=>setCreateTeamState({...createTeamState, name: e.target.value})} /><br/><br/>
                    <label className={modalLabels}>Gender:<label className='inline-warnings'>*</label></label>
                    <select className={modalInput} defaultValue={countries[0]} onChange = {e => createTeamState.gender=e.target.value}>
                      <option>male</option>
                      <option>female</option>
                    </select><br/><br/>
                    <label className={modalLabels}>Total wins:</label>
                    <input className={modalInput} type="number" defaultValue={0} min={0} onChange = {e=>setCreateTeamState({...createTeamState, totalwins: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Total draws:</label>
                    <input className={modalInput} type="number" defaultValue={0} min={0} onChange = {e=>setCreateTeamState({...createTeamState, totaldraws: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Total losses:</label>
                    <input className={modalInput} type="number" defaultValue={0} min={0} onChange = {e=>setCreateTeamState({...createTeamState, totallosses: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Goals scored:</label>
                    <input className={modalInput} type="number" defaultValue={0} min={0} onChange = {e=>setCreateTeamState({...createTeamState, goals: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Goals conceded:</label>
                    <input className={modalInput} type="number" defaultValue={0} min={0} onChange = {e=>setCreateTeamState({...createTeamState, concededgoals: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Yellow cards:</label>
                    <input className={modalInput} type="number" defaultValue={0} min={0} onChange = {e=>setCreateTeamState({...createTeamState, yellowcards: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Red cards:</label>
                    <input className={modalInput} type="number" defaultValue={0} min={0} onChange = {e=>setCreateTeamState({...createTeamState, redcards: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Saves:</label>
                    <input className={modalInput} type="number" defaultValue={0} min={0} onChange = {e=>setCreateTeamState({...createTeamState, saves: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Offsides:</label>
                    <input className={modalInput} type="number" defaultValue={0} min={0} onChange = {e=>setCreateTeamState({...createTeamState, offsides: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Fouls:</label>
                    <input className={modalInput} type="number" defaultValue={0} min={0} onChange = {e=>setCreateTeamState({...createTeamState, fouls: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Shot precision (%):</label>
                    <input className={modalInput} type="number" defaultValue={50} min={0} max={100} onChange = {e=>setCreateTeamState({...createTeamState, shootingaccuracy: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Possession (%):</label>
                    <input className={modalInput} type="number" defaultValue={50} min={0} max={100} onChange = {e=>setCreateTeamState({...createTeamState, possession: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Rating:</label>
                    <input className={modalInput} type="number" defaultValue={1000} min={200} max={1800} onChange = {e=>setCreateTeamState({...createTeamState, rating: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Coach name:<label className='inline-warnings'>*</label></label>
                    <input className={modalInput} type="text" defaultValue="" onChange = {e=>setCreateTeamState({...createTeamState, coachname: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Coach description:</label>
                    <input className={modalInput} type="text" defaultValue="" onChange = {e=>setCreateTeamState({...createTeamState, coachdesc: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Times champion:</label>
                    <input className={modalInput} type="number" defaultValue={0} min={0} max={100} onChange = {e=>setCreateTeamState({...createTeamState, timeschampion: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Times second:</label>
                    <input className={modalInput} type="number" defaultValue={0} min={0} max={100} onChange = {e=>setCreateTeamState({...createTeamState, timessecond: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Times third:</label>
                    <input className={modalInput} type="number" defaultValue={0} min={0} max={100} onChange = {e=>setCreateTeamState({...createTeamState, timesthird: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Slogan:</label>
                    <input className={modalInput} type="text" defaultValue="" onChange = {e=>setCreateTeamState({...createTeamState, slogan: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Foundation year:</label>
                    <input className={modalInput} type="number" defaultValue={new Date().getFullYear()} min={1863} max={new Date().getFullYear()} onChange = {e=>setCreateTeamState({...createTeamState, foundationyear: e.target.value})}/><br/><br/>
                    <label className={modalLabels}>Country:</label>
                    <select 
                      className={modalInput} 
                      defaultValue="???" 
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
                    <button className='modal-btn' onClick={() => handleCreate()}>Create</button>
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
      <span className='filters-span'>
      {props.user?.is_staff ? <button className='card-button-goto' onClick={() => {setDefaults();setShowModal(true)}}>Create</button> :null}
      &nbsp;&nbsp;
      <label className={modalLabels}>Country:</label>
      <select 
        className={modalInput} 
        defaultValue={selectedCountry} 
        onChange = {(e) => setSelectedCountry(e.target.value === "All" ? e.target.value : getCountryWithoutFlag(e.target.value))}>
        <option>All</option>{countries.map( (item) => {return <option>{item}</option>})}
      </select>
      <label className={modalLabels}>Gender:</label>
      <select 
        className={modalInput} 
        defaultValue={selectedGender} 
        onChange = {(e) => setSelectedGender(e.target.value)}>
        <option>All</option>
        <option>Male</option>
        <option>Female</option>
      </select>
      </span>
      <br></br>
      <br></br>
      <div className='container'>
        {filteredTeams().map((item) => {return (
            <ContentCard width="50"
              className='card-tournament' 
              bin={props.user?.is_staff}
              firstBtnAction={true}
              image={item.itemphoto} 
              topic='TEAMS' 
              title={item.name}
              description={getCountryWithFlag(item.country) ?? null}
              buttonText="See more"
              extraButton={props.isAuthenticated}
              buttonText2={ "Favorize"}
              color={6}
              url={`/teams/${item.id}`}
              teamid={item.id}
              userid={props.user?.id}>
            </ContentCard>
          )}
        )}
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});

export default connect(mapStateToProps, {checkAuthenticated, loadUser}) (Teams);
