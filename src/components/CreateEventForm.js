import React, { useState, useEffect } from "react";
import axios from "axios";
import { type } from "@testing-library/user-event/dist/type";
import { serverUrl } from "./constants";

function DisplayPerformers({ eid, performers }) {
  async function startPerforming(pid) {
    await fetch(
      "/event/update/performer?event_id=" + eid + "&performer_id=" + pid,
      { method: "PUT" }
    );
  }

  async function stopPerforming() {
    await fetch("/event/update/performing?event_id=" + eid, {
      method: "PUT",
    });
  }

  async function updateEvent(message) {
    fetch("/event/update/status?event_id=" + eid + "&progress=" + message, {
      method: "PUT",
    });
  }

  return (
    <>
      <button type="button" onClick={() => updateEvent("Event in progress")}>
        Start Event
      </button>
      <> </>
      <button type="button" onClick={() => updateEvent("Event ended!!")}>
        End Event
      </button>
      <p />
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
            <th style={{ border: "1px solid black", padding: "8px" }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {performers.map((performer) => (
            <tr key={performer.performerId}>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {performer.performerName}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                <button
                  type="button"
                  onClick={() => startPerforming(performer.performerId)}
                >
                  Start Performing
                </button>
                <> </>
                <button type="button" onClick={() => stopPerforming()}>
                  Stop Performing and Start Voting
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

const CreateEventForm = () => {
  const [judges, setJudges] = useState([
    { judge_name: "", judge_email: "", judge_weightage: 1 },
  ]);
  const [performers, setPerformers] = useState([
    { performer_name: "", performer_score: 0 },
  ]);
  const [item, setItem] = useState({ event_name: "" });
  const [perfomanceTime, setPerformanceTime] = useState();
  const [votingTime, setVotingTime] = useState();
  const [eventTime, setEventTime] = useState();
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState();

  const performanceTimeChange = (e) => {
    setPerformanceTime(e.target.value);
  };

  const votingTimeChange = (e) => {
    setVotingTime(e.target.value);
  };

  const eventTimeChange = (e) => {
    setEventTime(e.target.value);
  };

  const [categories, setCategories] = useState([{ category_name: "" }]);

  const performerChange = (index, e) => {
    const values = [...performers];
    values[index][e.target.name] = e.target.value;
    setPerformers(values);
  };
  const performerAddField = () => {
    setPerformers([...performers, { performer_name: "", performer_score: 0 }]);
  };
  const performerRemoveField = (index) => {
    const values = [...performers];
    values.splice(index, 1);
    setPerformers(values);
  };

  const judgeChange = (index, e) => {
    const values = [...judges];
    values[index][e.target.name] = e.target.value;
    setJudges(values);
  };
  const judgeAddField = () => {
    setJudges([
      ...judges,
      { judge_name: "", judge_email: "", judge_weightage: 1 },
    ]);
  };
  const judgeRemoveField = (index) => {
    const values = [...judges];
    values.splice(index, 1);
    setJudges(values);
  };

  const categoryAddField = () => {
    setCategories([...categories, { category_name: "" }]);
  };
  const categoryRemoveField = (index) => {
    const values = [...categories];
    values.splice(index, 1);
    setCategories(values);
  };

  const categoryChange = (index, e) => {
    const values = [...categories];
    values[index][e.target.name] = e.target.value;
    setCategories(values);
  };

  const eventChange = (e) => {
    const value = item;
    value[e.target.name] = e.target.value;
    setItem(value);
  };

  const val = {
    event: item,
    judges: judges,
    performers: performers,
    categories: categories,
  };

  const req = JSON.stringify(val);

  const [message, setMessage] = useState("");

  let timer = undefined;

  const updateProgress = (id, message) => {
    return new Promise((resolve) => {
      timer = setTimeout(async () => {
        await fetch(
          "/event/update/status?event_id=" + id + "&progress=" + message,
          {
            method: "PUT",
          }
        );
        resolve();
      }, eventTime * 60 * 1000);
    });
  };

  const updatePerformer = async (eid, pid) => {
    await fetch(
      "/event/update/performer?event_id=" + eid + "&performer_id=" + pid,
      { method: "PUT" }
    );
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, perfomanceTime * 1000);
    });
  };

  const updatePerforming = async (eid) => {
    await fetch("/event/update/performing?event_id=" + eid, {
      method: "PUT",
    });
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, votingTime * 60 * 1000);
    });
  };

  const updatePerformers = async (performers, eid) => {
    for (const performer of performers) {
      await updatePerformer(eid, performer.performerId);
      await updatePerforming(eid);
    }
    updateProgress(eid, "Event ended!!");
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      const response1 = await axios.post("/admin/create", req, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setMessage("Event Created Successfully!!");
      setData(response1.data);
      setSubmitted(true);
      // const id = response1.data.event.eventId;
      // const performers = response1.data.performers;
      // await updateProgress(id, "Event in Progress!!");
      // updatePerformers(performers, id);
    } catch (error) {
      setMessage("Error: " + error);
    }
  };

  useEffect(() => {
    return () => clearTimeout(timer);
  }, []);

  if (submitted == true)
    return (
      <>
        <DisplayPerformers
          eid={data.event.eventId}
          performers={data.performers}
        />
      </>
    );

  return (
    <div className="container mt-5">
      <form onSubmit={formSubmit}>
        <h2>Event</h2>
        <div className="col">
          <input
            type="text"
            name="event_name"
            className="form-control"
            placeholder="event name"
            value={item.name}
            onChange={(e) => eventChange(e)}
            required
          />
        </div>
        <p />
        <h2>Performers</h2>
        {performers.map((field, index) => (
          <div className="row mb-3" key={index}>
            <div className="col">
              <input
                type="text"
                name="performer_name"
                className="form-control"
                placeholder="Name"
                value={field.name}
                onChange={(e) => performerChange(index, e)}
                required
              />
            </div>
            <div className="col-auto">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => performerRemoveField(index)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-primary"
          onClick={performerAddField}
        >
          Add Performer
        </button>
        <p />

        <h2>Judges</h2>
        {judges.map((field, index) => (
          <div className="row mb-3" key={index}>
            <div className="col">
              <input
                type="text"
                name="judge_name"
                className="form-control"
                placeholder="Name"
                value={field.name}
                onChange={(e) => judgeChange(index, e)}
                required
              />
            </div>
            <div className="col">
              <input
                type="email"
                name="judge_email"
                className="form-control"
                placeholder="Email"
                value={field.email}
                onChange={(e) => judgeChange(index, e)}
                required
              />
            </div>
            <div className="col">
              <input
                type="number"
                name="judge_weightage"
                className="form-control"
                placeholder="Weightage(example: 1)"
                value={field.email}
                onChange={(e) => judgeChange(index, e)}
                required
              />
            </div>
            <div className="col-auto">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => judgeRemoveField(index)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-primary"
          onClick={judgeAddField}
        >
          Add Judge
        </button>
        <p />

        <h2>Categories</h2>
        {categories.map((field, index) => (
          <div className="row mb-3" key={index}>
            <div className="col">
              <input
                type="text"
                name="category_name"
                className="form-control"
                placeholder="category name"
                value={field.name}
                onChange={(e) => categoryChange(index, e)}
                required
              />
            </div>
            <div className="col-auto">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => categoryRemoveField(index)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-primary"
          onClick={categoryAddField}
        >
          Add Category
        </button>
        {/* <p />
          <h2>Time</h2>
          <div className="row mb-3">
            <div className="col">
              <input
                type="number"
                name="performance_time"
                className="form-control"
                placeholder="performance time in seconds"
                value={item.name}
                onChange={(e) => performanceTimeChange(e)}
                required
              />
            </div>
            <div className="col">
              <input
                type="number"
                name="voting_time"
                className="form-control"
                placeholder="voting time in minutes"
                value={item.name}
                onChange={(e) => votingTimeChange(e)}
                required
              />
            </div>
            <div className="col">
              <input
                type="number"
                name="schedule_event"
                className="form-control"
                placeholder="start event in __ minutes"
                value={item.name}
                onChange={(e) => eventTimeChange(e)}
                required
              />
            </div>
          </div> */}
        <p />
        <button type="submit" className="btn btn-success mt-3">
          Submit
        </button>
      </form>
      {message != "" ? <h1>{message}</h1> : null}
    </div>
  );
};

export default CreateEventForm;
