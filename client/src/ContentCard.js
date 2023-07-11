import { cardDesc, cardDesign, cardTitle, factDialog, modalLabels, termsTitle } from './Constants';
import './css/ContentCard.css';
import React, {useState, useEffect} from "react";
import './css/LightMode.css';
import Modal from "./Modal";
import { navigate } from '@reach/router';

function ContentCard({
  image, topic, title, description, 
  buttonText, color, extraButton=false, 
  buttonText2=null, firstBtnAction=false, 
  factParams=null, bin=false, url='', 
  userid=null, teamid=null, isTournament=false}) {

  const [showFactModal, setShowFactModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [favs, setFavs] = useState([]);
  const handleCloseFactModal = () => setShowFactModal(false);
  const handleShowFactModal = () => setShowFactModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const [factMessage, setFactMessage] = useState("");
  const [factTitle, setFactTitle] = useState("");
  const factMsg1 = "You have the knowledge, well done!";
  const factMsg2 = "No shame, you learned something new.";

  useEffect(() => {
    fetch(`/api/favorites/${userid}/`)
      .then(response => response.json())
      .then(data => setFavs(data))
  }, []);

  function factsCheck(title, message, knew) {
    setFactMessage(message);
    setFactTitle(title);
    setShowFactModal(handleShowFactModal);
    document.getElementById("positive-btn").style.display="none";
    document.getElementById("negative-btn").style.display="none";
    if (factParams.user?.id) {
      const formData = new FormData();
      knew ? formData.append("knownfacts", factParams.user.knownfacts+1) : formData.append("unknownfacts" , factParams.user.unknownfacts+1)
      if (knew && factParams.user?.knownfacts === 4) {
        const formData2 = new FormData()
        formData2.append("achievementid", 4)
        fetch(`/api/userachievements/${factParams.user?.id}/`, {
          method: 'POST',
          headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`
          },
          body: formData2
        })
      } else if (!knew && factParams.user?.unknownfacts === 4) {
        const formData3 = new FormData()
        formData3.append("achievementid", 5)
        fetch(`/api/userachievements/${factParams.user?.id}/`, {
          method: 'POST',
          headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`
          },
          body: formData3
        })
      }
        fetch(`/api/users/${factParams.user?.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        body: formData
      })
    }
    //console.log(factParams.user)
  }

  function handleDeleteTeam() {
    fetch(`/api/teams/${teamid}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type':'application/json', 
        'Authorization': `JWT ${localStorage.getItem('access')}`
      }
    })
    .then(handleCloseDeleteModal)
    .then(() => window.location.reload())
  }

  function handleDeleteTournament() {
    fetch(`/api/tournaments/${teamid}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type':'application/json', 
        'Authorization': `JWT ${localStorage.getItem('access')}`
      }
    })
    .then(handleCloseDeleteModal)
    .then(() => window.location.reload())
  }

  function handleFavorites() {
    console.log(document.getElementById("negative-btn").innerText)
    if (favs.filter(x => x.id === teamid).length > 0) {
      fetch(`/api/favorites/${userid}/${teamid}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type':'application/json', 
          'Authorization': `JWT ${localStorage.getItem('access')}`
        }
      })
    } else {
      if (favs.length === 0) {
        const fData = new FormData()
        fData.append('achievementid', 6)
        fetch(`/api/userachievements/${userid}/`, {
          method: 'POST',
          headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`
          },
          body: fData
        })
      }
      fetch(`/api/favorites/${userid}/`, {
        method: 'POST',
        headers: {
          'Content-Type':'application/json', 
          'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        body: JSON.stringify({"userid":userid, "teamid": teamid})
      })
      window.location.reload()
    }
  }

  return (
    <div>
    <div className={cardDesign}>
      <div className="card-header">
        <img src={image} />
      </div>
      <div className="card-body">
        <span>
          <span className={"tag tag-border"+color}>{topic}</span>
          { bin ? <button className="bin-btn" onClick={handleShowDeleteModal} disabled={showDeleteModal}><i className="fa fa-trash-o" aria-hidden="true"></i></button> :null}
        </span>
        <h4 className={cardTitle}>{title}</h4>
        <p className={cardDesc}>{description}</p>
        {buttonText 
        ?<div className="card-goto">
          <button className={
            extraButton ?"card-button-positive" :"card-button-goto"} 
            onClick={() => extraButton ? firstBtnAction && factParams ? factsCheck("Good", factMsg1, true) : navigate(url) :navigate(url)} 
            id={extraButton ?"positive-btn" :null}>
            {buttonText}
          </button>
          {extraButton 
            ?<button id="negative-btn" className="card-button-negative" onClick={() => firstBtnAction ? factParams ? factsCheck("New info", factMsg2, false) : handleFavorites() : null}>
              {userid && teamid && !factParams ? favs.filter(x => x.id === teamid).length > 0 ? "Unfavorize" : "Favorize" : buttonText2}
            </button> 
            :null}
        </div>
        :null}
      </div>

      <div className="modal-wrapper">
        { showFactModal ? (
              <Modal id='root'>
                  <div className="fact-modal-dialog">
                      <dialog open className={factDialog}>
                      <span>
                        <h1 className={termsTitle}>{factTitle}</h1>
                        <label className={modalLabels}>{factMessage}</label>
                      </span>
                      <div>
                          <button className='modal-btn' onClick={handleCloseFactModal}>Close</button><br></br>
                      </div>
                      </dialog>
                  </div>
              </Modal>
          ) : null
        }
      </div>

      <div className="modal-wrapper">
      { showDeleteModal ? (
              <Modal id='root'>
                  <div className="deletion-dialog">
                      <dialog open className={factDialog}>
                      <span>
                        <h1 className={termsTitle}>Confirm delete</h1>
                        <label className={modalLabels}>{factMessage}</label>
                      </span>
                      &nbsp;&nbsp;&nbsp;
                      <div>
                        <button className='modal-btn' onClick={() => isTournament ?handleDeleteTournament() :handleDeleteTeam()}>Delete</button><br></br>
                        <button className='modal-btn' onClick={handleCloseDeleteModal}>Cancel</button><br></br>
                      </div>
                      </dialog>
                  </div>
              </Modal>
          ) : null
        }
      </div> 
    </div>
    </div>
  );
}

export default ContentCard;
