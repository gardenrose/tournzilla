import './css/Homepage.css';
import './css/Users.css';
import { Link } from "@reach/router";
import { blankspace, mainTitle, termsTitle } from './Constants';
import React, {useState, useEffect} from "react";
import { userNameLink } from './Constants';

const UsersList = () => {

    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        fetch('/api/users/')
        .then(response => response.json())
        .then(allUsers => setUsers(allUsers))
      }, [])

   //users.map(el => console.log(el.username))
    return (
        <div className={blankspace}>
            <div >
            &nbsp;&nbsp;&nbsp;&nbsp;<h1 align='center' className={mainTitle}>Users</h1>
            <hr></hr>
            <h2 className={termsTitle}>Administrators</h2>
            <div className='container-list-users'>
            {users.filter(user => user.is_staff).map((item) => {return (
            <Link className='user-link-wrapper' to={`/userlist/${item.id}`}>
                <div className={userNameLink} >
                    <img className='users-mini-photo' src={item.profilephoto} width={100} height={100}></img>
                    <p className='user-name-text'>{item.username}</p>
                </div>
            </Link>
        )}
            )}
            </div>
            <hr></hr>
            <h2 className={termsTitle}>Regular users</h2>
            <div className='container-list-users'>
            {users.filter(user => !user.is_staff).map((item) => {return (
            <Link className='user-link-wrapper' to={`/userlist/${item.id}`}>
                <div className={userNameLink}>
                    <img className='users-mini-photo' src={item.profilephoto} width={100} height={100}></img>
                    <p className='user-name-text'>{item.username}</p>
                </div>
            </Link>
        )}
            )}
            </div>
        </div>
        </div>
    );
}

export default UsersList;