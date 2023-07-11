import Homepage from './Homepage';
import TermsConditions from './TermsConditions';
import Profile from './Profile';
import PrivacyPolicy from './PrivacyPolicy';
import AboutUs from './AboutUs';
import Contact from './Contact';
import logo from './images/logo.png';
import PlayerProfile from './PlayerProfile';
import Achievements from './Achievements';
import {Router} from "@reach/router";
import Tournaments from './Tournaments';
import Teams from './Teams';
import Favorites from './Favorites';
import Players from './Players';
import Rankings from './Rankings';
import News from './Newsletter';
import Forum from './Forum';
import TournamentDetails from './TournamentDetails';
import React from "react";
import NewsDetails from "./NewsDetails";
import TeamDetails from './TeamDetails';
import TournamentCreate from './TournamentCreate';
import Login from './Login';
import Register from './Register';
import PasswordReset from './PasswordReset';
import PasswordResetConfirm from './PasswordResetConfirm';
import ActivateAccount from './ActivateAccount';
import MatchDetails from './MatchDetails';
import ActiveMatches from './ActiveMatches';
import UsersList from './UsersList';
import {Provider} from 'react-redux';
import middlewareStore from './middlewareStore';
import NavBar from './NavBar';
import ForumPost from './ForumPost';
import AddPlayer from './AddPlayer';
import TournamentCreateAddTeams from './TournamentCreateAddTeams';
import ReportList from './Reports';
import TournamentMatches from './TournamentMatches';

document.title = "Tournzilla";
const favicon = document.querySelector('[rel=icon]');
favicon.href = logo;

console.log(middlewareStore)

function App() {
  return (
    <div>
      <Provider store={middlewareStore}>
      <NavBar/>
      <Router>            
        <Homepage path="/" />
        <Tournaments path="/tournaments" />
        <Teams path="/teams"/>
        <Players path="/players" />
        <Favorites path="/favorites/:id" />
        <Rankings path="/rankings" />
        <News path="/news" />
        <Forum path="/forum" />
        <ForumPost path='/forum/:id'/>
        <Profile path="/userlist/:id" />
        <Achievements path="/achievements/:id" />
        <AboutUs path="/about" />
        <Contact path="/contact" />
        <PrivacyPolicy path="/privacypolicy" />
        <TermsConditions path="/termsandconditions" />
        <PlayerProfile path="/players/:id" />
        <TournamentDetails path="/tournaments/:id" />
        <TournamentMatches path="/tournaments/:id/matches" />
        <TournamentCreate path="/tournaments/create" />
        <TournamentCreateAddTeams path="/tournaments/create/add-teams" />
        <News path="/news" />
        <NewsDetails path="/news/:id" />
        <TeamDetails path="teams/:id" />
        <Login path="/login" />
        <Register path="/register" />
        <PasswordReset path="/resetpassword" />
        <PasswordResetConfirm path="/password/reset/confirm/:uid/:token" />
        <MatchDetails path="/tournaments/:id/matches/:mid" />
        <ActivateAccount path="/activate/:uid/:token" />
        <ActiveMatches path="/activematches" />
        <UsersList path="/userlist"/>
        <AddPlayer path="/create-player/:id" />
        <ReportList path='/reports' />
      </Router>
      </Provider>
    </div>
  );
}

export default App;
