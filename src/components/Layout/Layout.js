import Head from "next/head";
import styles from './Layout.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Brightness6Rounded } from "@material-ui/icons";

const Layout = ({children, title="Pokemon Ranked"}) =>{

    const [theme, setTheme] = useState('light');

    useEffect(() => {
        document.documentElement.setAttribute(
            'data-theme',
            localStorage.getItem('theme')
        );
        setTheme(localStorage.getItem('theme'))
    }, []);

    const switchTheme = () =>{
        if (theme === 'light'){
            saveTheme('dark');
        } else {
            saveTheme('light');
        }
    }

    const saveTheme = (theme) =>{
        setTheme(theme);
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    return (
        <div className={styles.container}>
            <Head>
                <title>{ title }</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className={styles.header}>
                <Link href="/"><a>
                    <span>Pokemon</span> Ranked
                </a></Link>

                <button className={styles.themeSwitcher} onClick={switchTheme}>
                    <Brightness6Rounded />
                </button>
            </header>

            <main className={styles.main}>
                {children}
            </main>

            <footer className={styles.footer}>
                Shane Keenan @ <a href="https://www.shanekeenan.dev" target="_blank">https://www.shanekeenan.dev</a>
            </footer>
        </div>
    )   
}

export default Layout;