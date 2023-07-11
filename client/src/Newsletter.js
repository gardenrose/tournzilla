import './css/Homepage.css';
import './css/Forum.css';
import './css/Misc.css';
import './css/Modal.css';
import './css/ContentCard.css';
import ContentCard from './ContentCard';
import { blankspace, filterInput, filterLabels, mainTitle, factDialog,
         termsTitle, modalLabels, modalInput, modalDesc, cardDesc } from './Constants';
import { Link } from "@reach/router";
import React, {useState, useEffect} from "react";
import {connect} from 'react-redux';
import { checkAuthenticated, loadUser } from './actions/auth';
import defaultImg from './images/tournamentImg.jpg';
import Modal from './Modal';


const News = (props) => {
  const [selected, setSelected] = useState("Newest");
  const [news, setNews] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showWarning, setShowWarning] = useState(false);
  const [createImg, setCreateImg] = useState(null);
  const [imgPreview, setImgPreview] = useState(defaultImg)
  const [wrongMsg, setWrongMsg] = useState(null)

  useEffect(() => {
    props.checkAuthenticated();
    props.loadUser();
    fetch('/api/news/')
    .then((response) => response.json())
    .then(data => {
      setNews(data.sort((a, b) => {
      return new Date(b.publishdate) - new Date(a.publishdate);
    }))})
  }, []);

  function applySort(selectedSort) {
    if (selectedSort === 'Newest') {
      setNews(news.sort((a, b) => {
        return new Date(b.publishdate) - new Date(a.publishdate);
      }))
    }
    else {
      setNews(news.sort((a, b) => {
        return (b.views + b.comments) - (a.views + a.comments);
      }))
    }
  }

  function handleWarning() {
    var wrongMsgOccured = false;
    if (document.getElementById('newstitle').value.length > 50) {
      setWrongMsg('The title is too long. (50 chars max)');
      setShowWarning(true);
      wrongMsgOccured = true;
    } 
    if (document.getElementById('newsinsert').value.length > 4000) {
      setWrongMsg('The content is too long. (4000 chars max)');
      setShowWarning(true);
      wrongMsgOccured = true;
    }
    if (document.getElementById('newstitle').value.length === 0 || document.getElementById('newsinsert').value.length === 0) {
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

  function handleAddNews() {
    const somethingWrong = handleWarning();
    const titleInput = document.getElementById('newstitle').value
    const contentInput = document.getElementById('newsinsert').value
    if (!somethingWrong && props?.user?.is_staff) {
      const formData = new FormData();
      if (createImg === undefined || createImg === null || typeof createImg === 'string') {
        formData.append('image', null)
      } else {
        formData.append('image', createImg, createImg.name)
      }
      formData.append('title', titleInput)
      formData.append('content', contentInput)
      formData.append('author', props?.user?.username)
      fetch('/api/news/', {
        method: 'post',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        body: formData })
        .then((response) => response.json())
        .then(_ => {
          setShowCreateModal(false)
          fetch('/api/news/')
          .then(response => response.json())
          .then(allNews => setNews(allNews))
        });
    }
    else {
      setShowWarning(true)
    }
  }

  function imageHandler (e) {
    const reader = new FileReader();
    reader.onload = () => {
      if(reader.readyState === 2) {
        setImgPreview(reader.result)
        setCreateImg(e.target.files[0])
      }
    }
    reader.readAsDataURL(e.target.files[0])
  };
 
  return (
    <div className={blankspace}>
      {
        showCreateModal ? (<div className="start-thread-wrapper">
          <Modal id='root'>
            <div className='start-thread-dialog'>
              <dialog open className={factDialog}>
              <span>
                <h1 className={termsTitle}>Create news post &nbsp;</h1>
                <label className={modalLabels}>News title:<label className='inline-warnings'>*</label></label>
                <input className={`${modalInput} forum-label`} required type="text" id="newstitle" name="title"/><br/><br/>
                <label className={modalLabels}>Content:<label className='inline-warnings'>*</label></label>
                <br></br>
                <textarea className={`${modalDesc} forum-desc`} id="newsinsert" required></textarea>
                <br/><br/>
                <label className={modalLabels}>Image:</label>
                <img
                src={imgPreview}
                width="220" height="140"></img><br></br>
                <input type="file" accept="image/*" className={cardDesc} onChange={e => imageHandler(e)}/>
                {showWarning ? <p className='warnings'>{wrongMsg}</p> : null}
              </span>
              <div>
                <button className='modal-btn' onClick={() => handleAddNews()}>Save</button><br/>
                <button className='modal-btn' onClick={() => setShowCreateModal(false)}>Cancel</button>
              </div>
              </dialog>
            </div>
          </Modal>
        </div>
        ) :null
      }
        <div >
        &nbsp;&nbsp;&nbsp;&nbsp;<h1 align='center' className={mainTitle}>News</h1>
        {props?.user?.is_staff ?<button className='add-btn' onClick={() => {setShowCreateModal(true);setShowWarning(false)}}>Create</button> :null}
        <span>
        &nbsp;&nbsp;&nbsp;&nbsp;<label className={props?.user?.is_staff ? filterLabels : `${filterLabels} margin-left-xl`}>Sort:</label>
          <select defaultValue={selected} className={filterInput} onChange={(e) => {setSelected(e.target.value);applySort(e.target.value)}}>
            <option>Newest</option>
            <option>Most popular</option>
          </select>     
        </span>
        <div className='container'>
        {news.map((item) => {return (
            <Link className="link-component" to={`/news/${item.id}`}>
              <ContentCard width="50"
                className='card-tournament' 
                image={item.image !== null && item.image.toLowerCase() !== 'null' ? item.image : defaultImg} 
                topic='News' 
                title={item.title}
                description={'Published ' + item.publishdate.replace('T', ' at ').replace('Z', '')}
                buttonText='Read'
                color={4}>
              </ContentCard>
            </Link>
        )}
        )}
         </div>
       </div>
    </div>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});

export default connect(mapStateToProps, {checkAuthenticated, loadUser})(News);
