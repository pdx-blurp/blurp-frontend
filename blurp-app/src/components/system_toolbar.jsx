import cogwheel_icon from '../assets/cogwheel.svg';
import upload_icon from '../assets/temp_upload_icon.png';
import ellipses_icon from '../assets/ellipses.svg';
import export_icon from '../assets/export_icon.svg';
import React, { useState, useEffect, useRef, forwardRef } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { MODAL_VIEW } from '../constants/constants';

const System_Toolbar_State = forwardRef((props, ref) => {
  // Set the className based on whether the toolbar is expanded
  let system_toolbar_className;
  if (props.expanded) system_toolbar_className = 'system-toolbar ml-[40px] duration-300';
  else system_toolbar_className = 'system-toolbar ml-[-110px] duration-300';

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

  const { onClickOutside } = props;

  useEffect(() => {
    // Collapse toolbar if the click was outside the toolbar or (...) button.
    const handleClickOutside = (event) => {
      if (
        expanded_div_ref.current &&
        !expanded_div_ref.current.contains(event.target) &&
        ellipses_button_ref.current &&
        !ellipses_button_ref.current.contains(event.target)
      ) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [onClickOutside]);

  if (!props.show) return null;

  function handleCogwheelClick() {
    alert('[WIP] Personal Account Settings');
  }

  function handleImportClick() {
    props.upload();
  }

  function handleExportClick() {
    props.download();
  }

  function handleModalToggle() {
    props.changeModal(true, props.modal.view);
  }

  function handleScreenshotClick() {
    props.screenshotMap();
  }

  function handleModalSave() {
    if (props.mapTitle == '') {
      props.msgs.current.showMessage('Need to provide a title!');
    } else if (props.profile.sessionID == '') {
      props.msgs.current.showMessage('Need to be logged in!');
    } else if (props.profile.mapID != '') {
      props.msgs.current.showMessage('Map already saved in DB');
    } else {
      props.SaveToDB(props.mapTitle);
      props.msgs.current.showMessage('Saved to account!');
    }
  }

  return (
    <>
      <div ref={ellipses_button_ref} className={system_toolbar_className}>
        <button onClick={handleModalToggle} className="btn-test">
          My Maps
        </button>
        <button onClick={handleModalSave} className="btn-test">
          Save Map
        </button>
        <button onClick={handleScreenshotClick} className="btn-test">
          Screenshot
        </button>
      </div>
      <div className="absolute h-[100%] w-[40px] border-r-[2px] border-gray-400 bg-gray-300">
        <Tooltip title="More tools" enterDelay={600} placement="right" arrow>
          <button
            ref={expanded_div_ref}
            className="system-toolbar-button"
            onClick={props.toggle_toolbar}>
            <img alt="More tools" className="w-[40px]" src={ellipses_icon}></img>
          </button>
        </Tooltip>
        <Tooltip title="Save to file" enterDelay={600} placement="right" arrow>
          <button className="system-toolbar-button">
            <img
              alt="Export map"
              className="w-[40px]"
              src={export_icon}
              onClick={handleExportClick}></img>
          </button>
        </Tooltip>
        <Tooltip title="Load from file" enterDelay={600} placement="right" arrow>
          <button className="system-toolbar-button" onClick={handleImportClick}>
            <img alt="Import map" className="w-[40px]" src={upload_icon}></img>
          </button>
        </Tooltip>
        <Tooltip
          className="absolute left-0 bottom-0"
          title="Settings"
          enterDelay={600}
          placement="right"
          arrow>
          <button className="system-toolbar-button" onClick={handleCogwheelClick}>
            <img alt="Settings" className="w-[40px]" src={cogwheel_icon}></img>
          </button>
        </Tooltip>
      </div>
    </>
  );
});

const System_Toolbar = forwardRef((props, ref) => {
  const [expanded, setExpanded] = useState(false);
  // Function to collapse if expanded, expand if collapsed:
  const switchToolbar = (event) => {
    if (expanded) collapseToolbar();
    else expandToolbar();
  };
  const expandToolbar = (event) => {
    setExpanded(true);
  };
  const collapseToolbar = (event) => {
    setExpanded(false);
  };

  return (
    <>
      <System_Toolbar_State
        SaveToDB={props.SaveToDB}
        LoadFromDB={props.LoadFromDB}
        msgs={props.msgs}
        mapTitle={props.mapTitle}
        modal={props.modal}
        profile={props.profile}
        changeModal={props.changeModal}
        download={props.download}
        upload={props.upload}
        screenshotMap={props.screenshotMap}
        expanded={expanded}
        toggle_toolbar={switchToolbar}
        onClickOutside={collapseToolbar}
        show
      />
    </>
  );
});

export default System_Toolbar;
