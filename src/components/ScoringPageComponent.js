import React, { useEffect, useState } from "react";
import { serverUrl } from "./constants";
import { useParams, useNavigate } from "react-router-dom";

import DisplayCategoryForm from "./DisplayCategoryForm";

export default function ScoringPageComponent() {
  const [item, setItem] = useState();
  const [weight, setweight] = useState();
  const { id } = useParams();
  const navigate = useNavigate();
  function fetchData(eid) {
    fetch("/judge/event?judge_id=" + id)
      .then((response) => response.json())
      .then((data) => setItem(data));
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      let s = "Event ended!";
      fetchData();
      if (item) {
        if (s.localeCompare(item.event.eventStatus) === 0) {
          clearInterval(intervalId);
        }
      }
    }, 1000);
  }, []);

  if (!item) return <h2>Loading...</h2>;

  const cats = item.categories;

  if (item.event.performer_id === -1)
    return <h2>Event will start in a few minutes! Be ready to score.</h2>;

  if (item.event.eventStatus === "Event ended!!")
    return (
      <>
        <h2>Event ended!!</h2>
        {setTimeout(() => {
          navigate("/events");
        }, 2000)}
      </>
    );

  if (item.event.performing === false)
    return (
      <>
        {item.performers
          .filter(
            (performer) => performer.performerId === item.event.performer_id
          )
          .map((performer) => (
            <>
              <h3>
                Score {performer.performerName} performance in these catagories
              </h3>
              <DisplayCategoryForm
                categories={cats}
                eid={item.event.eventId}
                jid={id}
                pid={performer.performerId}
                weight={
                  item.judges.filter((judge) => {
                    return judge.judge_id === parseInt(id);
                  })[0].judgeWeightage
                }
              />
            </>
          ))}
      </>
    );
  return (
    <>
      {item.performers
        .filter(
          (performer) => performer.performerId === item.event.performer_id
        )
        .map((item) => (
          <h3>{item.performerName} performing.......</h3>
        ))}
    </>
  );
}
