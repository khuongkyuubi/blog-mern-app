import React, { useContext, useEffect, useRef, useState } from "react";
import "./topbar.css";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Context } from "../../context/Context";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref, setInputClass) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        console.log("You clicked outside of me!");
        setInputClass("");
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref,setInputClass]);
}

function TopBar() {
  const { user, dispatch } = useContext(Context);
  // const PF = "http://localhost:5000/images/";
  const PF = process.env.REACT_APP_STATIC_ENDPOINT + "/images/";
  const [search, setSearch] = useState("");
  const [inputClass, setInputClass] = useState("");
  const history = useHistory();

  const searchInput = useRef(null);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setInputClass);

  const path = useLocation();

  useEffect(() => {
    const searchKey = new URLSearchParams(path.search).get("search");
    searchKey || setInputClass("");
    setSearch(searchKey || "");
  }, [path]);

  const handleLogout = () => {
    dispatch({
      type: "LOGOUT",
    });
    window.location.replace("/");
  };

  const handleSearch = (e) => {
    search ? history.push(`/?search=${search}`) : history.push(`/`);
  };

  const handleFocus = () => {
    //@ts-ignore
    searchInput?.current?.focus();
  };

  return (
    <div className="top">
      <div className="topLeft">
        <i className="topIcon fab fa-facebook-square"></i>
        <i className="topIcon fab fa-twitter-square"></i>
        <i className="topIcon fab fa-pinterest-square"></i>
        <i className="topIcon fab fa-instagram-square"></i>
      </div>

      <div className="topCenter">
        <ul className="topList">
          <li className="topListItem">
            <Link className="link" to="/">
              HOME
            </Link>
          </li>
          <li className="topListItem">
            <Link className="link" to="/">
              ABOUT
            </Link>
          </li>
          <li className="topListItem">
            <Link className="link" to="/">
              CONTACT
            </Link>
          </li>
          <li className="topListItem">
            <Link className="link" to="/write">
              WRITE
            </Link>
          </li>
          <li className="topListItem" onClick={handleLogout}>
            {user && "LOGOUT"}
          </li>
        </ul>
      </div>
      <ul className="topRight">
        {user ? (
          <>
            <Link to={`/?user=${user?.["username"]}`} className="link">
              <span className="topListItem">{user.username}</span>
            </Link>
            <Link to="/settings" className="link">
              <img
                className="topImg"
                src={PF + user.profilePicture}
                alt="Avatar"
              />
            </Link>
          </>
        ) : (
          <ul className="topList">
            <li className="topListItem">
              <Link className="link" to="/login">
                LOGIN
              </Link>
            </li>
            <li className="topListItem">
              <Link className="link" to="/register">
                REGISTER
              </Link>
            </li>
          </ul>
        )}
        <div className={`${inputClass} divSearch `} ref={wrapperRef}>
          <input
            id="searchInput"
            ref={searchInput}
            placeholder="Search..."
            className={"searchInput"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button className="labelSearch" onClick={handleSearch}>
            <i className="fas fa-search" />
          </button>
        </div>

        {!inputClass ? (
          <i
            className={`topSearchIcon ${"fas fa-search"}`}
            onClick={() => {
              setInputClass("showSearch");
              handleFocus();
            }}
          />
        ) : (
          <span className="topSearchIcon">
            <i className={"fas fa-window-close"} />
          </span>
        )}
      </ul>
    </div>
  );
}

export default TopBar;
