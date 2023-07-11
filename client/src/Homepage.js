import './css/Homepage.css';
import './css/LightMode.css';
import './css/NavBar.css';
import Modal from './Modal';
import ContentCard from './ContentCard';
import tournamentimg from './images/tournamentImg.jpg';
import factdog from './images/factdog.jpg';
import community from './images/community_0.png';
import React, {useState, useEffect} from "react";
import {blankspace, mainTitle, mainSubtitle, termsTitle, factDialog, modalDesc} from "./Constants";
import {connect} from 'react-redux';
import {checkAuthenticated, loadUser} from './actions/auth';

const Homepage = (props) => {

  const [showFactModal, setShowFactModal] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [fact, setFact] = useState({});

  function inputValid() {
    return (document.getElementById("factinsert").value !== "") ? true : false
  }

  function handleAddFact() {
    fetch('/api/facts/create/', {
      method: 'post',
      headers: {'Content-Type':'application/json', 
                'Authorization': `JWT ${localStorage.getItem('access')}`},
      body: JSON.stringify({
           "description": document.getElementById("factinsert").value
      })
    });
    setTimeout(() => setShowNotif(false), 2000);
  }

  useEffect(() => {
    props.checkAuthenticated();
    props.loadUser();
  }, []);

  useEffect(() => {
    props.checkAuthenticated();
    props.loadUser();
    fetch('/api/facts/')
    .then((response) => response.json())
    .then(val => setFact(val[Math.floor(Math.random()*val.length)]))
  }, []);

  return (
    <div className={blankspace}>
        <div>
        {/*<NavBar/>*/}
        &nbsp;&nbsp;&nbsp;&nbsp;<h1 align='center' className={mainTitle}>TOURNZILLA</h1>
        &nbsp;&nbsp;&nbsp;&nbsp;<p align='center' className={mainSubtitle}>The tournament Godzilla - football match reporter and manager</p>
        {props.user?.is_staff ?<button className='add-btn' onClick={() => setShowFactModal(true)}>Add facts</button> :<br/>}
          <div className='container'>
          <ContentCard 
            className='card' 
            image={tournamentimg} 
            topic='TOURNAMENTS' 
            title='CURRENTLY ACTIVE'
            description='Check the most recent scores, stats and events. Champions are made when no one is watching.'
            buttonText='See more'
            url='/activematches'
            color={1}>
          </ContentCard>
          <ContentCard 
            className='card2' 
            image={factdog} 
            topic='FUN FACTS' 
            title='DID YOU KNOW?'
            description={fact.description}
            buttonText={'I knew it'}
            extraButton={true}
            buttonText2={'I had no idea'}
            color={2}
            firstBtnAction={true}
            factParams={props}
            fact={fact.id}>
          </ContentCard>
          <ContentCard
            className='card2' 
            image={community} 
            topic='COMMUNITY' 
            title='Explore this site, see its users'
            description='Welcome to the football mania community. People from all around the world belong here. Check profiles,
            see who our admins are and get to know this site better. Maybe you run into someone you already know.'
            buttonText='Check it out'
            color={3}
            url='/userlist'>
          </ContentCard>
        </div>

      <div className="modal-wrapper">
          {
              showFactModal ? (
                  <Modal id='root'>
                      <div className="fact-modal-dialog">
                          <dialog open className={factDialog}>
                          <span>
                            <h1 className={termsTitle}>Insert your fact &nbsp;</h1>
                            <textarea className={modalDesc} id="factinsert"></textarea>
                          </span>
                          <div>
                              <button className='modal-btn' onClick={() => {if (inputValid()) {setShowFactModal(false);setShowNotif(true);handleAddFact()}}}>Save</button><br/>
                              <button className='modal-btn' onClick={() => setShowFactModal(false)}>Cancel</button>
                          </div>
                          </dialog>
                      </div>
                  </Modal>
              ):null
            }
          </div>
          <div className="modal-wrapper">
          {
              showNotif ? (
                  <Modal id='root'>
                      <div className="fact-modal-dialog">
                          <dialog open className={factDialog}>
                          <span>
                            <h2 className={termsTitle}>Fact is successfully added.</h2>
                          </span>
                          </dialog>
                      </div>
                  </Modal>
              ):null
            }
          </div>
       </div>
    </div>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});

export default connect(mapStateToProps, {checkAuthenticated, loadUser})(Homepage);
