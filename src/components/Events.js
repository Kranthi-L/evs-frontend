import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "./constants";

export default function Events() {
  let [events, setEvents] = useState();
  let [message, setMessage] = useState("Loading...");
  const fetchData = () => {
    fetch("/events")
      .then((response) => response.json())
      .then((data) => setEvents(data));
    setTimeout(() => {
      if (!events) setMessage("No Events Available at this moment!!");
    }, 1000);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData();
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const navigate = useNavigate();

  const funRedirect = (id) => {
    navigate("/event/" + id);
  };

  if (!events) return <h1>{message}</h1>;
  return (
    <>
      <h1>Available Events</h1>
      <ul>
        {events.map((element, idx) => (
          <li key={idx} onClick={() => funRedirect(element.eventId)}>
            <h3>{element.eventName}</h3>
            <small>{element.eventStatus}</small>
            <p />
          </li>
        ))}
      </ul>
    </>
  );
}
