import "./css/Homepage.css";
import "./css/Tournaments.css";
import "./css/LightMode.css";
import ContentCard from "./ContentCard";
import { navigate } from "@reach/router";
import { blankspace, filterInput, filterLabels, mainTitle } from "./Constants";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { loadUser, checkAuthenticated } from "./actions/auth";
import { tournamentDecider } from "./Deciders";

const Tournaments = (props) => {
  const [championships, setChampionships] = useState([]);
  const [selected, setSelected] = useState("All");

  useEffect(() => {
    fetch('/api/tournaments/')
    .then(response => response.json())
    .then(tournaments => {
      tournaments.map(t => tournamentDecider(t.championshipid))
      fetch('/api/tournaments/')
      .then(response => response.json())
      .then(updatedTournaments => {
        setChampionships(updatedTournaments)
      })
    });
  }, []);

  return (
    <div className={blankspace}>
      <div>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <h1 align="center" className={mainTitle}>
          Tournaments
        </h1>
        {props.user?.is_staff ? (
          <button
            onClick={() => {
              navigate("/tournaments/create");
            }}
            className="add-btn"
          >
            Create
          </button>
        ) : null}
        &nbsp;&nbsp;&nbsp;&nbsp;<label className={filterLabels}>Status:</label>
        <select
          defaultValue={selected}
          className={filterInput}
          onChange={(e) => {
            setSelected(e.target.value);
          }}
        >
          <option>All</option>
          <option>In progress</option>
          <option>Finished</option>
          <option>Not started</option>
        </select>
        <br></br>
        <br></br>
        <div className="container">
          {(selected === "All"
            ? championships
            : championships.filter((el) => el.status === selected)
          ).map((item) => {
            return (
              <ContentCard
                width="50"
                className="card-tournament"
                image={item.itemphoto}
                topic="TOURNAMENTS"
                title={item.name}
                description={"Status: " + item.status}
                buttonText="See more"
                color={1}
                bin={props?.user?.is_staff}
                isTournament={true}
                url={`/tournaments/${item.championshipid}`}
                teamid={item.championshipid}
              ></ContentCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, { checkAuthenticated, loadUser })(Tournaments);
