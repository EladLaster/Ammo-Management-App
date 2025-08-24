import React, { useEffect, useState } from "react";

/**
 * MediaWiki component fetches Wikipedia summary for a given title.
 * @param {Object} props
 * @param {string} props.title - The Wikipedia page title to fetch.
 */
function MediaWiki({ title }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!title) return;
    setLoading(true);
    setError(null);
    setData(null);
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      title
    )}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [title]);

  if (!title) return <div>Please provide a title.</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <div>
      <div>
        <strong>Extract:</strong> {data.extract || "No extract available"}
      </div>
    </div>
  );
}

export default MediaWiki;
