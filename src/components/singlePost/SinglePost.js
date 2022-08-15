import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import "./singlePost.css";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
function SinglePost() {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const [post, setPost] = useState();
  const PF = process.env.REACT_APP_STATIC_ENDPOINT + "/images/";
  const AF = process.env.REACT_APP_API_ENDPOINT;
  const { user } = useContext(Context);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [updateMode, setUpdateMode] = useState(false);

  useEffect(() => {
    setFile(null);
    const getPost = async () => {
      try {
        const res = await axios.get(`${AF}/posts/${path}`);
        setPost(res.data);
        setTitle(res.data.title);
        setDesc(res.data.desc);
      } catch (error) {
        console.log(error);
      }
    };

    getPost();
  }, [path]);

  useEffect(() => {
    document.title = title;
  });

  const handleDelete = async () => {
    try {
      await axios.delete(`${AF}/posts/${path}`, {
        data: { username: user.username },
      });
      window.location.replace("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      let filename = "";
      if (file) {
        const data = new FormData();
        filename = "" + Date.now() + file?.["name"];
        data.append("name", filename);
        data.append("file", file);
        // Upload photo data and handle with multer
        try {
          await axios.post(`${AF}/upload`, data);
        } catch (error) {
          console.log(error);
        }
      }
      console.log(user);

      await axios.put(`${AF}/posts/${post._id}`, {
        username: user.username,
        oldPhoto: post?.["photo"],
        title,
        desc,
        photo: filename || post?.["photo"],
      });
      setUpdateMode(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="singlePost">
      {post && (
        <div className="singlePostWrapper">
          {file ? (
            <img
              className="singlePostImg"
              src={URL.createObjectURL(file)}
              alt=""
            />
          ) : (
            <img src={PF + post?.["photo"]} alt="" className="singlePostImg" />
          )}

          {updateMode && <div></div>}

          {updateMode ? (
            <div className="writeFormGroup">
              <label htmlFor="fileInput">
                <i className="writeIcon fa-solid fa-plus"></i>
              </label>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                style={{ display: "none" }}
                //@ts-ignore
                onChange={(e) => setFile(e.target.files[0])}
              />
              <input
                type="text"
                value={title}
                className="singlePostTitleInput"
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          ) : (
            <h1 className="singlePostTitle">
              {post?.["title"]}

              {post?.["username"] === user?.["username"] && (
                <div className="singlePostEdit">
                  <i
                    className="singlePostIcon fa-solid fa-pen-to-square"
                    onClick={setUpdateMode.bind(this, true)}
                  />
                  <i
                    className="singlePostIcon fa-solid fa-trash-can"
                    onClick={handleDelete}
                  />
                </div>
              )}
            </h1>
          )}
          <div className="singlePostInfo">
            <span className="singlePostAuthor">
              Author:
              <Link to={`/?user=${post?.["username"]}`} className="link">
                <b> {post?.["username"]}</b>
              </Link>
            </span>
            <span className="singlePostDate">
              {" "}
              {new Date(post?.["createdAt"])?.toDateString()}
            </span>
          </div>
          {updateMode ? (
            <textarea
              value={desc}
              className="singlePostDescInput"
              onChange={(e) => setDesc(e.target.value)}
            />
          ) : (
            <p className="singlePostDesc">{post?.["desc"]}</p>
          )}
        </div>
      )}
      {updateMode && (
        <button className="singlePostButton" onClick={handleUpdate}>
          Update
        </button>
      )}
    </div>
  );
}

export default SinglePost;
