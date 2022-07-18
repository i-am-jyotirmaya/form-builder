import React, { ReactNode } from "react";

import styles from "./Modal.module.css";

interface IProps {
  children: ReactNode[] | ReactNode;
  onClose?: VoidFunction;
}
const Modal: React.FC<IProps> = ({ children, onClose }) => {
  return (
    <div>
      <div
        className={styles.backdrop}
        onClick={() => {
          onClose && onClose();
        }}
      ></div>
      <div className={styles.modalRoot}>{children}</div>
    </div>
  );
};

export default Modal;
