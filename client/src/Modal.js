import React, {useEffect, useRef} from "react";
import {createPortal} from "react-dom";
import "./css/Modal.css";

const modalRoot = document.getElementById("root");

const Modal = ({children}) => {
    const elRef = useRef(null);
    if(!elRef.current){
        elRef.current = document.createElement("div");
    }

    useEffect(()=>{
        modalRoot.appendChild(elRef.current);
        return () => modalRoot.removeChild(elRef.current);
    }, []);

return createPortal(<div className=".modal-window">{children}</div>, elRef.current);
}

export default Modal;