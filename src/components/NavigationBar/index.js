
import React from 'react';
import style from './style.module.css';

const NavigationBar = props => {

    const action = action => (
        <div className={style.action} onClick={() => action.perform()}>
            {action.icon ? <div className={style.icon} style={{ backgroundImage: `url(${action.icon})` }} /> : null}
            {action.name ? <div className={style.name}>{action.name}</div> : null}
        </div>
    );
    
    return (
        <div className={style.NavigationBar}>
            {props.onBack ? <button className={style.back} /> : null}
            <div className={style.title}>{props.title}</div>
            <div className={style.space} />
            <div className={style.actions}>
                {(props.actions || []).map(action)}
            </div>
        </div>
    );

};

export default NavigationBar;
