import "./css/Homepage.css";
import ContentCard from "./ContentCard";
import { blankspace, mainTitle, mainSubtitle } from "./Constants";
import React, { useState, useEffect } from "react";

const Achievements = (props) => {
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    fetch(`/api/achievements/${props.id}/`)
      .then((response) => response.json())
      .then((data) => setCollection(data));
  }, []);

  if (collection.length > 0) {
    return (
      <div className={blankspace}>
        <div>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <h1 align="center" className={mainTitle}>
            Achievements
          </h1>
          <br></br>
          <br></br>
          <div className="container">
            {collection &&
              collection.map((item) => {
                return (
                  <ContentCard
                    width="50"
                    className="card-tournament"
                    image={item.image}
                    topic="ACHIEVEMENTS"
                    title={item.name}
                    description={item.description}
                    buttonText={null}
                    extraButton={false}
                    buttonText2={null}
                    color={5}
                  ></ContentCard>
                );
              })}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={blankspace}>
        <div>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <h1 align="center" className={mainTitle}>
            Achievements
          </h1>
          <br></br>
          <br></br>
          <p align="center" className={mainSubtitle}>
            No achievements yet.
          </p>
        </div>
      </div>
    );
  }
};

export default Achievements;
