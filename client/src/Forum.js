import './css/Homepage.css';
import './css/Forum.css';
import './css/Misc.css';
import './css/Modal.css';
import { forumUserLink, blankspace, mainTitle, factDialog, modalLabels, modalInput, modalDesc, filterInput, termsTitle, rankHeading, forumIcons, filterLabels } from './Constants';
import { navigate } from "@reach/router";
import React, {useState, useEffect} from "react";
import Modal from './Modal';
import {connect} from 'react-redux';
import { checkAuthenticated, loadUser } from './actions/auth';


const Forum = (props) => {
  const [discussions, setDiscussions] = useState([])
  const [filteredDiscussions, setFilteredDiscussions] = useState([])
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [selected, setSelected] = useState("All");
  const [showWarning, setShowWarning] = useState(false);  
  const [wrongMsg, setWrongMsg] = useState(null)

  useEffect(() => {
    props.checkAuthenticated();
    props.loadUser();
    fetch('/api/forum/')
    .then((response) => response.json())
    .then(data => {
      setDiscussions(data)
      setFilteredDiscussions(data)})
  }, []);

  function transformDatetime(dt) {
    return dt.toString().replace("T"," ").replace("Z", "");
  }
  
  function handleAddDiscussion() {
    const forumPost = JSON.stringify({
      author: props.user.username,
      title: document.getElementById("topictitle").value,
      content: document.getElementById("discussioninsert").value
    })
    
    if (!handleWarning()) {
      fetch('/api/forum/', {
        method: 'post',
        headers: {'Content-Type':'application/json','Authorization': `JWT ${localStorage.getItem('access')}`},
        body: forumPost
     }).then(_ => {
      fetch('/api/forum/')
        .then((response) => response.json())
        .then(data => {
          setDiscussions(data)
          setFilteredDiscussions(data.sort((a, b) => {
            return new Date(b.publishdate) - new Date(a.publishdate);
          }))
        });
     });

      let alreadyPosted = false
      discussions.map(dis => {
        if (dis.author === props?.user?.username) {
          alreadyPosted = true
        }
      })
      if (!alreadyPosted) {
        const fData = new FormData()
        fData.append('achievementid', 8)
        fetch(`/api/userachievements/${props?.user?.id}/`, {
          method: 'POST',
          headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`
          },
          body: fData
        })
      }
      setShowAddModal(false);
      setShowNotif(true);
    }
    setTimeout(() => setShowNotif(false), 2000);
  }

  function seeUserDetails(username) {
    fetch(`/api/users/`)
    .then((response) => response.json())
    .then(users => {
      var filtered = users.filter(attr => attr.username === username)
      console.log(filtered)
      if (filtered.length > 0) {
        navigate(`/userlist/${filtered[0]?.id}`)
      }
    })
  }

  function applySort(selectedSort) {
    if (selectedSort === 'Newest') {
      setFilteredDiscussions(filteredDiscussions.sort((a, b) => {
        return new Date(b.publishdate) - new Date(a.publishdate);
      }))
    }
    else {
      setFilteredDiscussions(filteredDiscussions.sort((a, b) => {
        return (b.views + b.comments) - (a.views + a.comments);
      }))
    }
  }

  function handleWarning() {
    var wrongMsgOccured = false;
    if (document.getElementById('topictitle').value.length > 100) {
      setWrongMsg('The title is too long. (100 chars max)');
      setShowWarning(true);
      wrongMsgOccured = true;
    } 
    if (document.getElementById('discussioninsert').value.length > 1500) {
      setWrongMsg('The content is too long. (1500 chars max)');
      setShowWarning(true);
      wrongMsgOccured = true;
    }
    if (document.getElementById('topictitle').value.length === 0 || document.getElementById('discussioninsert').value.length === 0) {
      setWrongMsg('Fill all the required fields.');
      setShowWarning(true)
      wrongMsgOccured = true;
    }
    if (!wrongMsgOccured) {
      setShowWarning(false);
      setWrongMsg(null)
    }
    return wrongMsgOccured;
  }

  function applyFilter(selectedFilter) {
    if (selectedFilter === 'All') {
      setFilteredDiscussions(discussions)
    } else if (selectedFilter === 'Mine' && props?.user) {
      setFilteredDiscussions(discussions.filter(x => x.author.toLowerCase() === props.user.username.toLowerCase()))
    } else if (selectedFilter === 'By others') {
      setFilteredDiscussions(discussions.filter(x => x.author.toLowerCase() !== props.user.username.toLowerCase()))
    }
  }
  
  return (
    <div className={blankspace}>
        {
          showAddModal ? (<div className="start-thread-wrapper">
            <Modal id='root'>
              <div className='start-thread-dialog'>
                <dialog open className={factDialog}>
                <span>
                  <h1 className={termsTitle}>Start a new forum thread &nbsp;</h1>
                  <label className={modalLabels}>Topic title:</label>
                  <input className={`${modalInput} forum-label`} required type="text" id="topictitle" name="title"/><br/><br/>
                  <textarea className={`${modalDesc} forum-desc`} id="discussioninsert" required></textarea>
                </span>
                <div>
                    <button className='modal-btn' onClick={() => handleAddDiscussion()}>Save</button><br/>
                    <button className='modal-btn' onClick={() => setShowAddModal(false)}>Cancel</button>
                    {showWarning ? <p className='warnings'>{wrongMsg}</p> : null}
                </div>
                </dialog>
              </div>
            </Modal>
          </div>
          ):null}
          <div className="modal-wrapper">
          {
              showNotif ? (
                  <Modal id='root'>
                      <div className="discuss-modal-dialog">
                          <dialog open className={factDialog}>
                          <span>
                            <h2 className={termsTitle}>Discussion is added successfully.</h2>
                          </span>
                          </dialog>
                      </div>
                  </Modal>
              ):null
            }
          </div>
        &nbsp;&nbsp;&nbsp;&nbsp;<h1 align='center' className={mainTitle}>Forum</h1>
        {props.user ? <button className='add-btn' onClick={() => {setShowWarning(false);setShowAddModal(true)}}>Start discussion</button> :null}
        <span>
          <label className={`${filterLabels} margin-left-xl`}>Sort:</label>
          <select defaultValue={selected} className={filterInput} onChange={(e) => {setSelected(e.target.value);applySort(e.target.value)}}>
            <option>Newest</option>
            <option>Most popular</option>
          </select>     
          {props?.user?.is_staff ? <>&nbsp;&nbsp;&nbsp;&nbsp;<label className={filterLabels}>Filter:</label>
          <select defaultValue={selected} className={filterInput} onChange={(e) => {setSelected(e.target.value);applyFilter(e.target.value)}}>
            <option>All</option>
            <option>Mine</option>
            <option>By others</option>
          </select></> : null}  
        </span>   
        <br></br>
        <div>
        {filteredDiscussions.sort(function(a,b){ return new Date(b.date) - new Date(a.date);}).map((item) => {return (
          <div>
              <hr />
              <div className='forum-card'>
                
              <span className='discussion-flex'>
            <div className="link-component" to={`/forum/${item.id}`} onClick={() => navigate(`/forum/${item.id}`)}>
                <h2 className={rankHeading}>{item.title}</h2>
            </div>
                <button onClick={()=>navigate(`/forum/${item.id}`)} className='card-button-goto'>Read</button>
                <p className={forumIcons}>Author: &nbsp;
                  <a className={forumUserLink} onClick={() => seeUserDetails(item.author)}>{item.author}</a>
                  , published: {transformDatetime(item.publishdate)}
                  </p>
                <span className={forumIcons}>
                  <i className="fa fa-eye" aria-hidden="true"></i><p>{item.views} views</p>
                  <i className="fa fa-comment" aria-hidden="true"></i><p>{item.comments} comments</p>
                </span>
              </span>
              </div>
              </div>
          )}
        )}
         </div>
        <br/><br/>
    </div>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});

export default connect(mapStateToProps, {checkAuthenticated, loadUser})(Forum);
