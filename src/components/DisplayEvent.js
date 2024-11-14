import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "./constants";
function DisplayScores({ scores, id, status }) {
  // scores.map((score) => {
  //   console.log(score.performers.performerId);
  // });
  const arr = scores.filter((score) => score.performers.performerId == id);
  // console.log("id=" + id);
  // console.log(arr);
  if (status === "Event ended!!") {
    let performer = "";
    let max = 0;
    scores.map((score) => {
      if (score.score > max) {
        max = score.score;
        performer = score.performers.performerName;
      }
    });
    return (
      <>
        <h2>{performer} won this event!</h2>
      </>
    );
  }
  if (arr.length === 0) return null;
  return (
    <>
      <h4>Scores for {arr[0].performers.performerName}</h4>
      <div className="row mb-3">
        <div className="col">
          {arr.map((score, idx) => {
            <h2>(score.judges.judgeName)</h2>;
            return (
              <h5>
                {score.judges.judgeName}: {score.score}
              </h5>
            );
          })}
        </div>
      </div>
    </>
  );
}

function DisplayPerformers({ performers }) {
  return (
    <>
      <h3>Performers</h3>
      <table
        style={{
          width: "100%",
          border: "1px solid black",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "8px" }}>Name</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {performers.map((performer) => (
            <tr key={performer.performerId}>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {performer.performerName}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {performer.performerScore}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function DisplayJudges({ judges }) {
  return (
    <>
      <h3>Judges</h3>
      <table
        style={{
          width: "100%",
          border: "1px solid black",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "8px" }}>Name</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              Weightage
            </th>
          </tr>
        </thead>
        <tbody>
          {judges.map((judge) => (
            <tr key={judge.judge_id}>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {judge.judgeName}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {judge.judgeWeightage}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default function DisplayEvent() {
  const { id } = useParams();

  const [item, setItem] = useState();

  function fetchData() {
    fetch("/event?event_id=" + id)
      .then((response) => response.json())
      .then((data) => setItem(data));
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData();
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (!item) return <p>Loading....</p>;

  if (item.event.performing === true)
    return (
      <>
        <h1>{item.event.eventName} Event</h1>
        <small>{item.event.eventStatus}</small>
        <p />
        {item.performers
          .filter(
            (performer) => performer.performerId === item.event.performer_id
          )
          .map((item) => (
            <h3>{item.performerName} performing.......</h3>
          ))}
        <p />
        <p />
        <DisplayJudges judges={item.judges} />
        <p />
        <DisplayPerformers performers={item.performers} />
      </>
    );

  return (
    <>
      <h1>{item.event.eventName} Event</h1>
      <small>{item.event.eventStatus}</small>
      <p />
      {item.event.eventStatus === "Event ended!!" ? null : item.event
          .performer_id !== -1 ? (
        item.event.performing === false ? (
          <h4>Judges Scoring...</h4>
        ) : null
      ) : null}
      {item.event.performer_id !== -1 ? (
        item.event.performing === false ? (
          item.scores.length !== 0 ? (
            <DisplayScores
              scores={item.scores}
              id={item.event.performer_id}
              status={item.event.eventStatus}
            />
          ) : null
        ) : null
      ) : null}
      <DisplayJudges judges={item.judges} />
      <p />
      <DisplayPerformers performers={item.performers} />
    </>
  );
}
