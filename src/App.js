import React, { useContext } from "react";
import "./App.css";
import TopBar from "./components/topbar/TopBar";
import Home from "./pages/home/Home";
import Write from "./pages/write/Write";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Settings from "./pages/settings/Settings";
import Single from "./pages/single/Single";
import { Context } from "./context/Context";
import AlertDialogSlide from "./components/dialog/AlertDialogSlide";
import BottomBar from "./components/bottombar/BottomBar";
function App() {
  const { user } = useContext(Context);

  return (
    <Router>
      <TopBar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/login">
          {user ? <Redirect to="/" /> : <Login />}
        </Route>
        <Route exact path="/register">
          {user ? <Redirect to="/" /> : <Register />}
        </Route>
        <Route exact path="/settings">
          {user ? <Settings /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/post/:postId">
          {" "}
          <Single />
        </Route>
        <Route exact path="/write">
          {user ? <Write /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/dialog">
          <AlertDialogSlide/>
        </Route>

      </Switch>
      <BottomBar/>
    </Router>
  );
}

export default App;
