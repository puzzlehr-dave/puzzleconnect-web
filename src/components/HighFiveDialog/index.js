
import React, { useEffect, useRef, useState } from 'react';
import style from './style.module.css';
import conditional from '../../utils/conditional';
import badges from '../../api/badges';
import { useAppState } from '../../contexts/AppState';

const HighFiveDialog = props => {

    const [current, setCurrent] = useState(null);
    const [types, setTypes] = useState([]);
    const [performing, setPerforming] = useState(false);

    const { group } = useAppState();
    
    useEffect(() => {
        if (!props.data) return;
        setCurrent(props.data);
        fetch();
    }, [props.data]);

    const fetch = async () => {
        const results = await badges.fetchAwards(group);

        if (!results) {
            // show error

            const test = [
                'Customer Service',
                'Team Player',
                'Extra Mile',
                'Problem Solver',
                'Training',
                'Integrity',
                'Excellence',
                'Team Spirit'
            ].map((type, index) => ({ _id: index.toString(), name: type }));

            setTypes(test);
            
            return;
        }

        console.log('fetchAwards');
        console.log(results);

        setTypes(results);
    };

    const highFiveDialogClass = conditional('HighFiveDialog', style, { visible: props.data });

    const perform = async e => {
        setPerforming(true);
        await current.main.action();
        setPerforming(false);
    };

    // const main = () => {
    //     if (!current || !current.main) return null;

    //     const actionClass = conditional('action', style, { performing });
        
    //     return (
    //         <div className={actionClass} onClick={() => perform()}>
    //             <div className={style.itemActionTitle}>{current.main.title}</div>
    //         </div>
    //     );
    // };

    // const secondary = () => {
    //     if (!current || !current.secondary) return null;
        
    //     return (
    //         <div className={style.actionSecondary} onClick={() => current.secondary.action()}>
    //             <div className={style.itemActionTitle}>{current.secondary.title}</div>
    //         </div>
    //     );
    // };

    const type = data => (
        <div className={style.type}>
            <div className={style.typeIcon} />
            <div className={style.typeName}>{data.name}</div>
        </div>
    );

    return (
        <div className={highFiveDialogClass}>
            <div className={style.fader} onClick={() => current.secondary && current.secondary.action()} />
            <div className={style.container}>
                <div className={style.content}>
                    <div className={style.info}>
                        <div className={style.title}>{(current || {}).title}</div>
                        <div className={style.description}>{(current || {}).description}</div>
                    </div>
                    <div className={style.types}>
                        {types.map(type)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HighFiveDialog;
