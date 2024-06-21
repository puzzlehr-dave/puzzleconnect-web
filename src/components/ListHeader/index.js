
import React from 'react';
import style from './style.module.css';
import icons from '../../resources/icons';

const ListHeader = props => {

    return (
        <div className={style.ListHeader}>
            <div className={style.headerContent} onClick={() => props.action && props.action()}>
                <div className={style.headerIcon} style={{ backgroundImage: icons.addColor, backgroundSize: '100%' }} />
                <div className={style.headerInfo}>
                    <div className={style.headerTitle}>{props.title}</div>
                    <div className={style.headerSubtitle}>{props.description}</div>
                </div>
            </div>
        </div>
    );

};

export default ListHeader;