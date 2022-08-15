import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
import { Context } from "../../context/Context";

export default function Sidebar() {
  const [cats, setCats] = useState([]);
  const { user } = useContext(Context);
  // console.log(user);
  // const PF = "http://localhost:5000/images/";
  const PF = process.env.REACT_APP_STATIC_ENDPOINT + "/images/";
  const AF = process.env.REACT_APP_API_ENDPOINT;

  useEffect(() => {
    const getCats = async () => {
      const res = await axios.get(`${AF}/categories`);
      setCats(res.data);
    };
    getCats();
  }, []);

  const [newestPost, setNewestPost] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // due to using proxy in packet.json
      const res = await axios.get(`${AF}/posts`);
      setNewestPost(res.data[0]);
    };
    fetchData();
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebarItem">
        <span className="sidebarTitle">NEWEST POST</span>
        <div className="postInfo">
          <span className="postDate">
            {new Date(newestPost?.createdAt).toDateString()}
          </span>

          <Link to={`/post/${newestPost?._id}`} className="link">
            <span className="postTitle"> {newestPost?.title}</span>
          </Link>
          {/* <div className="postCats">
            {newestPost?.categories.map((cat, index) => (
              <span key={index} className="postCat">
                {cat[0].toUpperCase() + cat.substr(1)}
              </span>
            ))}
          </div> */}
        </div>
        <Link
          style={{ width: "80%" }}
          to={`/post/${newestPost?._id}`}
          className="link"
        >
          <img
            style={{
              borderRadius: "10px",
              width: "100%",
              aspectRatio: "1/1",
              objectFit: "cover",
            }}
            src={PF + newestPost?.["photo"]}
            alt="img"
          />
        </Link>
        <p className="postDesc">{newestPost?.desc}</p>
      </div>

      <div className="sidebarItem">
        <span className="sidebarTitle">CATEGORIES</span>
        <ul className="sidebarList">
          {cats.map((item, index) => (
            <Link key={index} to={`/?cat=${item.name}`} className="link">
              <li className="sidebarListItem">{item.name}</li>
            </Link>
          ))}
        </ul>
      </div>
      <div className="sidebarItem">
        <span className="sidebarTitle">FOLLOW US</span>
        <div className="sidebarSocial">
          <i className="sidebarIcon fab fa-facebook-square"></i>
          <i className="sidebarIcon fab fa-twitter-square"></i>
          <i className="sidebarIcon fab fa-pinterest-square"></i>
          <i className="sidebarIcon fab fa-instagram-square"></i>
        </div>
      </div>
    </div>
  );
}
