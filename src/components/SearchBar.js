import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import history from "../history";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logout from "../svg/logout.png";
const Img = styled.img`
  width: 3rem;
  margin: 0px 1rem 0px 1rem;
`;
const Form = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px var(--shadow-color);
  background-color: var(--color-primary-dark);
  border: 1px solid var(--color-primary);
  width: ${(props) => (props.state ? "30rem" : "2rem")};
  cursor: ${(props) => (props.state ? "auto" : "pointer")};
  padding: 2rem;
  height: 2rem;
  outline: none;
  border-radius: 10rem;
  transition: all 300ms cubic-bezier(0.645, 0.045, 0.355, 1);

  @media ${(props) => props.theme.mediaQueries.large} {
    background-color: var(--color-primary);
    border: 1px solid transparent;
    padding: 1.5rem;
  }

  @media ${(props) => props.theme.mediaQueries.smallest} {
    max-width: 25rem;
  }
`;

const Input = styled.input`
  font-size: 14px;
  line-height: 1;
  font-weight: 300;
  background-color: transparent;
  width: 100%;
  margin-left: ${(props) => (props.state ? "1rem" : "0rem")};
  color: var(--text-color);
  border: none;
  transition: all 300ms cubic-bezier(0.645, 0.045, 0.355, 1);

  @media ${(props) => props.theme.mediaQueries.large} {
    font-size: 13px;
  }

  @media ${(props) => props.theme.mediaQueries.medium} {
    font-size: 12px;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    font-size: 11px;
  }

  &:focus,
  &:active {
    outline: none;
  }

  &::placeholder {
    color: var(--text-color);
  }
`;

const Button = styled.button`
  position: absolute;
  line-height: 1;
  pointer-events: ${(props) => (props.state ? "auto" : "none")};
  cursor: ${(props) => (props.state ? "pointer" : "none")};
  background-color: transparent;
  border: none;
  outline: none;
  color: var(--text-color);

  @media ${(props) => props.theme.mediaQueries.large} {
    color: var(--text-color);
    font-size: 10px;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    color: var(--text-color);
    font-size: 8px;
  }
`;
const Button2 = styled.button`
  line-height: 1;
  background-color: white;
  border-radius: 50%;
  padding: 12;
  outline: none;
  color: var(--text-color);
  margin-left : 10px;

  @media ${(props) => props.theme.mediaQueries.large} {
    color: var(--text-color);
    font-size: 10px;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    color: var(--text-color);
    font-size: 8px;
  }
`;
const SearchBar = () => {
  const [input, setInput] = useState("");
  const [state, setState] = useState(false);
  const node = useRef();
  const inputFocus = useRef();

  useEffect(() => {
    // add when mounted
    document.addEventListener("mousedown", handleClick);
    // cleanup event when unmounted
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  // On click outside, change input state to false
  const handleClick = (e) => {
    if (node.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setState(false);
  };

  function onFormSubmit(e) {
    e.preventDefault();
    if (input.length === 0) {
      return;
    }
    setInput("");
    setState(false);
    history.push(`${process.env.PUBLIC_URL}/search/${input}`);
  }
  function handleLogout() {
    localStorage.setItem("tokenmovieapp", "");
    window.location.href = "/";
  }
  return (
    <div style={{ display: "flex" }}>
      <div style={{marginRight:"10px"}}>
        <input
          type="checkbox"
          id="toogle"
          onClick={() => {
            if (localStorage.getItem("dark") === "false") {
              localStorage.setItem("dark", true);
              document.getElementsByTagName("body")[0].style.backgroundColor =
                "#071b20";
                document.getElementById("ratingTowhite").style.color = "#b0bec5";
                if(document.getElementById("heartTowhite"))
                document.getElementById("heartTowhite").style.stroke = "#b0bec5"
            } else {
              localStorage.setItem("dark", false);
              document.getElementsByTagName("body")[0].style.backgroundColor =
                "white";
                document.getElementById("ratingTowhite").style.color = "black";
                if(document.getElementById("heartTowhite"))
                document.getElementById("heartTowhite").style.stroke = "#263238"

            }
          }}
        />
        <label for="toogle" class="toogle-button"></label>
      </div>
      <Form
        state={state}
        onClick={() => {
          setState(true);
          inputFocus.current.focus();
        }}
        onSubmit={onFormSubmit}
        ref={node}
      >
        <Button type="submit" state={state}>
          <FontAwesomeIcon icon={"search"} size="1x" />
        </Button>
        <Input
          onChange={(e) => setInput(e.target.value)}
          ref={inputFocus}
          value={input}
          state={state}
          placeholder="Search for a movie..."
        />
      </Form>
      <Button2 type="submit" state={state} onClick={handleLogout}>
        <Img style={{ color: 'black',height:"1.5em", width:"1.5em" }} src={logout} class="image" alt="" />
      </Button2>{" "}
    </div>
  );
};

export default SearchBar;
