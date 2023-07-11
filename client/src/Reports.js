import './css/Homepage.css';
import './css/Users.css';
import { blankspace, mainTitle, termsTitle, reportBox, reportText } from './Constants';
import React, {useState, useEffect} from "react";
import { profileDialog } from './Constants';
import { loadUser, checkAuthenticated } from "./actions/auth";
import ErrorPage from './ErrorPage';
import { connect } from "react-redux";
import Modal from './Modal';

const ReportList = (props) => {

    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [reports, setReports] = useState([]);
    const [users, setUsers] = useState([]);
    const [showDelete, setShowDelete] = useState(false);

    function getUsernameFromId(id) {
        return users.filter(user => user.id === id)
        .map(user => user.username);
    }

    function handleDeleteUser(id) {
        fetch(`/api/users/${id}/`, {
            method: 'DELETE',
            headers: {
              'Content-Type':'application/json', 
              'Authorization': `JWT ${localStorage.getItem('access')}`
            }
          })
          .then (_ => {
            fetch('/api/reports/')
            .then(response => response.json())
            .then(reports => setReports(reports))
            fetch('/api/users/')
            .then(response => response.json())
            .then(allUsers => setUsers(allUsers))
        })
    }

    function handleChangeReportStatus(id) {
        fetch(`/api/reports/${id}/`, { 
            method: 'PUT',
            body: {}
          })
          .then (_ => {
            fetch('/api/reports/')
            .then(response => response.json())
            .then(reports => setReports(reports))
          }) 
    }

    function handleDismiss(id) {
        fetch(`/api/reports/${id}/`, { 
            method: 'DELETE',
            body: {}
          })
          .then (_ => {
            fetch('/api/reports/')
            .then(response => response.json())
            .then(reports => setReports(reports))
          })
    }
    
    useEffect(() => {
        fetch('/api/reports/')
        .then(response => response.json())
        .then(reports => setReports(reports))
        fetch('/api/users/')
        .then(response => response.json())
        .then(allUsers => setUsers(allUsers))
      }, [])

    return props?.user?.is_staff ? (
        <div className={blankspace}>
            <div >
            &nbsp;&nbsp;&nbsp;&nbsp;<h1 align='center' className={mainTitle}>Reports</h1>
            <hr></hr>
            <h2 className={termsTitle}>New reports</h2>
            {
                showDelete ? (
                    <Modal id='root'>
                        <div className="deletion-dialog">
                            <dialog open className={profileDialog}>
                            <span>
                            {<h1 className={termsTitle}>Confirm delete</h1>}
                            <br/><br/>
                            </span>
                            <div>
                                <button className='modal-btn' onClick={() => {setShowDelete(false);handleDeleteUser(userIdToDelete)}}>Confirm</button><br></br>
                                <button className='modal-btn' onClick={() => setShowDelete(false)}>Cancel</button>
                            </div>
                            </dialog>
                        </div>
                    </Modal>
                ):null
            }
            <div className='container-list-users'>
            {reports.filter(report => report.status === 'New').map((item) => {return (
            <div className='user-link-wrapper'>
                <div className={reportBox} >
                    <p className={reportText}><b>Sender: </b>{getUsernameFromId(item?.sender)}</p>
                    <p className={reportText}><b>Reported user: </b>{getUsernameFromId(item?.reporteduser)}</p>
                    <p className={reportText}><b>Time: </b>{item?.reporttime.replace("T"," ").replace("Z", "")}</p>
                    <p className={reportText}><b>Reason: </b>{item?.reason}</p>
                    <button className="card-button-goto" onClick={() => {handleDismiss(item?.id)}}>Dismiss</button>
                    <button className="card-button-goto" onClick={()=> {setUserIdToDelete(item?.reporteduser);setShowDelete(true)}}>Delete user</button>
                    <button className="card-button-goto" onClick={() => {handleChangeReportStatus(item?.id)}}>Decide later</button>
                </div>
            </div>
        )}
            )}
            </div>
            <hr></hr>
            <h2 className={termsTitle}>Pending</h2>
            <div className='container-list-users'>
            {reports.filter(report => report.status === 'Pending').map((item) => {return (
            <div className='user-link-wrapper'>
                <div className={reportBox}>
                    <p className={reportText}><b>Sender: </b>{getUsernameFromId(item?.sender)}</p>
                    <p className={reportText}><b>Reported user: </b>{getUsernameFromId(item?.reporteduser)}</p>
                    <p className={reportText}><b>Time: </b>{item?.reporttime.replace("T"," ").replace("Z", "")}</p>
                    <p className={reportText}><b>Reason: </b>{item?.reason}</p>
                    <button className="card-button-goto" onClick={() => {handleDismiss(item?.id)}}>Dismiss</button>
                    <button className="card-button-goto" onClick={()=> {setUserIdToDelete(item?.reporteduser);setShowDelete(true);}}>Delete user</button>
                </div>
            </div>
        )}
            )}
            </div>
        </div>
        </div>
    ) : <ErrorPage />;
}


const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
  });
  
export default connect(mapStateToProps, { checkAuthenticated, loadUser })(ReportList);