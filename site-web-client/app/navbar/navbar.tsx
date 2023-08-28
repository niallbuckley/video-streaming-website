import Image from "next/image";
import styles from "./navbar.module.css"

import Link from "next/link";
import SignIn from "./sign-in";

export default function Navbar(){
    return (
        <nav className={styles.nav}>
            <Link href="/">
                <Image width={90} height={20} src="/youtube-logo.svg" alt="You Tube Logo"/> 
            </Link>
            <SignIn/>
        </nav>
    );
} 