import React, { useEffect, useState } from "react";
import "./css/ContentCard.css";
import "./css/Formation.css";
import { contactSubtitle, playerTeamPos, playerTeamName } from "./Constants";
import { navigate } from "@reach/router";

const PlayerPhotos = ({ id, isAuth }) => {
  const [plyrs, setPlyrs] = useState([]);

  useEffect(() => {
    fetch(`/api/players/`)
      .then((response) => response.json())
      .then((data) => setPlyrs(data.filter((x) => x.currentteam == id)));
  }, []);

  return (
    <div>
      <span className="inline-span">
        <h1 className={contactSubtitle}>Players</h1>
        {isAuth ? <button className="card-button-goto" onClick={()=>navigate(`/create-player/${id}`)}>Add</button> : null}
      </span>
      <div className="players-container">
        {plyrs.map((item) => {
          return (
            <div onClick={() => navigate(`/players/${item.id}`)}>
              <h2 className={`${contactSubtitle} ${playerTeamName}`}>
                {item.jerseynumber} {item.jerseyname}
              </h2>
              <p className={`${contactSubtitle} ${playerTeamPos}`}>
                {item.position}
              </p>
              <img src={item.profilephoto} className="player-card"></img>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerPhotos;
