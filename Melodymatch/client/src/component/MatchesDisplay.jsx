import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import "./MatchesDisplay.css";

const MatchesDisplay = ({ matches, setClickedUser, currentUser }) => {
  const [matchedProfiles, setMatchedProfiles] = useState([]);
  const [cookies] = useCookies();

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const userId = cookies.UserId;
  const matchedUserIds = Array.isArray(matches)
    ? matches.map(({ user_id }) => user_id)
    : [];

  const getMatches = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/users`,
        {
          params: { userIds: JSON.stringify(matchedUserIds) },
        }
      );
      setMatchedProfiles(response.data);
    } catch (error) {
      console.error("Error fetching matched users:", error);
    }
  };

  useEffect(() => {
    if (matches.length > 0) getMatches();
  }, [matches]);

  const getCommonTraits = (match) => {
    const userSongs = currentUser.favoriteSongs?.map((s) => s.toLowerCase()) || [];
    const userArtists = currentUser.favoriteArtists?.map((a) => a.toLowerCase()) || [];
    const userGenres = currentUser.musicPreferences?.map((g) => g.toLowerCase()) || [];

    const matchSongs = match.favoriteSongs?.map((s) => s.toLowerCase()) || [];
    const matchArtists = match.favoriteArtists?.map((a) => a.toLowerCase()) || [];
    const matchGenres = match.musicPreferences?.map((g) => g.toLowerCase()) || [];

    const commonSongs = matchSongs.filter((s) => userSongs.includes(s));
    const commonArtists = matchArtists.filter((a) => userArtists.includes(a));
    const commonGenres = matchGenres.filter((g) => userGenres.includes(g));

    return { commonSongs, commonArtists, commonGenres };
  };

  return (
    <div className="matches-display">
      {matchedProfiles?.map((match) => {
        const { commonSongs, commonArtists, commonGenres } = getCommonTraits(match);
        const score = commonSongs.length + commonArtists.length + commonGenres.length;
        const badgeText =
          score >= 4 ? "🔥 Perfect Match" : score >= 2 ? "💫 Good Match" : "🎯 Match";

        return (
          <div
            key={match.user_id}
            className="match-card enhanced"
            onClick={() => setClickedUser(match)}
          >
                        <div className="profile-info-row">
              <div className="img-container">
                <img src={match?.url} alt={`${match?.first_name} profile`} />
              </div>
              <h4>{match?.first_name}</h4>
            </div>


            <div className="compatibility-badge">
              {score} {badgeText}
            </div>

            <div className="trait-chips">
              {commonSongs.slice(0, 1).map((song, i) => (
                <span className="chip animated-chip" key={`s-${i}`}>
                   {capitalize(song)}
                </span>
              ))}
              {commonArtists.slice(0, 1).map((artist, i) => (
                <span className="chip animated-chip" key={`a-${i}`}>
                   {capitalize(artist)}
                </span>
              ))}
              
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchesDisplay;
