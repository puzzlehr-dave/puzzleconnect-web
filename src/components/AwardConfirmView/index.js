
import React, { useState, useRef, useEffect } from 'react';
import style from './style.module.css';
import icons from '../../resources/icons';

import NavigationView from '../ContentView';
import { useAppState, useEffectGroup } from '../../contexts/AppState';
import badges from '../../api/badges';
import conditional from '../../utils/conditional';

const actions = [];

const AwardConfirmView = props => {

    const { auth, group } = useAppState();

    const [current, setCurrent] = useState(null);
    const [types, setTypes] = useState([]);

    const backIdentifier = useRef(null);
    const previous = useRef(null);

    useEffect(() => {
        if (!props.award) return;
        setCurrent(props.award);

        const identifier = Math.random().toString(36);
        backIdentifier.current = identifier;

        fetch(group);
    }, [props.award]);

    const wait = time => new Promise(resolve => setTimeout(() => { resolve() }, time));

    const back = async () => {
        props.onBack();

        const profile = current;
        const identifier = Math.random().toString(36);
        backIdentifier.current = identifier;

        await wait(500);

        if ((current && profile && current._id !== profile._id) || backIdentifier.current !== identifier) return;
        setCurrent(null);
        previous.current = null;
    };

    const user = () => {
        if (!auth || !auth.user) return {};
        return auth.user;
    };

    const icon = data => {
        const name = data.toLowerCase();

        if (name.includes('customer service')) {
            return icons.headset;
        }

        if (name.includes('extra mile')) {
            return icons.route;
        }

        if (name.includes('team player')) {
            return icons.team;
        }

        if (name.includes('problem solver')) {
            return icons.lightbulb;
        }

        if (name.includes('training')) {
            return icons.education;
        }

        if (name.includes('integrity')) {
            return icons.handshake;
        }

        if (name.includes('team spirit')) {
            return icons.favorite;
        }

        if (name.includes('excellence')) {
            return icons.star;
        }

        return 'none';
    };
    
    const item = (item, index) => (
        <div className={conditional('item', style, { selected: false })}>
            <div className={style.itemContent}>
                <div className={style.itemPhoto} style={{ backgroundImage: icon(item.name) }} />
                <div className={style.itemInfo}>
                    <div className={style.itemNameContent}>
                        <div className={style.itemName}>{item.name}</div>
                        <div className={style.itemDate}>{''}</div>
                    </div>
                    {/* <div className={style.itemPreview}>{item.secondaryInfo.description || 'Serving customers'}</div> */}
                </div>
            </div>
        </div>
    );

    const awardViewClass = conditional('AwardView', style, { visible: props.award || props.root });
    
    return (
        <div className={awardViewClass}>
            <NavigationView title={`Confirm ${(current || {}).firstName}`} hideHeader onBack={back} actions={actions}>
                <div className={style.awards}>
                    {/* {types.map(item)} */}
                </div>
            </NavigationView>
        </div>
    );

};

export default AwardConfirmView;
