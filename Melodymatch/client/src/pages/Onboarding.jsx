
// import { useState } from "react";
// import Navbar from "../component/Navbar";
// import { useCookies } from "react-cookie";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./Onboarding.css";

// const Onboarding = () => {
 
//   const [ favoriteSongs, setFavoriteSong] = useState("");
//   const [musicPreferences , setMusicPreferences] = useState("");
//   const [favouriteArtists, setFavouriteArtists] = useState("");

//   //  const [cookies] = useCookies(["user"]);
//   const [cookies, setCookie] = useCookies(["user", "onboarded"]);

//   const [formData, setFormData] = useState({
//     user_id: cookies.UserId,
//     first_name: "",
//     dob_day: "",
//     dob_month: "",
//     dob_year: "",
//     show_gender: false,
//     gender_identity: "man",
//     gender_interest: "woman",
//     url: "",
//     about: "",
//     matches: [],
//     favoriteSong:"",
//     favouriteArtists : "",
//     musicPreferences : ""
//   });

//   const navigate = useNavigate();

  

//  const handleSubmit = async (e) => {
//   e.preventDefault();

//   const payload = {
//     ...formData,
//     onboarded: true, // Optional: save in DB too
//     favoriteSongs: formData.favoriteSong.split(",").map(s => s.trim()),
//     favoriteArtists: formData.favouriteArtists.split(",").map(a => a.trim()),
//     musicPreferences: formData.musicPreferences.split(",").map(g => g.trim())
//   };

//   try {
//     const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/user`, payload);

//     if (response.status === 200) {
//       // ✅ Set onboarded flag in cookie
//       setCookie("onboarded", true, { path: "/" });

//       // ✅ Redirect to dashboard (not root)
//       navigate("/dashboard");
//     }
//   } catch (err) {
//     console.error(err);
//   }
// };



//   const handleChange = (e) => {
//     const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: value,
//     }));
//   };

//   return (
//     <>
//       {/* <Navbar minimal={true} showModal={false} setshowModal={() => {}} /> */}
//       <div className="onboarding">
//         <h2>Create Account</h2>
//         <form onSubmit={handleSubmit}>
//           <section className="form-section">
//             <label htmlFor="first_name">First Name</label>
//             <input
//               type="text"
//               id="first_name"
//               name="first_name"
//               placeholder="First name"
//               required
//               value={formData.first_name}
//               onChange={handleChange}
//             />

//             <label>Birthday</label>
//             <div className="multiple-input-container">
//               <input
//                 type="number"
//                 name="dob_day"
//                 placeholder="DD"
//                 required
//                 value={formData.dob_day}
//                 onChange={handleChange}
//               />
//               <input
//                 type="number"
//                 name="dob_month"
//                 placeholder="MM"
//                 required
//                 value={formData.dob_month}
//                 onChange={handleChange}
//               />
//               <input
//                 type="number"
//                 name="dob_year"
//                 placeholder="YYYY"
//                 required
//                 value={formData.dob_year}
//                 onChange={handleChange}
//               />
//             </div>

//             <label>Gender</label>
//             <div className="multiple-input-container">
//               <input
//                 type="radio"
//                 name="gender_identity"
//                 value="man"
//                 onChange={handleChange}
//                 checked={formData.gender_identity === "man"}
//               />
//               <label>Man</label>

//               <input
//                 type="radio"
//                 name="gender_identity"
//                 value="woman"
//                 onChange={handleChange}
//                 checked={formData.gender_identity === "woman"}
//               />
//               <label>Woman</label>

//               <input
//                 type="radio"
//                 name="gender_identity"
//                 value="more"
//                 onChange={handleChange}
//                 checked={formData.gender_identity === "more"}
//               />
//               <label>More</label>
//             </div>

//             <label htmlFor="show_gender">Show gender on my profile</label>
//             <input
//               type="checkbox"
//               id="show_gender"
//               name="show_gender"
//               onChange={handleChange}
//               checked={formData.show_gender}
//             />

//             <label>Show me</label>
//             <div className="multiple-input-container">
//               <input
//                 type="radio"
//                 name="gender_interest"
//                 value="man"
//                 onChange={handleChange}
//                 checked={formData.gender_interest === "man"}
//               />
//               <label>Man</label>

//               <input
//                 type="radio"
//                 name="gender_interest"
//                 value="woman"
//                 onChange={handleChange}
//                 checked={formData.gender_interest === "woman"}
//               />
//               <label>Woman</label>

//               <input
//                 type="radio"
//                 name="gender_interest"
//                 value="everyone"
//                 onChange={handleChange}
//                 checked={formData.gender_interest === "everyone"}
//               />
//               <label>Everyone</label>
//             </div>
//             <label> Song Preference</label>
//                <input
//                   type="text"
//                   name = "favouriteSongs"
//                   placeholder="Enter your favorite song"
//                   value={formData.favoriteSong}
//                   onChange={(e) => setFormData({...formData , favoriteSong: e.target.value})}
//                 />
//               <label > Favourite genre </label>
//                 <input
//                   type="text"
//                   name = "favourite Artists"
//                   placeholder="Enter genres (comma-separated)"
//                   value={formData.musicPreferences}
//                   onChange={(e) => setFormData({...formData , musicPreferences :e.target.value})}
//                 />
//                 <label > Favourite Artists</label>
//                 <input
//                  type="text"
//                  name ="musicPreferences"
//                  placeholder="Enter your favourite Artists"
//                  value={formData.favouriteArtists}
//                  onChange={(e) => setFormData({...formData , favouriteArtists: e.target.value})}
//                  />


//             <label htmlFor="about">About me</label>
//             <input
//               type="text"
//               id="about"
//               name="about"
//               placeholder="I like music..."
//               required
//               value={formData.about}
//               onChange={handleChange}
//             />

//             <input type="submit" className="submit-btn" value="Submit" />
//           </section>

//           <section className="form-section photo-section">
//             <label htmlFor="url">Profile photo URL</label>
//             <input
//               type="url"
//               name="url"
//               required
//               onChange={handleChange}
//             />
//             <div className="photo-preview">
//               {formData.url && <img src={formData.url} alt="Profile preview" />}
//             </div>
//           </section>
//         </form>
//       </div>
//     </>
//   );
// };

// export default Onboarding;

// import { useState } from "react";
// import Navbar from "../component/Navbar";
// import { useCookies } from "react-cookie";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Select from "react-select";
// import debounce from "lodash.debounce";
// import "./Onboarding.css";

// const Onboarding = () => {
//   const [cookies, setCookie] = useCookies(["user", "onboarded"]);
//   const [artistOptions, setArtistOptions] = useState([]);
//   const [selectedArtists, setSelectedArtists] = useState([]);
//   const [formData, setFormData] = useState({
//     user_id: cookies.UserId,
//     first_name: "",
//     dob_day: "",
//     dob_month: "",
//     dob_year: "",
//     show_gender: false,
//     gender_identity: "man",
//     gender_interest: "woman",
//     url: "",
//     about: "",
//     matches: [],
//     favoriteSong: "",
//     musicPreferences: "",
//   });

//   const navigate = useNavigate();

//   const fetchArtists = debounce(async (inputValue) => {
//     if (!inputValue) return;
//     try {
//       const res = await axios.get("https://itunes.apple.com/search", {
//         params: {
//           term: inputValue,
//           entity: "musicArtist",
//           limit: 10,
//         },
//       });

//       const options = res.data.results.map((artist) => ({
//         value: artist.artistName,
//         label: artist.artistName,
//       }));

//       setArtistOptions(options);
//     } catch (err) {
//       console.error("Artist fetch error:", err);
//     }
//   }, 400);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       ...formData,
//       onboarded: true,
//       favoriteSongs: formData.favoriteSong.split(",").map((s) => s.trim()),
//       favoriteArtists: selectedArtists.map((a) => a.value),
//       musicPreferences: formData.musicPreferences.split(",").map((g) => g.trim()),
//     };

//     try {
//       const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/user`, payload);
//       if (response.status === 200) {
//         setCookie("onboarded", true, { path: "/" });
//         navigate("/dashboard");
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleChange = (e) => {
//     const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: value,
//     }));
//   };

//   return (
//     <div className="onboarding">
//       <h2>Create Account</h2>
//       <form onSubmit={handleSubmit}>
//         <section className="form-section">
//           <label htmlFor="first_name">First Name</label>
//           <input
//             type="text"
//             id="first_name"
//             name="first_name"
//             placeholder="First name"
//             required
//             value={formData.first_name}
//             onChange={handleChange}
//           />

//           <label>Birthday</label>
//           <div className="multiple-input-container">
//             <input type="number" name="dob_day" placeholder="DD" required value={formData.dob_day} onChange={handleChange} />
//             <input type="number" name="dob_month" placeholder="MM" required value={formData.dob_month} onChange={handleChange} />
//             <input type="number" name="dob_year" placeholder="YYYY" required value={formData.dob_year} onChange={handleChange} />
//           </div>

//           <label>Gender</label>
//           <div className="multiple-input-container">
//             <input type="radio" name="gender_identity" value="man" onChange={handleChange} checked={formData.gender_identity === "man"} />
//             <label>Man</label>
//             <input type="radio" name="gender_identity" value="woman" onChange={handleChange} checked={formData.gender_identity === "woman"} />
//             <label>Woman</label>
//             <input type="radio" name="gender_identity" value="more" onChange={handleChange} checked={formData.gender_identity === "more"} />
//             <label>More</label>
//           </div>

//           <label htmlFor="show_gender">Show gender on my profile</label>
//           <input type="checkbox" id="show_gender" name="show_gender" onChange={handleChange} checked={formData.show_gender} />

//           <label>Show me</label>
//           <div className="multiple-input-container">
//             <input type="radio" name="gender_interest" value="man" onChange={handleChange} checked={formData.gender_interest === "man"} />
//             <label>Man</label>
//             <input type="radio" name="gender_interest" value="woman" onChange={handleChange} checked={formData.gender_interest === "woman"} />
//             <label>Woman</label>
//             <input type="radio" name="gender_interest" value="everyone" onChange={handleChange} checked={formData.gender_interest === "everyone"} />
//             <label>Everyone</label>
//           </div>

//           <label>🎵 Favorite Songs</label>
//           <input
//             type="text"
//             name="favoriteSong"
//             placeholder="Enter favorite songs (comma-separated)"
//             value={formData.favoriteSong}
//             onChange={(e) => setFormData({ ...formData, favoriteSong: e.target.value })}
//           />

//           <label>🎧 Favorite Genres</label>
//           <input
//             type="text"
//             name="musicPreferences"
//             placeholder="Enter genres (comma-separated)"
//             value={formData.musicPreferences}
//             onChange={(e) => setFormData({ ...formData, musicPreferences: e.target.value })}
//           />

//           <label>🎤 Favorite Artists</label>
//           <Select
//             isMulti
//             onInputChange={fetchArtists}
//             options={artistOptions}
//             value={selectedArtists}
//             onChange={setSelectedArtists}
//             placeholder="Search and select artists..."
//             className="react-select"
//           />

//           <label htmlFor="about">About me</label>
//           <input
//             type="text"
//             id="about"
//             name="about"
//             placeholder="I like music..."
//             required
//             value={formData.about}
//             onChange={handleChange}
//           />

//           <input type="submit" className="submit-btn" value="Submit" />
//         </section>

//         <section className="form-section photo-section">
//           <label htmlFor="url">Profile photo URL</label>
//           <input type="url" name="url" required onChange={handleChange} />
//           <div className="photo-preview">
//             {formData.url && <img src={formData.url} alt="Profile preview" />}
//           </div>
//         </section>
//       </form>
//     </div>
//   );
// };

// export default Onboarding;

import { useState } from "react";
import Navbar from "../component/Navbar";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import makeAnimated from "react-select/animated";
import "./Onboarding.css";

const animatedComponents = makeAnimated();

const Onboarding = () => {
  const [cookies, setCookie] = useCookies(["user", "onboarded"]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_id: cookies.UserId,
    first_name: "",
    dob_day: "",
    dob_month: "",
    dob_year: "",
    show_gender: false,
    gender_identity: "man",
    gender_interest: "woman",
    url: "",
    about: "",
    matches: [],
    favoriteSongs: [],
    favoriteArtists: [],
    musicPreferences: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      onboarded: true
    };

    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/user`, payload);
      if (response.status === 200) {
        setCookie("onboarded", true, { path: "/" });
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const loadSongs = async (inputValue) => {
    if (!inputValue) return [];
    try {
      const res = await axios.get(`https://itunes.apple.com/search`, {
        params: { term: inputValue, media: "music", limit: 10 },
      });
      return res.data.results.map((item) => ({ label: item.trackName, value: item.trackName }));
    } catch {
      return [];
    }
  };

  const loadArtists = async (inputValue) => {
    if (!inputValue) return [];
    try {
      const res = await axios.get(`https://itunes.apple.com/search`, {
        params: { term: inputValue, media: "music", entity: "musicArtist", limit: 10 },
      });
      return res.data.results.map((item) => ({ label: item.artistName, value: item.artistName }));
    } catch {
      return [];
    }
  };

  const loadGenres = async (inputValue) => {
    if (!inputValue) return [];
    try {
      const res = await axios.get(`https://itunes.apple.com/search`, {
        params: { term: inputValue, media: "music", limit: 10 },
      });
      const uniqueGenres = [...new Set(res.data.results.map((item) => item.primaryGenreName))];
      return uniqueGenres.map((genre) => ({ label: genre, value: genre }));
    } catch {
      return [];
    }
  };

  return (
    <div className="onboarding">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <section className="form-section">
          <label htmlFor="first_name">First Name</label>
          <input type="text" name="first_name" required value={formData.first_name} onChange={handleChange} />

          <label>Birthday</label>
          <div className="multiple-input-container">
            <input type="number" name="dob_day" placeholder="DD" value={formData.dob_day} onChange={handleChange} />
            <input type="number" name="dob_month" placeholder="MM" value={formData.dob_month} onChange={handleChange} />
            <input type="number" name="dob_year" placeholder="YYYY" value={formData.dob_year} onChange={handleChange} />
          </div>

          <label>Gender</label>
          <div className="multiple-input-container">
            <input type="radio" name="gender_identity" value="man" checked={formData.gender_identity === "man"} onChange={handleChange} /><label>Man</label>
            <input type="radio" name="gender_identity" value="woman" checked={formData.gender_identity === "woman"} onChange={handleChange} /><label>Woman</label>
            <input type="radio" name="gender_identity" value="more" checked={formData.gender_identity === "more"} onChange={handleChange} /><label>More</label>
          </div>

          <label htmlFor="show_gender">Show gender on my profile</label>
          <input type="checkbox" name="show_gender" checked={formData.show_gender} onChange={handleChange} />

          <label>Show me</label>
          <div className="multiple-input-container">
            <input type="radio" name="gender_interest" value="man" checked={formData.gender_interest === "man"} onChange={handleChange} /><label>Man</label>
            <input type="radio" name="gender_interest" value="woman" checked={formData.gender_interest === "woman"} onChange={handleChange} /><label>Woman</label>
            <input type="radio" name="gender_interest" value="everyone" checked={formData.gender_interest === "everyone"} onChange={handleChange} /><label>Everyone</label>
          </div>

          <label>🎵 Favorite Songs</label>
          <AsyncSelect
            isMulti
            cacheOptions
            components={animatedComponents}
            loadOptions={loadSongs}
            defaultOptions
            onChange={(selected) => setFormData({ ...formData, favoriteSongs: selected.map((s) => s.value) })}
          />

          <label>🎤 Favorite Artists</label>
          <AsyncSelect
            isMulti
            cacheOptions
            components={animatedComponents}
            loadOptions={loadArtists}
            defaultOptions
            onChange={(selected) => setFormData({ ...formData, favoriteArtists: selected.map((a) => a.value) })}
          />

          <label>🎧 Music Preferences (Genres)</label>
          <AsyncSelect
            isMulti
            cacheOptions
            components={animatedComponents}
            loadOptions={loadGenres}
            defaultOptions
            onChange={(selected) => setFormData({ ...formData, musicPreferences: selected.map((g) => g.value) })}
          />

          <label htmlFor="about">About me</label>
          <input type="text" name="about" placeholder="I like music..." required value={formData.about} onChange={handleChange} />

          <input type="submit" className="submit-btn" value="Submit" />
        </section>

        <section className="form-section photo-section">
          <label htmlFor="url">Profile photo URL</label>
          <input type="url" name="url" required onChange={handleChange} />
          <div className="photo-preview">
            {formData.url && <img src={formData.url} alt="Profile preview" />}
          </div>
        </section>
      </form>
    </div>
  );
};

export default Onboarding;
