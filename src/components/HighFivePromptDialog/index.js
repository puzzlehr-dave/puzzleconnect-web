
import React, { useEffect, useRef, useState } from 'react';
import style from './style.module.css';
import conditional from '../../utils/conditional';
import icons from '../../resources/icons';

const HighFivePromptDialog = props => {

    const [current, setCurrent] = useState(null);
    const [performing, setPerforming] = useState(false);
    const [currentAnswer, setCurrentAnswer] = useState(null);
    
    useEffect(() => {
        if (!props.data) return;
        setCurrent(props.data);
    }, [props.data]);

    const highFivePromptDialogClass = conditional('HighFivePromptDialog', style, { visible: props.data });

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
        // if (!current || !current.secondary) return null;
        
        return (
            <div className={style.actionSecondary} onClick={() => current.secondary.action()}>
                <div className={style.itemActionTitle}>{current.secondary.title}</div>
            </div>
        );
    };

    const wait = time => new Promise(resolve => setTimeout(() => { resolve() }, time));

    const selectFinish = async index => {
        setCurrentAnswer({ index });

        props.onFinish();
        
        await wait(500);
        setCurrentAnswer(null);  
    };

    return (
        <div className={highFivePromptDialogClass}>
            <div className={style.fader} />
            <div className={style.container}>
                <div className={style.content}>
                    <div className={style.info}>
                        <div className={style.title}>Give a High Five</div>
                        <div className={style.description}>Want to recognize somebody?</div>
                    </div>
                    <div className={style.actions}>
                        {/* <div className={style.surveyActions}> */}
                            {/* <div className={style.action + ' ' + style.secondary} onClick={() => props.onBack()}>Cancel</div> */}
                            {/* <div className={style.action} onClick={() => props.onFinish()}>Next</div> */}
                        {/* </div> */}
                        {secondary()}
                        {main()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HighFivePromptDialog;
