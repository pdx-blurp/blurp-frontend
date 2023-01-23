import cogwheel_icon from "../assets/cogwheel.svg";
import ellipses_icon from "../assets/ellipses.svg";
import export_icon from "../assets/export_icon.svg";
import React, {useState} from "react";

const System_Toolbar_State = props => {
  let system_toolbar_className = "transition ease-in-out transition-all absolute bg-gray-300 w-[150px] h-[100%] ml-[-110px] duration-300";
  if(props.expanded) system_toolbar_className = "transition ease-in-out transition-all absolute bg-gray-300 h-[100%] ml-[40px] w-[150px] duration-300";

  return (
    <>
      <div className={system_toolbar_className}>
        <p>More tools!</p>
      </div>

      <div className="absolute h-[100%] w-[40px] bg-gray-400">
        <button className="flex justify-center h-[40px] my-[5px]" onClick={props.toggle_toolbar}>
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
  const handleViewToolbar = () => {
    setExpanded(!expanded);
  };

  return (
    <>
    <System_Toolbar_State expanded={expanded} toggle_toolbar={handleViewToolbar} />
    </>
  )
}

export default System_Toolbar;