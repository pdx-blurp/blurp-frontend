import { useState, useRef, useEffect } from 'react';
import TempMessage from './temp_msg_display';

function ConfirmDeleteForm (props) {

  const HIDDEN_FORM_CLASS = 'confirm-delete-form hidden';
  const VISIBLE_FORM_CLASS = 'confirm-delete-form';
  const tempMsgRef = useRef(null);

  // The confirm delete form is hidden by default:
  const [formClass, setFormClass] = useState(HIDDEN_FORM_CLASS);
  const form_ref = useRef(null);

  function hideForm() {
    setFormClass(HIDDEN_FORM_CLASS);
  }

  function showForm() {
    setFormClass(VISIBLE_FORM_CLASS);
  }

  function delete_clicked() {
    hideForm();
    tempMsgRef.current.showMessage();
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
      <TempMessage message='Object was deleted' duration={1500} ref={tempMsgRef}></TempMessage>
    </>
  );
}

export default ConfirmDeleteForm;