import { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import PrivateRoute from "./components/privateRoute";

import {AppContext} from "./context/appContext";
import {API, setAuthToken} from "./config/API";

// component
import LandingPage from "./pages/LandingPage";
import Post from "./pages/Post";
import DetailPost from "./pages/DetailPost";
import Profile from "./pages/Profile";
import Order from "./pages/Order";
import NotFound from "./pages/NotFound";
import Logout from "./components/Logout";
import Home from "./pages/Home";
import EditProfile from "./pages/EditProfile";
import Hire from "./pages/Hire";
import Project from "./pages/Project";
import ViewProject from "./pages/ViewProject";
import ProfileUser from "./pages/ProfileUser";

// img avatar
import avatar from "./assets/img/avatar/avatarUser.png";

// style scss
import "./Main.scss";

if (localStorage.token) {
  setAuthToken(localStorage.token)
}


function App() {

  const [state, dispatch] = useContext(AppContext);

  

  const loadUser = async () => {
    try {
      // jika ada user yang mencoba bypass url untk masuk kesistem tanpa login
      // cek token login ada atau tidak
      const response = await API("/check-auth");
      console.log("respon auth : ",response);

      // jka tidak ada token tampilkan error dan arahkan ke logout
      if (response.status === 401) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }


      // jika user masih mempunyai token maka akan diarahkan ke home==dashboard user
      dispatch({
        type: "USER_LOADED",
        payload: response.data.data
      });

    } catch (err) {
      dispatch({
        type: "AUTH_ERROR",
      });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <Router>
      <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>

          <PrivateRoute exact path="/logout" component={Logout} />

          {/* <PrivateRoute exact path="/detail/:id" component={Detail} /> */}
          <PrivateRoute exact path="/home" component={Home} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/user/:id" component={ProfileUser} />
          <PrivateRoute exact path="/edit-profile/:id" component={EditProfile} />
          <PrivateRoute exact path="/post" component={Post} />
          <PrivateRoute exact path="/post/:id" component={DetailPost} />
          <PrivateRoute exact path="/transactions" component={Order} />
          <PrivateRoute exact path="/project/:id" component={Project} />
          <PrivateRoute exact path="/hire/:id" component={Hire} />
          <PrivateRoute exact path="/view-project/:id" component={ViewProject} />
          {/* <Route exact path="/detail/:id"> */}
          <Route>
            <NotFound />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
