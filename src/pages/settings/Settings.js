import React, { useContext,  useEffect,  useState } from "react";
import "./settings.css";
import Sidebar from "../../components/sizebar/Sidebar";
import { Context } from "../../context/Context";
import axios from "axios";
import AlertDialogSlide from "../../components/dialog/Dialog";

function Settings() {
  const { user, dispatch } = useContext(Context);
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedUser = {
      userId: user._id,
      oldUserName: user.username,
      username,
      email,
      password,
    };
    dispatch({
      type: "UPDATE_START",
    });
    if (file) {
      const data = new FormData();
      const filename = "" + Date.now() + file?.["name"];
      data.append("name", filename);
      data.append("file", file);
      updatedUser.profilePicture = filename;
      // Upload photo
      try {
        await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/upload`, data);
      } catch (error) {
        console.log(error);
      }
    }
    try {
      console.log(updatedUser);
      const res = await axios.put(
        `${process.env.REACT_APP_API_ENDPOINT}/users/${user._id}`,
        updatedUser
      );
      dispatch({
        type: "UPDATE_SUCCESS",
        payload: res.data,
      });
      setSuccess(true);
      console.log("Update success");
    } catch (error) {
      dispatch({
        type: "UPDATE_FAILURE",
      });
      console.log(error);
    }
  };

  // const PF = "http://localhost:5000/images/";
  const PF = process.env.REACT_APP_STATIC_ENDPOINT + "/images/";
  useEffect(() => {
    document.title = "Settings Page";
  });

  return (
    <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsUpdateTitle">Update Your Account</span>
          <AlertDialogSlide user={user} dispatch={dispatch} />
        </div>
        <form className="settingsForm" onSubmit={handleUpdate}>
          <label>Profile Picture</label>
          <div className="settingsPP">
            {file ? (
              <img src={URL.createObjectURL(file)} alt="avatar" />
            ) : (
              <img src={PF + user.profilePicture} alt="avatar" />
            )}
            <label htmlFor="fileInput">
              <i className="settingsPPIcon fa-solid fa-circle-user"></i>
            </label>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              style={{ display: "none" }}
              //@ts-ignore
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <label>Username</label>
          <input
            autoFocus
            type="text"
            name="username"
            value={username}
            placeholder={user.username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder={user.email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="Password"
            name="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="settingsSubmit">
            Update
          </button>
          {success && (
            <span style={{ color: "green", marginTop: "20px" }}>
              Profile has been updated!
            </span>
          )}
        </form>
      </div>
      <Sidebar />
    </div>
  );
}

export default Settings;
