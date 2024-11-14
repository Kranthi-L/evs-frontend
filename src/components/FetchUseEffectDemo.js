import React, { useEffect, useState } from "react";

export default function FetchUseEffectDemo() {
  const [now, setNow] = useState("");

  function getCount() {
    setNow(now + 1);
  }

  //useEffect(() => { getTime() }, []);
  useEffect(getCount, []);

  return (
    <>
      <h1>Demo</h1>
      <h2>{now}</h2>
    </>
  );
}
