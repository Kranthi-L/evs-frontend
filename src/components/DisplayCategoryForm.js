import React, { useEffect, useState, useParams } from "react";
import { serverUrl } from "./constants";
export default function DisplayCategoryForm({
  categories,
  eid,
  pid,
  jid,
  weight,
}) {
  const [catValues, setCatValues] = useState([]);
  const [message, setMessage] = useState("");

  const categoryChange = (index, e) => {
    const values = [...catValues];
    values[index] = e.target.value;
    setCatValues(values);
  };

  const formSubmit = (e) => {
    e.preventDefault();
    setMessage("Please wait while the other judges score!!!");
    let tot = 0;
    catValues.map((val) => {
      tot += parseInt(val);
    });
    console.log(tot);
    tot = tot * parseInt(weight);
    const data = {
      score: tot,
      event_id: eid,
      performer_id: pid,
      judge_id: jid,
    };
    fetch("/judge/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };
  const options = [1, 2, 3, 4, 5];

  return (
    <>
      <div className="container mt-5">
        <form onSubmit={formSubmit}>
          {categories.map((cat, idx) => (
            <div className="form-group">
              <label key={idx} htmlFor="dropdown">
                {cat.categoryName}
              </label>
              <select
                name="category_name"
                className="form-control"
                value={catValues[idx]}
                onChange={(e) => categoryChange(idx, e)}
              >
                <option value="">--select a score--</option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <p />
            </div>
          ))}
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
        <h2>{message}</h2>
      </div>
    </>
  );
}
