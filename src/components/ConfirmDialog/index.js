
import React, { useEffect, useRef, useState } from 'react';
import style from './style.module.css';
import conditional from '../../utils/conditional';

const ConfirmDialog = props => {

    const [current, setCurrent] = useState(null);
    const [performing, setPerforming] = useState(false);
    
    useEffect(() => {
        if (!props.data) return;
        setCurrent(props.data);
    }, [props.data]);

    const confirmDialogClass = conditional('ConfirmDialog', style, { visible: props.data });

    const perform = async e => {
        setPerforming(true);
        await current.main.action();
        setPerforming(false);
    };

    const main = () => {
        if (!current || !current.main) return null;

        const actionClass = conditional('action', style, { performing });
        
        return (
            <div className={actionClass} onClick={() => perform()}>
                <div className={style.itemActionTitle}>{current.main.title}</div>
            </div>
        );
    };

    const secondary = () => {
        if (!current || !current.secondary) return null;
        
        return (
            <div className={style.actionSecondary} onClick={() => current.secondary.action()}>
                <div className={style.itemActionTitle}>{current.secondary.title}</div>
            </div>
        );
    };

    return (
        <div className={confirmDialogClass}>
            <div className={style.fader} />
            <div className={style.container}>
                <div className={style.content}>
                    <div className={style.info}>
                        <div className={style.title}>{(current || {}).title}</div>
                        <div className={style.description}>{(current || {}).description}</div>
                    </div>
                    <div className={style.actions}>
                        {secondary()}
                        {main()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
