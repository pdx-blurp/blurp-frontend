import cogwheel_icon from "../assets/cogwheel.svg";
import ellipses_icon from "../assets/ellipses.svg";
import export_icon from "../assets/export_icon.svg";
import React, {useState, useEffect, useRef} from "react";

function System_Toolbar_State (props) {
  // Set the className based on whether the toolbar is expanded
  let system_toolbar_className;
  if(props.expanded)
    system_toolbar_className = "transition ease-in-out transition-all absolute bg-gray-300 h-[100%] ml-[40px] w-[150px] duration-300";
  else
    system_toolbar_className = "transition ease-in-out transition-all absolute bg-gray-300 w-[150px] h-[100%] ml-[-110px] duration-300";

  const ref = useRef(null);
  const ref2 = useRef(null);
  const {onClickOutside} = props;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if(ref.current && !ref.current.contains(event.target) && ref2.current && !ref2.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [onClickOutside]);

  if(!props.show)
    return null;

  return (
    <>
      <div ref={ref2} className={system_toolbar_className}>
        <p>More tools!</p>
      </div>

      <div className="absolute h-[100%] w-[40px] bg-gray-400">
        <button ref={ref} className="flex justify-center h-[40px] my-[5px]" onClick={props.toggle_toolbar}>
          <img className="w-[40px]" src={ellipses_icon}></img>
        </button>
        <button className="flex justify-center h-[40px] my-[15px]" onClick={alert}>
          <img className="w-[40px]" src={cogwheel_icon}></img>
        </button>
        <button className="flex justify-center h-[40px] my-[15px]">
          <img className="w-[40px]" src={export_icon}></img>
        </button>
      </div>
    </>
  )
}

function System_Toolbar() {
  const [expanded, setExpanded] = useState(false);
  const switchToolbar = (event) => {
    if(expanded) collapseToolbar();
    else expandToolbar();
  }
  const expandToolbar = (event) => {
    setExpanded(true);
  };
  const collapseToolbar = (event) => {
    setExpanded(false);
  }

  return (
    <>
    <System_Toolbar_State expanded={expanded} toggle_toolbar={switchToolbar} onClickOutside={collapseToolbar} show/>
    </>
  )
}

export default System_Toolbar;