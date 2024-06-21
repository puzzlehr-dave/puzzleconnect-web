
import React, { useState, useRef, useEffect } from 'react';
import style from './style.module.css';
import icons, { awardIcon } from '../../resources/icons';

import NavigationView from '../ContentView';
import ConfirmDialog from '../ConfirmDialog';
import SegmentTabs from '../SegmentTabs';
import { useAppState, useEffectGroup } from '../../contexts/AppState';
import { useTabSwitcher } from '../../utils/tabSwitcher';
import groups from '../../api/groups';
import badges from '../../api/badges';
import conditional from '../../utils/conditional';
import useSmoothState from '../../utils/useSmoothState';
import surveys from '../../api/surveys';

const SuggestionBadgeView = props => {

    const { auth, group } = useAppState();

    const [current, setCurrent] = useState(null);
    const [dialog, setDialog] = useState(null);
    const [types, setTypes] = useState([]);

    const [name, setName] = useState('');
    const [answers, setAnswers] = useState(['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']);

    const [timingTabs, selectedTiming, setSelectedTiming, timingViews] = useTabSwitcher('page', style, ['Private', 'Public']);

    const backIdentifier = useRef(null);
    const previous = useRef(null);

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

    useEffect(() => {
        if (!props.data) return;
        setCurrent(props.data);

        const identifier = Math.random().toString(36);
        backIdentifier.current = identifier;

        fetch();
    }, [props.data]);

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

        setName('');
    };

    const timing = () => {
        const times = {
            0: 'once',
            1: 'daily',
            2: 'monthly',
            3: 'yearly'
        };

        return times[selectedTiming] || 'once';
    };

    const save = async () => {
        if (name.length < 1) {
            console.log('You need to enter the organization name');
            return;
        }

        const added = await groups.add({
            name,
            public: selectedTiming === 1
        });

        props.onSave();
        
        const profile = current;
        const identifier = Math.random().toString(36);
        backIdentifier.current = identifier;

        await wait(500);

        if ((current && profile && current._id !== profile._id) || backIdentifier.current !== identifier) return;
        setCurrent(null);
        previous.current = null;

        setName('');
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
                    props.onBack();
                    setDialog(null);
                }
            },
            secondary: {
                title: 'Cancel',
                action: async () => {
                    props.onBack();
                    setDialog(null);
                }
            }
        });
    };

    const user = () => {
        if (!auth || !auth.user) return {};
        return auth.user;
    };

    const data = () => {
        const groups = user().groups || [];
        if (!groups.length) return {};

        const active = groups.filter(data => data._id === group)[0];
        if (!active) return {};

        return active;
    };

    const finish = () => {
        setDialog(null);
    };

    const updateAnswer = selected => e => {
        const updated = answers.map((current, index) => index === selected ? e.target.value : current);
        setAnswers(updated);
    };

    const addAnswer = () => {
        setAnswers(answers => [...answers, '']);
    };

    const remove = selected => {
        setAnswers(answers => answers.filter((_, index) => index !== selected));
    };

    const award = (item, index) => (
        <div className={conditional('awardItem', style, { selected: false })}>
            <div className={style.awardItemContent}>
                <div className={style.awardItemPhoto} style={{ backgroundImage: awardIcon(item.name) }} />
                <div className={style.awardItemInfo}>
                    <div className={style.awardItemNameContent}>
                        <div className={style.awardItemName}>{item.name}</div>
                        <div className={style.awardItemDate}>{item.count}x</div>
                    </div>
                    {/* <div className={style.awardItemPreview}>{item.secondaryInfo.description || 'Serving customers'}</div> */}
                </div>
            </div>
        </div>
    );

    const badge = (item, index) => (
        <div className={conditional('badgeItem', style, { selected: false })}>
            <div className={style.badgeItemContent}>
                <div className={style.badgeItemPhoto} style={{ backgroundImage: awardIcon(item.name) }} />
                <div className={style.badgeItemInfo}>
                    <div className={style.badgeItemNameContent}>
                        <div className={style.badgeItemName}>{item.name}</div>
                        {/* <div className={style.badgeItemDate}>{(item.secondaryInfo || {}).description}</div> */}
                    </div>
                    <div className={style.badgeItemPreview}>{(item.secondaryInfo || {}).description}</div>
                </div>
            </div>
        </div>
    );

    const answerInput = (answer, index) => (
        <div className={style.answerInput}>
            <input
                className={style.answer}
                value={answer}
                onChange={updateAnswer(index)}
                placeholder="Answer" />
            <div className={style.answerRemove} style={{ backgroundImage: icons.remove }} onClick={() => remove(index)} />
        </div>
    );

    const type = (item, index) => (
        <div className={conditional('item', style, { selected: false })} onClick={() => { giveAward(item) }}>
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

    const actions = [
        {
            icon: icons.close,
            perform: () => props.onBack()
        }
    ];

    const newQuestionViewClass = conditional('SuggestionBadgeView', style, { visible: props.data });

    return (
        <div className={newQuestionViewClass}>
            <div className={style.container}>
                <NavigationView title={'Recognize ' + (current || {}).firstName} modal onClose={!props.root ? back : null} hideHeader persistTitle actions={actions}>
                    <div className={style.profile}>
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
                    <div style={{height: '20px'}} />
                </NavigationView>
                <ConfirmDialog data={dialog} />
            </div>
        </div>
    );

};

export default SuggestionBadgeView;
