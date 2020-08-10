import React from "react";

import { Link } from "react-router-dom";

import "./Nav.css";

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curNav: `${window.location.pathname}Nav`,
      homeNavCol: "w3-blue-grey",
      createNavCol: "w3-teal",
      aboutNavCol: "w3-blue",
    };

    this.homeRef = React.createRef();
    this.createRef = React.createRef();
    this.aboutRef = React.createRef();

    this.clearNavClassList = this.clearNavClassList.bind(this);
    this.handleNavLink = this.handleNavLink.bind(this);
  }

  componentDidMount() {
    let currentRouteName = window.location.pathname;
    if (currentRouteName === "/") {
      this.homeRef.current.classList.add("w3-blue-grey");
    }
    if (currentRouteName === "/create") {
      this.createRef.current.classList.add("w3-teal");
    }
    if (currentRouteName === "/home") {
      this.homeRef.current.classList.add("w3-blue");
    }
  }

  handleNavLink(e) {
    const eventName = e.target.name;
    console.log("eventName ,", eventName);
    const eventNameCol = `${eventName}Col`;
    console.log("eventNameCol ,", eventNameCol);
    const eventCol = this.state[eventNameCol];
    console.log("eventCol ,", eventCol);
    const curState = this.state.curNav;

    if (eventName !== curState) {
      this.clearNavClassList();
      this.setState({ curNav: eventName });

      if (eventName === "homeNav") {
        this.homeRef.current.classList.add(eventCol);
      }
      if (eventName === "createNav") {
        this.createRef.current.classList.add(eventCol);
      }
      if (eventName === "aboutNav") {
        this.aboutRef.current.classList.add(eventCol);
      }
    }
  }

  clearNavClassList() {
    this.homeRef.current.classList.remove("w3-blue-grey");
    this.createRef.current.classList.remove("w3-teal");
    this.aboutRef.current.classList.remove("w3-blue");
  }

  render() {
    return (
      <div className="Nav w3-xlarge">
        {/* w3 stylesheet */}
        <link
          rel="stylesheet"
          href="https://www.w3schools.com/w3css/4/w3.css"
        />
        {/* icons stylesheet */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />

        <div className="w3-bar w3-black">
          <Link to="/">
            <button
              ref={this.homeRef}
              className="w3-bar-item w3-button w3-hover-blue-grey"
              name="homeNav"
              onClick={this.handleNavLink}
              style={{ width: "33%" }}
            >
              <i className="fa fa-home" /> Home
            </button>
          </Link>

          <Link to="/create">
            <button
              ref={this.createRef}
              className="w3-bar-item w3-button w3-hover-teal"
              name="createNav"
              onClick={this.handleNavLink}
              style={{ width: "33%" }}
              to="/create"
            >
              <i className="fa fa-cubes" /> Create
            </button>
          </Link>
          <Link to="/about">
            <button
              ref={this.aboutRef}
              className="w3-bar-item w3-button w3-hover-blue"
              name="aboutNav"
              onClick={this.handleNavLink}
              style={{ width: "33%" }}
              to="/about"
            >
              <i className="fa fa-info" /> About
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Nav;
