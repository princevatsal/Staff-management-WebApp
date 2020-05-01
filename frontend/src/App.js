import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Loading from "./pages/Loading";
const App = () => (
  <Router>
    <div className="container">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/Loading" component={Loading} />
        {/* <Route exact path="/" component={Home} />
                <Route exact path="/users/:handle" component={User} />
                <Route
                  exact
                  path="/users/:handle/post/:postId"
                  component={User}
                /> */}
      </Switch>
    </div>
  </Router>
);

export default App;
