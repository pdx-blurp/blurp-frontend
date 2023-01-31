import { useState, useRef, useEffect } from "react";

function ConfirmDeleteForm (props) {

  const HIDDEN_FORM_CLASS = 'confirm-delete-form hidden';
  const VISIBLE_FORM_CLASS = 'confirm-delete-form';
  const HIDDEN_MSG_CLASS = 'obj-deleted-msg opacity-0';
  const VISIBLE_MSG_CLASS = 'obj-deleted-msg';

  const [formClass, setFormClass] = useState(VISIBLE_FORM_CLASS);
  const [objDeletedMsgClass, setObjDeletedMsgClass] = useState(HIDDEN_MSG_CLASS);
  const form_ref = useRef(null);

  function hideForm() {
    setFormClass(HIDDEN_FORM_CLASS);
  }
  function showForm() {
    setFormClass(VISIBLE_FORM_CLASS);
  }
  function delete_clicked() {
    hideForm();
    show_deleted_message();
  }
  function show_deleted_message() {
    setObjDeletedMsgClass(VISIBLE_MSG_CLASS);
    setTimeout(hide_deleted_message, 1500);
  }
  function hide_deleted_message() {
    setObjDeletedMsgClass(HIDDEN_MSG_CLASS);
  }

  useEffect(() => {
    // Collapse toolbar if the click was outside the toolbar or (...) button.
    const handleClickOutside = (event) => {
      if(form_ref.current && !form_ref.current.contains(event.target)) {
        hideForm && hideForm();
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [hideForm]);

  return (
    <>
      <div className={formClass} ref={form_ref}>
        <div className='absolute flex w-full mt-[10px] justify-center'>
        <p><b>Are you sure you want to delete this object?</b></p>
        </div>
        <div className='absolute flex w-full mt-[45px] justify-center'>
        <button className="confirm-delete-btn-yes" onClick={delete_clicked}>
          <b>Yes, delete</b>
        </button>
        <button className="confirm-delete-btn-no" onClick={hideForm}>
          <b>Cancel</b>
        </button>
        </div>
      </div>
      <div className={objDeletedMsgClass}>
        <p>Object was deleted</p>
      </div>
    </>
  );
}

export default ConfirmDeleteForm;