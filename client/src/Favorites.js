import "./css/Homepage.css";
import ContentCard from "./ContentCard";
import { blankspace, mainTitle, mainSubtitle } from "./Constants";
import { connect } from "react-redux";
import { loadUser, checkAuthenticated } from "./actions/auth";
import React, { useEffect, useState } from "react";

const Favorites = (props) => {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch(`/api/favorites/${props.id}/`)
      .then(response => response.json())
      .then(data => setTeams(data))
      fetch(`/api/tournaments/`)
      .then(response => response.json())
      .then(data => {
        data.map(trnmt => {
          fetch(`/api/tournaments/${trnmt}/matches/`)
          .then(rs => rs.json())
          .then(allmatches => setMatches(allmatches))
        })
      })
  }, []);

  useEffect(() => {
    props.checkAuthenticated();
    props.loadUser();
  }, []);

  return (
    <div className={blankspace}>
      <div>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <h1 align="center" className={mainTitle}>
          Favorites
        </h1>
        <br></br>
        <br></br>
        {!teams  || teams?.length === 0 ? 
        ( <p align='center' className={mainSubtitle}>
          {parseInt(props.id) === props.user?.id ? 'You' :'User'} didn't add any favorite teams.
        </p> ) 
        : (
          <div className="container">
            {teams.map((item) => {
              return (
                  <ContentCard
                    width="50"
                    className="card-tournament"
                    image={item.itemphoto}
                    topic="FAVORITES"
                    title={item.name}
                    description={matches.filter(x => x.status === "In progress").find(x => x.team1 === item.teamid || x.team2 === item.teamid) && parseInt(props.id) === props.user?.id ? "Currently playing" :null}
                    buttonText={parseInt(props.id) === props.user?.id ? 'Check score' : null}
                    extraButton={parseInt(props.id) === props.user?.id}
                    buttonText2={"Unfavorize"}
                    color={7}
                    userid={props.user?.id}
                    teamid={item.id}
                    firstBtnAction={true}
                  ></ContentCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, { checkAuthenticated, loadUser })(
  Favorites
);
