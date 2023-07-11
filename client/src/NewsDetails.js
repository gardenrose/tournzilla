import './css/Homepage.css';
import './css/LightMode.css';
import './css/NavBar.css';
import './css/TermsConditions.css';
import './css/ContentCard.css';
import React, { useEffect, useState } from "react";
import {blankspace, mainTitle, newsText, contactSubtitle, commentInput, newsComment,
   forumIcons, factDialog, modalDesc, termsTitle, modalLabels, modalInput, cardDesc} from "./Constants";
import { checkAuthenticated, loadUser } from './actions/auth';
import defaultImg from './images/tournamentImg.jpg';
import Modal from './Modal';
import {connect} from 'react-redux';
import { navigate } from '@reach/router';
import ErrorPage from './ErrorPage';

const NewsDetails = (props) => {

  const [post, setPost] = useState({})
  const [createNewsState, setCreateNewsState] = useState(post)
  const [users, setUsers] = useState([])
  const [comments, setComments] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [wrongInputMsg, setWrongInputMsg] = useState(undefined);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [showEditCommentModal, setShowEditCommentModal] = useState(false);
  const [pageError, setError] = useState(false)
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseEditPostModal = () => setShowEditPostModal(false);  
  const [imagePreview, setImgPreview] = useState(post.image);
  const [showWarning, setShowWarning] = useState(false);
  const [wrongMsg, setWrongMsg] = useState(null)

  function loadState() {
    fetch(`/api/news/${props.id}/`)
    .then(response => {if (response.status === 500) {
      setError(true);
    } else {
      return response.json();
    }})
    .then(newsDetails => {
      if (newsDetails) {
        setPost(newsDetails)
        const formdata = new FormData()
        formdata.append("views", newsDetails.views+1)
        fetch(`/api/news/${props.id}/`, { 
          method: 'PUT',
          body: formdata
        })
        fetch(`/api/users/`)
        .then(response => response.json())
        .then(usrs => setUsers(usrs))
      }
    })
  }

  function loadComments() {
    fetch(`/api/newscomments/${props.id}/`)
    .then(response => response.json())
    .then(comms => setComments(comms))
  }

  function postComment() {
    const commContent = document.getElementById('comment-area').value
    if (props.user && commContent !== '') {
      fetch(`/api/newscomments/${props.id}/`, {
        method: 'POST',
        headers: {
          'Content-Type':'application/json', 
          'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        body: JSON.stringify({"author":props.user.username, "content": commContent})
      }).then(_ => fetch(`/api/news/${props.id}/`, { 
        method: 'PUT',
        headers:{
          'Content-Type':'application/json'},
        body: JSON.stringify({comments:post.comments+1})
      }))
      . then(_ => loadState())
      . then (_ => loadComments()). then (_ => document.getElementById('comment-area').value = '')
      let alreadyCommented = false
      fetch('/api/news/')
      .then((response) => response.json())
      .then(data => {
        data.map(newss => {
          fetch(`/api/newscomments/${newss.id}/`)
          .then(response2 => response2.json())
          .then(comms => comms.map(x => {
            if (x.author === props?.id?.username) {
              alreadyCommented = true
            }
          }))
        })
      })
      if (!alreadyCommented) {
        const fData = new FormData()
        fData.append('achievementid', 7)
        fetch(`/api/userachievements/${props?.user?.id}/`, {
          method: 'POST',
          headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`
          },
          body: fData
        })
      }
    }
  }

  function seeUserProfile(username) {
    navigate(`/userlist/${users.filter(x => x.username === username)[0].id}`)
  }

  function deletePost() {
    fetch(`/api/newscomments/${props.id}/`, {method: 'DELETE',  headers: {
      'Content-Type':'application/json', 
      'Authorization': `JWT ${localStorage.getItem('access')}`
    }}).then(fetch(`/api/news/${props.id}/`, {method: 'DELETE',  headers: {
      'Content-Type':'application/json', 
      'Authorization': `JWT ${localStorage.getItem('access')}`
    }}))
    .then(_ => navigate(-1))
    handleCloseDeleteModal;
  }

  function editComment(id) {
    const commentContent = document.getElementById('commentinsert').value
    if (commentContent !== '') {
      fetch(`/api/newscomments/${props.id}/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type':'application/json', 
          'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        body: JSON.stringify({content: commentContent})
      }).then(_ => loadComments()).then(setShowEditCommentModal(false))
    } 
  }

  function setDefaults() {
    setWrongInputMsg(undefined);
    setCreateNewsState(post);
  }

  function imageHandler (e) {
    const reader = new FileReader();
    reader.onload = () => {
      if(reader.readyState === 2) {
        setImgPreview(reader.result)
        setCreateNewsState({...createNewsState, image: e.target.files[0]})
      }
    }
    reader.readAsDataURL(e.target.files[0])
  };

  function handleWarning() {
    var wrongMsgOccured = false;
    if (document.getElementById('topictitle').value.length > 50) {
      setWrongMsg('The title is too long. (50 chars max)');
      setShowWarning(true);
      wrongMsgOccured = true;
    } 
    if (document.getElementById('discussioninsert').value.length > 4000) {
      setWrongMsg('The content is too long. (4000 chars max)');
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

  function handleEditPost () {
    const somethingWrong = handleWarning()
    const formData = new FormData();
    const topictitle = document.getElementById('topictitle').value
    const topiccontent = document.getElementById('discussioninsert').value
    if (props?.user && !somethingWrong) {
      createNewsState.title = topictitle
      createNewsState.content = topiccontent
      //setCreateNewsState({...createNewsState, title: topictitle, content:topiccontent})
      formData.append('content', topiccontent)
      formData.append('title', topictitle)
      if (createNewsState.image === undefined || createNewsState.image === null || typeof createNewsState.image === 'string') {
        setCreateNewsState({...createNewsState, image: defaultImg})
        formData.append('image', createNewsState['image'])
      }
      else {
        formData.append('image', createNewsState['image'], createNewsState['image'].name)
      }
      fetch(`/api/news/${props.id}/`, {
        method: 'put',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        body: formData 
      })
        .then((response) => response.json())
        .then((data) => {
          setWrongInputMsg(data?.message)
          if (!data?.message) {
            setShowModal(false)
            fetch(`/api/news/${props.id}`)
            .then(response => response.json())
            .then(nws => setPost(nws))
          }
      });
      fetch(`/api/news/${props.id}/`)
      .then(response => response.json())
      .then(theNews => {
        setPost(theNews);
        setCreateNewsState(theNews);
        setImgPreview(theNews.image);
      }).then (_ => setShowEditPostModal(false))
      .then(_ => loadState())
    }
    
  }

  function deleteComment(commentId) {
    fetch(`/api/newscomments/${props.id}/${commentId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type':'application/json', 
        'Authorization': `JWT ${localStorage.getItem('access')}`
      }
    })
    .then(_ => fetch(`/api/news/${props.id}/`, { 
      method: 'PUT',
      headers:{
        'Content-Type':'application/json'},
      body: JSON.stringify({comments:post.comments-1})
    }))
    .then(_ => loadState())
    .then (_ => loadComments())
  }

  useEffect(() => {
    loadState()
  }, []);

  useEffect(() => {
    loadComments()
  }, []);

  return pageError ? <ErrorPage /> 
  : (
    <div className={blankspace}>
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
                  <br/>
                  <span>
                    <label className={modalLabels}>Image:</label>
                    <img
                      src={imagePreview ?? defaultImg}
                      width="220" height="140"></img><br></br>
                    <input type="file" accept="image/*" className={cardDesc} onChange={e => imageHandler(e)}/>
                </span>
                </span>
                <div>
                    <button className='modal-btn' onClick={() => handleEditPost()}>Save</button><br/>
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
        {post?.image !== null && post?.image?.toLowerCase() !== 'null' ? <img className="news-photo" src={post?.image}></img> : null}
        <p className={newsText} align="center">Published: {post.publishdate?.replace('T', ' at ').replace('Z', '')} by {post.author}</p>
        <span className={`${forumIcons} centered`}>
          <i className="fa fa-eye" aria-hidden="true"></i><p>Views: {post.views}</p>
          <i className="fa fa-comment" aria-hidden="true"></i><p>Comments: {comments.length}</p>
        </span>
        <span className='upper-buttons'>
          <button className='card-button-goto' onClick={() => navigate(-1)}>Back</button>&nbsp;&nbsp;
          {props?.user?.is_staff ? <button className='card-button-positive' onClick={() => {setDefaults();setShowEditPostModal(true)}}>Edit</button> :null}
          {props?.user?.is_staff ? <button className='card-button-negative' onClick={handleShowDeleteModal}>Delete</button> :null}
        </span>
        <h1 align='center' className={mainTitle}>{post.title}</h1>
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

export default connect(mapStateToProps, {checkAuthenticated, loadUser})(NewsDetails);
