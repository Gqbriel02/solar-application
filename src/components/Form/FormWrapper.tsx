import React, {ReactNode} from "react";
import styles from './FormWrapper.module.css';

type FormWrapperProps = {
    title: string;
    children: ReactNode;
}

export function FormWrapper({title, children}: FormWrapperProps) {
    return (
        <>
            <h2 className={styles['header']}>{title}</h2>
            <div className={styles['body']}>{children}</div>
        </>
    );
}
