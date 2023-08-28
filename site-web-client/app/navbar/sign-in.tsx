import { Fragment } from "react";
import styles from './sign-in.module.css';

export default function SignIn(){
    return (
        <Fragment>
            <button className={styles.signin}>
                Sign Out
            </button>
            <button className={styles.signin}>
                Sign In
            </button>
        </Fragment>

    );
}