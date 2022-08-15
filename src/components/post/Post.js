import React from "react";
import "./post.css";
import { Link } from "react-router-dom";

function Post({ post }) {
  const PF = `${process.env.REACT_APP_STATIC_ENDPOINT}/images/`;
  return (
    <div className="post">
      {post.photo && (
        <Link to={`/post/${post._id}`} className="link">
          <img className="postImg" src={PF + post?.["photo"]} alt="img" />
        </Link>
      )}
      <div className="postInfo">
        <div className="postCats">
          {post.categories.map((cat, index) => (
            <span key={index} className="postCat">
              {cat[0].toUpperCase() + cat.substr(1)}
            </span>
          ))}
        </div>
        <Link to={`/post/${post._id}`} className="link">
          <span className="postTitle"> {post.title}</span>
        </Link>
        <hr />
        <span className="postDate">
          {new Date(post.createdAt).toDateString()}
        </span>
      </div>
      <p className="postDesc">{post.desc}</p>
    </div>
  );
}

export default Post;
