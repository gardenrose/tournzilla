import './css/Homepage.css';
import './css/LightMode.css';
import './css/NavBar.css';
import './css/TermsConditions.css';
import './css/ContentCard.css';
import './css/Profile.css';
import './css/Misc.css';
import React, { useEffect, useState } from "react";
import {blankspace, forumIcons, newsText, contactSubtitle, 
        commentInput, newsComment, termsTitle, factDialog,
        modalLabels, modalInput, modalDesc } from "./Constants";
import { connect } from "react-redux";
import { loadUser, checkAuthenticated } from "./actions/auth";
import { navigate } from "@reach/router";
import Modal from './Modal';
import ErrorPage from './ErrorPage';


function ForumPost (props) {

  const [post, setPost] = React.useState({})
  const [users, setUsers] = useState([])
  const [comments, setComments] = useState([]);  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [showEditCommentModal, setShowEditCommentModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null)
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseEditPostModal = () => setShowEditPostModal(false);
  const handleShowEditPostModal = () => setShowEditPostModal(true);
  const [pageError, setError] = useState(false)
  const [showWarning, setShowWarning] = useState(false);  
  const [wrongMsg, setWrongMsg] = useState(null)

  function postComment() {
    const commContent = document.getElementById('comment-area').value
    if (props.user && commContent !== '') {

      fetch(`/api/forumcomments/${props.id}/`, {
        method: 'POST',
        headers: {
          'Content-Type':'application/json', 
          'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        body: JSON.stringify({"author":props.user.username, "content": commContent})
      }).then(_ => fetch(`/api/forum/${props.id}/`, { 
        method: 'PUT',
        headers:{
          'Content-Type':'application/json'},
        body: JSON.stringify({comments:post.comments+1})
      }))
      . then(_ => loadState())
      . then (_ => loadComments()). then (_ => document.getElementById('comment-area').value = '')
    }
  }

  function loadState() {
    fetch(`/api/forum/${props.id}/`)
    .then(response => {if (response.status === 500) {
      setError(true);
    } else {
      return response.json();
    }})
    .then(forumpost => {
      setPost(forumpost)
      console.log("updating views...")
      fetch(`/api/forum/${props.id}/`, { 
        method: 'PUT',
        headers:{
          'Content-Type':'application/json'},
        body: JSON.stringify({views:forumpost.views+1})
      })
      fetch(`/api/users/`)
      .then(response => response.json())
      .then(usrs => setUsers(usrs))
    })
  }

  function loadComments() {
    fetch(`/api/forumcomments/${props.id}/`)
    .then(response => response.json())
    .then(comms => {console.log(comms);setComments(comms)})
  }

  function deletePost() {
    fetch(`/api/forumcomments/${props.id}/`, {method: 'DELETE',  headers: {
      'Content-Type':'application/json', 
      'Authorization': `JWT ${localStorage.getItem('access')}`
    }}).then(fetch(`/api/forum/${props.id}/`, {method: 'DELETE',  headers: {
      'Content-Type':'application/json', 
      'Authorization': `JWT ${localStorage.getItem('access')}`
    }}))
    .then(_ => navigate(-1))
    handleCloseDeleteModal;
  }

  function deleteComment(commentId) {
    fetch(`/api/forumcomments/${props.id}/${commentId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type':'application/json', 
        'Authorization': `JWT ${localStorage.getItem('access')}`
      }
    })
    .then(_ => fetch(`/api/forum/${props.id}/`, { 
      method: 'PUT',
      headers:{
        'Content-Type':'application/json'},
      body: JSON.stringify({comments:post.comments-1})
    }))
    .then(_ => loadState())
    .then (_ => loadComments())
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
      console.log("this")
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

  function handleEditDiscussion() {
    setShowWarning(false)
    const ttl = document.getElementById('topictitle').value
    const cntnt = document.getElementById('discussioninsert').value
    if (!handleWarning()) {
      fetch(`/api/forum/${props.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type':'application/json', 
          'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        body: JSON.stringify({title:ttl, content:cntnt})
    }).then(_ => loadState()).then(handleCloseEditPostModal)
    }
  }

  function editComment(id) {
    const commentContent = document.getElementById('commentinsert').value
    if (commentContent !== '') {
      fetch(`/api/forumcomments/${props.id}/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type':'application/json', 
          'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        body: JSON.stringify({content: commentContent})
      }).then(_ => loadComments()).then(setShowEditCommentModal(false))
    } 
  }

  function seeUserProfile(username) {
    navigate(`/userlist/${users.filter(x => x.username === username)[0].id}`)
  }

  useEffect(() => {
    loadState()
  }, []);

  useEffect(() => {
    loadComments()
  }, []);

  return pageError ? <ErrorPage /> 
    :(<div className={blankspace}>
      <div>
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
                        <button className='modal-btn' onClick={() => deletePost()}>Delete</button><br></br>
                        <button className='modal-btn' onClick={handleCloseDeleteModal}>Cancel</button><br></br>
                      </div>
                      </dialog>
                  </div>
              </Modal>
          ) : null
        }
        {
          showEditPostModal ? (<div className="start-thread-wrapper">
            <Modal id='root'>
              <div className='start-thread-dialog'>
                <dialog open className={factDialog}>
                <span>
                  <h1 className={termsTitle}>Edit your post &nbsp;</h1>
                  <label className={modalLabels}>Topic title:</label>
                  <input className={`${modalInput} forum-label`} defaultValue={post.title} required type="text" id="topictitle" name="title"/><br/><br/>
                  <textarea className={`${modalDesc} forum-desc`} defaultValue={post.content} id="discussioninsert" required></textarea>
                </span>
                <div>
                    <button className='modal-btn' onClick={() => handleEditDiscussion()}>Save</button><br/>
                    <button className='modal-btn' onClick={handleCloseEditPostModal}>Cancel</button>
                    {showWarning ? <p className='warnings'>{wrongMsg}</p> : null}
                </div>
                </dialog>
              </div>
            </Modal>
          </div>
          ):null}
        {
          showEditCommentModal ? (<div className="start-thread-wrapper">
            <Modal id='root'>
              <div className='start-thread-dialog'>
                <dialog open className={factDialog}>
                <span>
                  <h1 className={termsTitle}>Edit your comment &nbsp;</h1>
                  <textarea className={`${modalDesc} forum-desc`} defaultValue={selectedComment.content} id="commentinsert" required></textarea>
                </span>
                <div>
                    <button className='modal-btn' onClick={() => editComment(selectedComment.id)}>Save</button><br/>
                    <button className='modal-btn' onClick={() => setShowEditCommentModal(false)}>Cancel</button>
                </div>
                </dialog>
              </div>
            </Modal>
          </div>
          ):null 
        }
      </div> 
        <button className='card-button-goto margin-top-s margin-left-s' onClick={()=>navigate(-1)}>Back</button>&nbsp;&nbsp;
        {props?.user?.username === post.author ? <button className='card-button-positive' onClick={handleShowEditPostModal}>Edit</button> : null}
        {props?.user?.is_staff || props?.user?.username === post.author ? <button className='card-button-negative' onClick={handleShowDeleteModal}>Delete</button> :null}
        <span className='title-and-photo'>
          <h1 align='center' className={termsTitle}>{post.title}</h1>
          <img className='circule' src={users?.filter(x=>x.username === post.author)[0]?.profilephoto}></img>
        </span>
        <span>
        <p className={newsText} align="center">
          <b>Published:</b> {post.publishdate?.replace('T', ' at ').replace('Z', '')},
          <b> Author:</b> {post.author}
        </p>
        <span className={`${forumIcons} centered`}>
          <i className="fa fa-eye" aria-hidden="true"></i><p>{post.views} views</p>
          <i className="fa fa-comment" aria-hidden="true"></i><p>{comments.length} comments</p>
        </span>

        </span>
        <p className={newsText}>{post.content}</p>
        </div>
        <br></br>
        <hr></hr>
        <span className='baseline'>
          <h1 className={contactSubtitle}>Comments({comments.length})</h1>
          {props?.user ? null :<button className='card-button-goto' onClick={() => navigate('/login')}>Login to comment</button>}
        </span>
        <textarea hidden={!props?.user} id="comment-area" className={commentInput} rows="5"></textarea><br/>
        <button hidden={!props?.user} className='btn-post margin-bottom-m' onClick={() => postComment()}>Post</button>
        <br />
        {comments.map((item) => {return (
          <div className='flex-containerr'>
            <div className={newsComment}>
            <p>
              <a className='pointer' onClick={() => seeUserProfile(item.author)}>{item.author}
                <i className="fa fa-clock-o comment-time" aria-hidden="true">&nbsp;{item.publishdate.replace('T', ' at ').replace('Z', ' ')}</i>
              </a>
              <span className='bin-btn-container'>
                {props?.user?.username.toLowerCase() === item.author.toLowerCase() ? <button className="bin-forum" onClick={() => {setSelectedComment(item);setShowEditCommentModal(true)}} disabled={false}><i className="fa fa-pencil" aria-hidden="true"></i></button> : null}
                {(props?.user?.is_staff || props?.user?.username?.toLowerCase() === item.author.toLowerCase()) ? <button className="bin-forum" onClick={() =>deleteComment(item.id)} disabled={false}><i className="fa fa-trash-o" aria-hidden="true"></i></button> : null}
              </span>
              <p>{item.content}</p>
            </p>
          
          </div>
        </div>
        )}
        )}
       <br></br><br></br><br></br><br></br>
    </div>
);
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
  });
  
export default connect(mapStateToProps, {checkAuthenticated, loadUser})(ForumPost);
  