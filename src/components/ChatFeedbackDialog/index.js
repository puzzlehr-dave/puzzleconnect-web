
import React, { useEffect, useRef, useState } from 'react';
import style from './style.module.css';
import conditional from '../../utils/conditional';
import icons from '../../resources/icons';

const ChatFeedbackDialog = props => {

    const [current, setCurrent] = useState(null);
    const [performing, setPerforming] = useState(false);
    const [currentAnswer, setCurrentAnswer] = useState(null);
    
    useEffect(() => {
        if (!props.data) return;
        setCurrent(props.data);
    }, [props.data]);

    const chatFeedbackDialogClass = conditional('ChatFeedbackDialog', style, { visible: props.data });

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

    const wait = time => new Promise(resolve => setTimeout(() => { resolve() }, time));

    const selectFinish = async index => {
        setCurrentAnswer({ index });

        props.onFinish();
        
        await wait(500);
        setCurrentAnswer(null);  
    };

    return (
        <div className={chatFeedbackDialogClass}>
            <div className={style.fader} />
            <div className={style.container}>
                <div className={style.content}>
                    <div className={style.info}>
                        <div className={style.title}>How did I do?</div>
                        <div className={style.description}>Was this chat helpful to you?</div>
                    </div>
                    <div className={style.ratingOptions}>
                        <div className={style.ratingOption} onClick={() => selectFinish(0)} style={{ backgroundImage: icons.faceHappy, backgroundColor: (currentAnswer || {}).index === 0 ? 'rgba(122, 193, 66, 0.16)' : 'rgba(246, 246, 246, 1.0)' }} />
                        <div className={style.ratingOption} onClick={() => selectFinish(1)} style={{ backgroundImage: icons.faceNeutral, backgroundColor: (currentAnswer || {}).index === 1 ? 'rgba(122, 193, 66, 0.16)' : 'rgba(246, 246, 246, 1.0)' }} />
                        <div className={style.ratingOption} onClick={() => selectFinish(2)} style={{ backgroundImage: icons.faceSad, backgroundColor: (currentAnswer || {}).index === 2 ? 'rgba(122, 193, 66, 0.16)' : 'rgba(246, 246, 246, 1.0)' }} />
                    </div>
                    <div className={style.actions} style={{ display: 'none' }}>
                        {/* <div className={style.surveyActions}> */}
                            {/* <div className={style.surveyAction + ' ' + style.secondary} onClick={back}>Cancel</div> */}
                            {/* <div className={style.s} onClick={() => answer(askedQuestion, currentAnswer)}>Next</div> */}
                        {/* </div> */}
                        {secondary()}
                        {main()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatFeedbackDialog;
