import "./posts.css";
import Post from "../post/Post";
import React from "react";
function Posts({ posts }) {
  console.log(posts);
  return (
    <div className="posts">
      {posts.length ? posts?.map((post) => (
        <Post key={post._id} post={post} />
      )) : <p className="noPostFound">No post found!</p>}
    </div>
  );
}
export default Posts;
