import "./css/Profile.css";
import "./css/Users.css";
import male from "./images/male.png";
import female from "./images/female.png";
import globe from "./images/globe.png";
import {useEffect, useState} from "react";
import book from "./images/book.png";
import logo from "./images/logo.png";
import insta from "./images/insta.png";
import { countries, profileBlankspace, 
        profileCard, profileCard2, profileCard3, calendarInput,
        profileCard4, profileCount, profileUsername, modalDesc, modalInput, 
        modalLabels, circule, profileDialog, formatDateEU, getAgeFromBday, 
        getCountryWithFlag, genders, formatDateUS, termsTitle, getCountryWithoutFlag} from "./Constants";
import Modal from "./Modal";
import "./css/Modal.css";
import { connect } from "react-redux";
import { loadUser, checkAuthenticated } from "./actions/auth";
import ErrorPage from "./ErrorPage";
import { navigate } from "@reach/router";


const Profile = (props) => {
  const [user, setUser] = useState({})
  const [show, setShow] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {setDefaults();setShow(true)};
  const handleCloseDelete = () => {setReportReason('');setShowDelete(false)};
  const handleShowDelete = () => setShowDelete(true);
  const [profileImg, setProfileImg] = useState(user?.profilephoto)
  const [profileImgPreview, setProfileImgPreview] = useState(user?.profilephoto);
  const [pageError, setError] = useState(false)
  const [reportReason, setReportReason] = useState('')

  async function handleSaveUserInfo() {
    const formData = new FormData();
    if (profileImg === undefined || typeof profileImg === 'string') {
      setProfileImg(user.profilephoto)
      formData.append('profilephoto', profileImg)
    }
    else {
      formData.append('profilephoto', profileImg, profileImg.name)
    }
    for ( var key in user ) {
      if (key.toString() !== 'profilephoto') {
        formData.append(key, user[key])
      }
    }
    await fetch(`/api/users/${props.id}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `JWT ${localStorage.getItem('access')}`
      },
      body: formData
    },
    ).catch(_ => console.log('an error happened'));
    await fetch(`/api/users/${props.id}/`)
    .then((response) => response.json())
    .then(userData => setUser(userData))
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

  function setDefaults() {
    setProfileImg(props.user?.profilephoto);
    setProfileImgPreview(props.user?.profilephoto);
    fetch(`/api/users/${props.id}/`)
    .then((response) => response.json())
    .then(userData => setUser(userData))
  }

  function handleDeleteOrReport(deleting) {
    if (deleting) {
      fetch(`/api/users/${user?.id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type':'application/json', 
          'Authorization': `JWT ${localStorage.getItem('access')}`
        }
      })
      .then(() => navigate('/userlist'))
    } else {
      fetch(`/api/reports/`, {
        method: 'POST',
        headers: {
          'Content-Type':'application/json', 
          'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        body: JSON.stringify({"sender":props?.user?.id, "reporteduser": user?.id, "reason":reportReason })
      })
    }
  }

  function handleGiveAdminAccess(id) {
    let formData = new FormData()
    formData.append("is_staff", true)
    fetch(`/api/users/${id}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `JWT ${localStorage.getItem('access')}`
      },
      body: formData
    })
  }

  useEffect(() => {
    fetch(`/api/users/${props.id}/`)
    .then(response => {if (response.status === 500) {
      setError(true);
    } else {
      return response.json();
    }})
    .then(userData => setUser(userData))
  }, []);

  useEffect(() => {
    props.checkAuthenticated();
    props.loadUser();
  }, []);

  return pageError ? <ErrorPage /> 
    : (
    <div className={profileBlankspace}>
      <div>
        <div>
        {
          show ? (
              <Modal id='root'>
                  <div className="modal-dialog">
                      <dialog open className={profileDialog}>
                      <span>
                        <label className={modalLabels}>Full name:</label>
                        <input className={modalInput} defaultValue={user.fullname} type="text" id="fname" onChange={(e) => user.fullname = e.target.value}/><br/><br/>
                        <label className={modalLabels}>Gender:</label>
                        <select className={modalInput} defaultValue={user.gender ?? "do not specify"} id='gender' onChange={(e) => user.gender = genders.includes(e.target.value) ? e.target.value : null }>
                          <option>male</option> 
                          <option>female</option> 
                          <option>do not specify</option> 
                        </select><br/><br/>
                        <label className={modalLabels}>Country:</label>
                        <select 
                          className={modalInput} 
                          defaultValue={getCountryWithFlag(user.country)} 
                          onChange = {(e) => user.country = e.target.value === "???" ? e.target.value : getCountryWithoutFlag(e.target.value)}>
                          <option>???</option>{countries.map( (item) => {return <option>{item}</option>})}
                        </select><br/><br/>
                        <label className={modalLabels}>Birthday:</label>
                        <input type="date" id="bday" name="event-start"
                          className={calendarInput}
                          defaultValue={String(new Date(user.birthday).getFullYear()+'-'+('0'+(new Date(user.birthday).getMonth()+1)).slice(-2)+'-'+('0'+new Date(user.birthday).getDate()).slice(-2))}
                          min={String(new Date().getFullYear()-150+'-'+('0'+(new Date().getMonth()+1)).slice(-2)+'-'+('0'+new Date().getDate()).slice(-2))}
                          max={String(new Date().getFullYear()-10+'-'+('0'+(new Date().getMonth()+1)).slice(-2)+'-'+('0'+new Date().getDate()).slice(-2))}
                          onChange={e => user.birthday = formatDateUS(e.target.value)}>
                        </input>
                        <br/><br/>
                        <img
                        src={profileImgPreview} className='photo-in-modal'></img>
                        <br></br>
                        <input type="file" accept="image/*" onChange={e => imageHandler(e)}/>
                      </span>
                      <span>
                      <label className={modalLabels}>Status:</label>
                        <textarea defaultValue={user.status} className={modalDesc} onChange={e=>user.status=e.target.value} type="text" id="status"/><br/><br/>
                      <label className={modalLabels}>Hobbies:</label>
                        <textarea defaultValue={user.hobbies} className={modalDesc} onChange={e=>user.hobbies=e.target.value} rows="5" type="text" id="modaldesc" name="modaldesc"/><br/><br/>
                        <label className={modalLabels}>Instagram:</label>
                        <input className={modalInput} type="text" id="insta" defaultValue={user.instagram} onChange={e=>user.instagram=e.target.value}/><br/><br/>
                        <label className={modalLabels}>Facebook:</label>
                        <input className={modalInput} type="text" id="fb" defaultValue={user.facebook} onChange={e=>user.facebook=e.target.value}/><br/><br/>
                        <label className={modalLabels}>YouTube:</label>
                        <input className={modalInput} type="text" id="yt" defaultValue={user.youtube} onChange={e=>user.youtube=e.target.value}/><br/><br/>
                      </span>
                      <div>
                          <button className='modal-btn' onClick={() => {handleClose();handleSaveUserInfo();}}>Save</button><br></br>
                          <button className='modal-btn' onClick={() => {setDefaults();handleClose()}}>Cancel</button>
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
                      {<h1 className={termsTitle}>{(props?.user?.is_staff || props?.user?.id === user?.id) ? 'Confirm delete' : 'Confirm report'}</h1>}
                      {!(props?.user?.is_staff || props?.user?.id === user?.id) ? <label className={modalLabels}>Reason:</label> : null}
                        {!(props?.user?.is_staff || props?.user?.id === user?.id) ?<textarea defaultValue={reportReason} className={modalDesc} onChange={e=>setReportReason(e.target.value)} type="text" id="reason"/> :null}
                        <br/><br/>
                     </span>
                      <div>
                          <button className='modal-btn' onClick={() => {handleCloseDelete();handleDeleteOrReport(props?.user?.is_staff || props?.user?.id === user?.id)}}>Confirm</button><br></br>
                          <button className='modal-btn' onClick={handleCloseDelete}>Cancel</button>
                      </div>
                      </dialog>
                  </div>
              </Modal>
          ):null
        }
         {
          showAdminModal ? (
              <Modal id='root'>
                  <div className="deletion-dialog">
                      <dialog open className={profileDialog}>
                      <span>
                      <h1 className={termsTitle}>Confirm admin access for user&nbsp;</h1>
                     </span>
                      <div>
                          <button className='modal-btn' onClick={() => {setShowAdminModal(false);handleGiveAdminAccess(user?.id)}}>Confirm</button><br></br>
                          <button className='modal-btn' onClick={() => setShowAdminModal(false)}>Cancel</button>
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
            {props?.user ? <div className="player-edit-dropdown">
              <ul className="profile-flag">
                <li>
                  <i className="fa fa-flag profile-fa" aria-hidden="true"></i>
                  <div className="dropdown-content">
                    <a onClick={handleShowDelete}>{user?.id === props?.user?.id ? "Delete account" : props?.user?.is_staff ? "Delete user" : "Report user"}</a>
                    {props?.user?.is_staff && user?.id !== props?.user?.id && !user?.is_staff && <a onClick={() => setShowAdminModal(true)}>Give admin permissions</a>}
                  </div>
                </li>
              </ul></div> : null}
              <img
                src={user.profilephoto}
                className="profile"
              />
              <br></br>
              <br></br>
              <div className="profile-main">
                <h1 className={profileUsername}>{user.username}</h1>
                <img
                  className="profile-gender"
                  src={user.gender === "male" ? male : user.gender === "female" ? female : null}
                ></img>
              </div>
              <p className="profile-realname"> {user.fullname}</p>
              <div className="profile-desc">
                <p>{user.status}</p>
              </div>
              <div className="btn-container">
                {props.user?.id === user.id ? <button className="profile-btn" onClick={handleShow}>Edit</button> :null}
              </div>
              <hr />
              <div className="profile-container">
                <div className="content">
                  <span className="profile-span">
                    <div className="profile-grid">
                      <button className={circule}>
                        {" "}
                        <i className="fa fa-tags profile-fa"></i>
                      </button>
                      <h2 className={profileCount}>{user.achievements}</h2>
                      <p className="followers">Achievements <br></br><a href={`/achievements/${props.id}`} className="profile-links">view all</a></p>
                    </div>
                    <div className="profile-grid">
                      <button className={circule}>
                        <i className="fa fa-thumbs-up profile-fa"></i>
                      </button>
                      <h2 className={profileCount}>{user.knownfacts}</h2>
                      <p className="followers">Facts knew</p>
                    </div>
                    <div className="profile-grid">
                      <button className={circule}>
                        <i className="fa fa-thumbs-down profile-fa"></i>
                      </button>
                      <h2 className={profileCount}>{user.unknownfacts}</h2>
                      <p className="followers">
                        Facts didn't <br></br> know
                      </p>
                    </div>
                  </span>
                </div>
              </div>
            </div>
            <div className='flex-cards'>
                <div className={profileCard2}>
                    <img src={globe} height="60" width="63"></img>
                    <div className="profile-labels"></div>
                    <p className='profile-label-text'><b>Birthday:&nbsp;</b>{formatDateEU(user.birthday) ?? "???"}</p>
                    <p className='profile-label-text'><b>Age:&nbsp;</b>{ getAgeFromBday(user.birthday) ?? "???"}</p>
                    <p className='profile-label-text'><b>Country:&nbsp;</b>
                    {getCountryWithFlag(user.country)}
                    </p>
                </div>
                <div className={profileCard3}>
                    <img src={book} height="60" width="63"></img>
                    <div className="profile-labels"></div>
                    <p className='profile-label-text'><b>Hobbies and interests:&nbsp;</b>{user.hobbies}</p>
                </div>
                <div className={profileCard4}>
                    <img src={logo} height="80" width="65"></img>
                    <div className="profile-labels"></div>
                    <p className='profile-label-text'><b>Member since:&nbsp;</b><a>{formatDateEU(user.membersince)}</a></p>
                    <p className='profile-label-text'><b>Favorites({user.favorites}):&nbsp;</b><a href={`/favorites/${props.id}`} className='profile-links'>View all</a></p>
                    <hr></hr>
                    <span><img src={insta} height="60" width="60" className="profile-social-media"></img><h1 className="profile-social-media-title">Social media</h1></span>
                    <p className='profile-label-text'><b>Instagram:&nbsp;</b><a className="profile-links"href={user.instagram ?? null}>{user.instagram}</a></p>
                    <p className='profile-label-text'><b>Facebook:&nbsp;</b><a className="profile-links"href={user.facebook ?? null}>{user.facebook}</a></p>
                    <p className='profile-label-text'><b>YouTube:&nbsp;</b><a className="profile-links"href={user.youtube ?? null}>{user.youtube}</a></p>
                  
                </div>
            </div>
          </div>
          <br></br>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});

export default connect(mapStateToProps, {checkAuthenticated, loadUser})(Profile);
