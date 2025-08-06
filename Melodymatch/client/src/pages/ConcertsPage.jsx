

import { useEffect, useState } from "react";
import axios from "axios";
import "./ConcertsPage.css";

export default function ConcertsPage() {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = "QJpu4OJt1gDU51ENZat1zqFtsPOOhRY9"; // Replace with your actual API key
  const CITY = "New York";

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        setLoading(true);
        const url = `https://app.ticketmaster.com/discovery/v2/events.json`;
        const params = {
          apikey: API_KEY,
          city: CITY,
          classificationName: "music",
          sort: "date,asc",
          size: 20,
        };

        const response = await axios.get(url, { params });
        const events = response.data._embedded?.events || [];

        const formatted = events.map((ev) => ({
          id: ev.id,
          name: ev.name,
          date: ev.dates.start.dateTime,
          venue: ev._embedded?.venues?.[0]?.name || "Unknown Venue",
          img: ev.images?.find((i) => i.width >= 600)?.url || "",
          url: ev.url,
        }));

        setConcerts(formatted);
      } catch (error) {
        console.error("Failed to fetch concerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConcerts();
  }, []);

  return (
    <div className="concerts-page">
      <h1>Upcoming Concerts 🎶</h1>
      {loading ? (
        <p className="status">Loading concerts...</p>
      ) : concerts.length === 0 ? (
        <p className="status">No concerts found.</p>
      ) : (
        <div className="concert-grid">
          {concerts.map((c) => (
            <div className="concert-card" key={c.id}>
              {c.img && <img src={c.img} alt={c.name} />}
              <div className="info">
                <h3>{c.name}</h3>
                <p>
                  {new Date(c.date).toLocaleDateString()} • {c.venue}
                </p>
                <a href={c.url} target="_blank" rel="noopener noreferrer">
                  Tickets
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
