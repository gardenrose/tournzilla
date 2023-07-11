import './css/ContentCard.css';
import React, {useEffect, useState} from "react";
import './css/Formation.css';
import './css/Formation451.css';
import './css/Formation442.css';
import './css/Modal.css';
import './css/ContentCard.css';
import Modal from './Modal';
import { profileDialog, modalLabels, modalInput, formations, f4231, f451, f442, updateCustomFormation } from './Constants';
import { connect } from 'react-redux';
import { loadUser, checkAuthenticated } from "./actions/auth";

import formation from "./images/formationimg.svg.png";

const Formation = ({isLeftSide=false, onClose, teamid, matchid, players, matchdatetime}) => {
    const [showChangeWindow, setShowChangeWindow] = useState(false);
    const [positionNames, setPositionNames] = useState([]);
    const [formationData, setFormationData] = useState({})
    const [type, setType] = useState('4-2-3-1');

    function changeFormation() {
        let formationChecker = []
        for (const key in formationData) {
            if (key.includes('jersey')) {
                if (formationData[key].includes(' (preferred)')) {
                    formationChecker.push(formationData[key].replace(' (preferred)',''));
                } else {
                    formationChecker.push(formationData[key]);
                }
            }
          }
        let found = false
        const encountered = new Set();
        let playerIDs = []
        for (let i = 0; i < formationChecker.length; i+=1) {
            if (encountered.has(formationChecker[i])) {
                found = true;
                break;
            } else {
                let nameOnly = formationChecker[i]
                if (formationChecker[i].includes(' (preferred)')) {
                    nameOnly = formationChecker[i].replace(' (preferred)', '')
                }
                encountered.add(nameOnly);
                playerIDs.push(players.filter(x => x.jerseyname === nameOnly.replace(/^\d+\s+/, '').replace(" (preferred)",""))[0]?.id)
            }
        }
        if (!found) {
            setShowChangeWindow(false);
            fetch(`/api/formations/${matchid}/${formationData.id}/`,{
                method: 'PUT',
                headers: { 
                  'Authorization': `JWT ${localStorage.getItem('access')}`
                },
                body: updateCustomFormation(teamid, formationData, playerIDs, type)
              })
        }
    }

    useEffect(() => {
        fetch(`/api/formations/${matchid}/`)
        .then(rsp => rsp.json())
        .then(data => {
            if (formationData) {
                setType(data?.formationtype)
                console.log(data.filter(arr => arr.matchid === matchid && arr.teamid === teamid)[0])
                setFormationData(data.filter(arr => arr.matchid === matchid && arr.teamid === teamid)[0])
            }
        })
    }, [])

    useEffect(() => {
        setPositionNames(Object.values(type === '4-2-3-1' ? f4231 : type === '4-5-1' ? f451 : f442));
    }, [type])

    useEffect(() => {
        if (formationData) {
            setType(formationData?.formationtype);
        }
    }, [formationData])

    return (
        <div className='deletion-dialog'>
            {
                showChangeWindow ? (
                    <Modal id='root'>
                        <div className="deletion-dialog deletion-dialog4">
                            <dialog open className={profileDialog}>
                            <span>
                                <label className={modalLabels}>Formation type:</label>
                                <select className={modalInput} defaultValue={type} onChange = {(e) => setType(e.target.value)}>
                                    {formations.map( (item) => {return <option>{item}</option>})}
                                </select><br/><br/>
                                <label className={modalLabels}>{positionNames[0]}</label>
                                <select className={modalInput} onChange={(e) => formationData.jersey1 = e.target.value} value={formationData?.jersey1}>
                                    {players.map( (item) => {return <option>{item.jerseynumber + " " + item.jerseyname} {item.position === positionNames[0] ? "(preferred)" : ""}</option>})}
                                </select><br/><br/>
                                <label className={modalLabels}>{positionNames[1]}</label>
                                <select className={modalInput}onChange={(e) => formationData.jersey2 = e.target.value} value={formationData?.jersey2}>
                                    {players.map( (item) => {return <option>{item.jerseynumber + " " + item.jerseyname} {item.position === positionNames[1] ? "(preferred)" : ""}</option>})}
                                </select><br/><br/>
                                <label className={modalLabels}>{positionNames[2]}</label>
                                <select className={modalInput}onChange={(e) => {formationData.jersey3 = e.target.value}} value={formationData?.jersey3}>
                                    {players.map( (item) => {return <option>{item.jerseynumber + " " + item.jerseyname} {item.position === positionNames[2] ? "(preferred)" : ""}</option>})}
                                </select><br/><br/>
                                <label className={modalLabels}>{positionNames[3]}</label>
                                <select className={modalInput}onChange={(e) => formationData.jersey4 = e.target.value} value={formationData?.jersey4}>
                                    {players.map( (item) => {return <option>{item.jerseynumber + " " + item.jerseyname} {item.position === positionNames[3] ? "(preferred)" : ""}</option>})}
                                </select><br/><br/>
                                <label className={modalLabels}>{positionNames[4]}</label>
                                <select className={modalInput}onChange={(e) => formationData.jersey5 = e.target.value} value={formationData?.jersey5}>
                                    {players.map( (item) => {return <option>{item.jerseynumber + " " + item.jerseyname} {item.position === positionNames[4] ? "(preferred)" : ""}</option>})}
                                </select><br/><br/>
                            </span>
                            <span>
                                <label className={modalLabels}>{positionNames[5]}</label>
                                <select className={modalInput}onChange={(e) => formationData.jersey6 = e.target.value} value={formationData?.jersey6}>
                                    {players.map( (item) => {return <option>{item.jerseynumber + " " + item.jerseyname} {item.position === positionNames[5] ? "(preferred)" : ""}</option>})}
                                </select><br/><br/>  
                                <label className={modalLabels}>{positionNames[6]}</label>
                                <select className={modalInput}onChange={(e) => formationData.jersey7 = e.target.value} value={formationData?.jersey7}>
                                    {players.map( (item) => {return <option>{item.jerseynumber + " " + item.jerseyname} {item.position === positionNames[6] ? "(preferred)" : ""}</option>})}
                                </select><br/><br/>
                                <label className={modalLabels}>{positionNames[7]}</label>
                                <select className={modalInput}onChange={(e) => formationData.jersey8 = e.target.value} value={formationData?.jersey8}>
                                    {players.map( (item) => {return <option>{item.jerseynumber + " " + item.jerseyname} {item.position === positionNames[7] ? "(preferred)" : ""}</option>})}
                                </select><br/><br/>
                                <label className={modalLabels}>{positionNames[8]}</label>
                                <select className={modalInput}onChange={(e) => formationData.jersey9 = e.target.value} value={formationData?.jersey9}>
                                    {players.map( (item) => {return <option>{item.jerseynumber + " " + item.jerseyname} {item.position === positionNames[8] ? "(preferred)" : ""}</option>})}
                                </select><br/><br/>
                                <label className={modalLabels}>{positionNames[9]}</label>
                                <select className={modalInput}onChange={(e) => formationData.jersey10 = e.target.value} value={formationData?.jersey10}>
                                    {players.map( (item) => {return <option>{item.jerseynumber + " " + item.jerseyname} {item.position === positionNames[9] ? "(preferred)" : ""}</option>})}
                                </select><br/><br/>
                                <label className={modalLabels}>{positionNames[10]}</label>
                                <select className={modalInput}onChange={(e) => formationData.jersey11 = e.target.value} value={formationData?.jersey11}>
                                    {players.map( (item) => {return <option>{item.jerseynumber + " " + item.jerseyname} {item.position === positionNames[10] ? "(preferred)" : ""}</option>})}
                                </select><br/><br/>
                                </span>
                            <div>
                                <button className='modal-btn' onClick={() => changeFormation()}>Save</button><br></br>
                                <button className='modal-btn' onClick={() => setShowChangeWindow(false)}>Cancel</button>
                            </div>
                            </dialog>
                        </div>
                    </Modal>
                ):null
            }
            <button className={"card-button-goto close-formation"} onClick={onClose}>X</button>
            {teamid !== 500 && new Date() < new Date(matchdatetime) && formationData && <button className={"card-button-goto change-formation"} onClick={() => setShowChangeWindow(true)}>Change</button>}
            { !type ?
                <div className="formation-dialog">
                    <img src={formation} className="formation-img"></img>
                </div>
             : <div className="formation-dialog">
                <img src={formation} className="formation-img"></img>
                <div className = {isLeftSide ?'formation-keeper' :'formation-keeper formation-keeper2'}>
                    <h1 className='formation-circle'>{isLeftSide ?"🔵" :"🔴"}</h1>
                    <h2 className="formation-name">{formationData?.jersey1}</h2>
                </div>
                <div className={isLeftSide ?'formation-keeper lfullback-4-2-3-1' :'formation-keeper lfullbackop-4-2-3-1'}>
                    <h1 className='formation-circle'>{isLeftSide ?"🔵" :"🔴"}</h1>
                    <h2 className="formation-name">{formationData?.jersey2}</h2>
                </div>
                <div className={isLeftSide ?'formation-keeper rfullback-4-2-3-1' :'formation-keeper rfullbackop-4-2-3-1'}>
                    <h1 className='formation-circle'>{isLeftSide ?"🔵" :"🔴"}</h1>
                    <h2 className="formation-name">{formationData?.jersey3}</h2>
                </div>
                <div className={isLeftSide ?'formation-keeper cback-4-2-3-1' :'formation-keeper cbackop-4-2-3-1'}>
                    <h1 className='formation-circle'>{isLeftSide ?"🔵" :"🔴"}</h1>
                    <h2 className="formation-name">{formationData?.jersey4}</h2>
                </div>
                <div className={isLeftSide ?'formation-keeper cbacksweeper-4-2-3-1' :'formation-keeper cbacksweeperop-4-2-3-1'}>
                    <h1 className='formation-circle'>{isLeftSide ?"🔵" :"🔴"}</h1>
                    <h2 className="formation-name">{formationData?.jersey5}</h2>
                </div>
                <div className=
                    {
                    type === '4-2-3-1' 
                        ? isLeftSide 
                            ?'formation-keeper ldefmidfield-4-2-3-1' 
                            :'formation-keeper ldefmidfieldop-4-2-3-1' 
                    :type === '4-5-1'
                        ? isLeftSide
                            ?'formation-keeper lcentremid-4-5-1'
                            :'formation-keeper lcentremidop-4-5-1'
                    :type === '4-4-2'
                        ? isLeftSide
                            ?'formation-keeper lcentremid-4-5-1'
                            :'formation-keeper ccentremidop-4-5-1'
                    :null
                    }>
                    <h1 className='formation-circle'>{isLeftSide ?"🔵" :"🔴"}</h1>
                    <h2 className="formation-name">{formationData?.jersey6}</h2>
                </div>
                <div className={
                    type === '4-2-3-1' 
                        ? isLeftSide 
                            ?'formation-keeper rdefmidfield-4-2-3-1' 
                            :'formation-keeper rdefmidfieldop-4-2-3-1' 
                    :type === '4-5-1' || type === '4-4-2'
                        ?isLeftSide
                        ?'formation-keeper rcentremid-4-5-1'
                        :'formation-keeper rcentremidop-4-5-1'
                    :null
                    }>
                    <h1 className='formation-circle'>{isLeftSide ?"🔵" :"🔴"}</h1>
                    <h2 className="formation-name">{formationData?.jersey7}</h2>
                </div>
                <div className={isLeftSide ?'formation-keeper lwinger-4-2-3-1' :'formation-keeper lwingerop-4-2-3-1'}>
                    <h1 className='formation-circle'>{isLeftSide ?"🔵" :"🔴"}</h1>
                    <h2 className="formation-name">{formationData?.jersey8}</h2>
                </div>
                <div className={isLeftSide ?'formation-keeper rwinger-4-2-3-1' :'formation-keeper rwingerop-4-2-3-1'}>
                    <h1 className='formation-circle'>{isLeftSide ?"🔵" :"🔴"}</h1>
                    <h2 className="formation-name">{formationData?.jersey9}</h2>
                </div>
                <div className={
                    type === '4-2-3-1' 
                        ? isLeftSide 
                            ?'formation-keeper attackmid-4-2-3-1' 
                            :'formation-keeper attackmidop-4-2-3-1' 
                    :type === '4-5-1'
                        ?isLeftSide
                            ?'formation-keeper ccentremid-4-5-1'
                            :'formation-keeper ccentremidop-4-5-1'
                    :type === '4-4-2'
                        ? isLeftSide
                            ?'formation-keeper lcforward-4-4-2'
                            :'formation-keeper lcforwardop-4-4-2'
                    :null
                    }>
                    <h1 className='formation-circle'>{isLeftSide ?"🔵" :"🔴"}</h1>
                    <h2 className="formation-name">{formationData?.jersey10}</h2>
                </div>
                <div className={
                    type === '4-2-3-1' || type === '4-5-1'
                        ? isLeftSide 
                            ?'formation-keeper cforward-4-2-3-1' 
                            :'formation-keeper cforwardop-4-2-3-1' 
                    :type === '4-4-2'
                        ? isLeftSide
                            ?'formation-keeper rcforward-4-4-2'
                            :'formation-keeper rcforwardop-4-4-2'
                    :null
                    }>
                    <h1 className='formation-circle'>{isLeftSide ?"🔵" :"🔴"}</h1>
                    <h2 className="formation-name">{formationData?.jersey11}</h2>
                </div>
            </div>}
        </div>
    );
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
  });
  
  export default connect(mapStateToProps, {checkAuthenticated, loadUser})(Formation);
