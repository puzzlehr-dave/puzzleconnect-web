
import React, { useState, useRef, useEffect } from 'react';
import style from './style.module.css';
import { awardIcon } from '../../resources/icons';

import NavigationView from '../ContentView';
import ConfirmDialog from '../ConfirmDialog';
import { useAppState, useEffectGroup } from '../../contexts/AppState';
import groups from '../../api/groups';
import badges from '../../api/badges';
import conditional from '../../utils/conditional';
import AwardConfirmView from '../AwardConfirmView';

const actions = [];

const AwardView = props => {

    const { auth, group } = useAppState();

    const [current, setCurrent] = useState(null);
    const [types, setTypes] = useState([]);
    const [dialog, setDialog] = useState(null);

    const backIdentifier = useRef(null);
    const previous = useRef(null);

    const fetch = async (group, reload = true) => {
        const results = await badges.fetchAwards(group);

        if (!results) {
            // show error
            return;
        }

        setTypes(results);
    };

    useEffectGroup(fetch); // for badges

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

        // setBadges([]);
        // setFives([]);
    };

    const giveAward = async item => {
        setDialog({
            title: `High Five ${current.firstName} ${current.lastName}`,
            description: `Recognize ${current.firstName} for ${item.name.toLowerCase()}`,
            main: {
                title: 'High Five',
                action: async () => {
                    const result = await badges.award(group, item._id, current._id);

                    if (!result) {
                        console.log('Error giving award');
                        return;
                    }

                    await wait(500);
                    props.onFinish && props.onFinish();
                    setDialog(null);
                }
            },
            secondary: {
                title: 'Cancel',
                action: async () => {
                    setDialog(null);
                }
            }
        });
    };

    const item = (item, index) => (
        <div className={conditional('item', style, { selected: false })} onClick={() => giveAward(item)}>
            <div className={style.itemContent}>
                <div className={style.itemPhoto} style={{ backgroundImage: awardIcon(item.name) }} />
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
            <NavigationView title={`High Five ${(current || {}).firstName}`} onBack={back} actions={actions}>
                <div className={style.awards}>
                    {types.map(item)}
                </div>
            </NavigationView>
            <ConfirmDialog data={dialog} />
            <AwardConfirmView />
        </div>
    );

};

export default AwardView;
