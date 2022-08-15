import React, { useContext, useEffect, useState } from "react";
import "./write.css";
import axios from "axios";
import { Context } from "../../context/Context";

// let categories = [
//   {
//     name: "music",
//   },
//   {
//     name: "tech",
//   },
// ];

function Write() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  // categories
  const [checkedState, setCheckedState] = useState([]);
  const [categories, setCategories] = useState([]);

  const [cats, setCats] = useState([]);

  const { user } = useContext(Context);

  useEffect(() => {
    const getCategoris = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/categories`);
        setCategories(res.data);
        setCheckedState(
          // @ts-ignore
          new Array(res.data.length).fill(false)
        );
      } catch (error) {
        console.log(error);
      }
    };
    getCategoris();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newPost = {
      username: user.username,
      title,
      desc,
      categories: cats,
    };
    if (file) {
      const data = new FormData();
      const filename = "" + Date.now() + file?.["name"];
      data.append("name", filename);
      data.append("file", file);
      newPost.photo = filename;
      // Upload photo
      try {
        await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/upload`, data);
      } catch (error) {
        console.log(error);
      }
    }
    try {
      console.log(newPost);
      const res = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/posts`, newPost);
      window.location.replace(`/post/${res.data._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
    const catList = [];
    updatedCheckedState.map((item, index) => {
      return item && catList.push(categories[index].name);
    });
    setCats(catList);
  };
  console.log(cats);

  return (
    <div className="write">
      {file && (
        <img className="writeImg" src={URL.createObjectURL(file)} alt="" />
      )}
      <form className="writeForm" onSubmit={handleSubmit}>
        <div className="writeForm">
          <div className="categoriesGroup writeFormGroup">
            {categories.map(({ name }, index) => (
              <div key={index} className="categoriesItem">
                <input
                  id={`custom-checkbox-${index}`}
                  type="checkbox"
                  checked={checkedState[index]}
                  onChange={() => handleOnChange(index)}
                />
                <label htmlFor={`custom-checkbox-${index}`}>
                  &nbsp;
                  {
                    // @ts-ignore
                    name[0].toUpperCase() + name.substr(1)
                  }
                </label>
              </div>
            ))}
          </div>
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
              placeholder="Title"
              className="writeInput"
              autoFocus={true}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="writeFormGroup">
            <textarea
              placeholder="Tell your story..."
              className="writeInput writeText"
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        </div>
        <button type="submit" className="writeSubmit">
          Publish
        </button>
      </form>
    </div>
  );
}

export default Write;
