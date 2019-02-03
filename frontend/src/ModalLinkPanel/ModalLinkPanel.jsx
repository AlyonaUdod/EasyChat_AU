import React from 'react';
import style from './ModalLinkPanel.module.css';

const Modal = ({changeFunction, modalInputName, modalInputLink, imgActive, children, toggleModal}) => {
    console.log(modalInputLink);
    return (
        <div className={style.modalBackdrop} >
            <div className={style.modalWrapper} >
                <div className={style.modalHeader}>
                    <h2>Fill in the fields</h2>
                </div>
                <div className={style.modalContent}>
                {children}
                </div>
                <div className={style.modalFooter}>
                    <button onClick={changeFunction} className={`${style.btn} ${style.modalOkBtn}`}>Ok</button>
                    <button onClick={toggleModal} className={`${style.btn} ${style.modalCancelBtn}`} >Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;