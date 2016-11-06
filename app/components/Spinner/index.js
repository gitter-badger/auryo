import React  from 'react';
import styles from './style.css';

export default class Spinner extends React.Component {
    render() {
        return (
            <div className={styles.loadingWrapper}>
                <ul className={styles.loading}>
                    <li/>
                    <li/>
                    <li/>
                    <li/>
                    <li/>
                    <li/>
                    <li/>
                    <li/>
                    <li/>
                    <li/>
                </ul>
                <ul className={styles.loading}>
                    <li/>
                    <li/>
                    <li/>
                    <li/>
                    <li/>
                    <li/>
                    <li/>
                    <li/>
                    <li/>
                    <li/>
                </ul>
            </div>
        );
    }
}