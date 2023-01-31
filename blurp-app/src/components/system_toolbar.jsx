import cogwheel_icon from "../assets/cogwheel.svg";
import ellipses_icon from "../assets/ellipses.svg";
import export_icon from "../assets/export_icon.svg";
import React, {useState, useEffect, useRef} from "react";

function System_Toolbar_State (props) {

  // Set the className based on whether the toolbar is expanded
  let system_toolbar_className;
  if(props.expanded)
    system_toolbar_className = "system-toolbar ml-[40px] duration-300";
  else
    system_toolbar_className = "system-toolbar ml-[-110px] duration-300";

  // When onMouseDown is detected, the expanded system-toolbar will collapse
  // (i.e., when the user clicks away). Since we don't want the toolbar to
  // collapse if the click is inside the collapsable system-toolbar or on the
  // ellipses (...) icon, we will detect if the click was inside one of these.
  // By applying the refs below to the two elements, we can detect if the click
  // was inside one of the areas where we don't want to collapse the toolbar.
  //
  // Note: we don't a click-away on the (...) button to collapse because the
  // (...) button already handles that.
  const expanded_div_ref = useRef(null);
  const ellipses_button_ref = useRef(null);

  const {onClickOutside} = props;

  useEffect(() => {
    // Collapse toolbar if the click was outside the toolbar or (...) button.
    const handleClickOutside = (event) => {
      if(expanded_div_ref.current && !expanded_div_ref.current.contains(event.target) &&
        ellipses_button_ref.current && !ellipses_button_ref.current.contains(event.target)) {
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

  function handleCogwheelClick() {
    alert("Cogwheel clicked.");
  }

  function handleExportClick() {
    alert("Export clicked.");
  }

  return (
    <>
      <div ref={ellipses_button_ref} className={system_toolbar_className}>
        <p>More tools!</p>
      </div>

      <div className="absolute h-[100%] w-[40px] bg-gray-400">
        <button ref={expanded_div_ref} className="system-toolbar-button"
          onClick={props.toggle_toolbar}>
          <img className="w-[40px]" src={ellipses_icon}></img>
        </button>
        <button className="system-toolbar-button" onClick={handleCogwheelClick}>
          <img className="w-[40px]" src={cogwheel_icon}></img>
        </button>
        <button className="system-toolbar-button">
          <img className="w-[40px]" src={export_icon} onClick={handleExportClick}></img>
        </button>
      </div>
    </>
  )
}

function System_Toolbar() {

  const [expanded, setExpanded] = useState(false);
  // Function to collapse if expanded, expand if collapsed:
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
    <System_Toolbar_State expanded={expanded}
      toggle_toolbar={switchToolbar} onClickOutside={collapseToolbar} show/>
    </>
  )
}

export default System_Toolbar;