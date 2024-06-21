
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

const actions = [];

const NewOrganizationView = props => {

    const { auth, group } = useAppState();

    const [current, setCurrent] = useState(null);
    const [dialog, setDialog] = useState(null);

    const [name, setName] = useState('');
    const [answers, setAnswers] = useState(['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']);

    const [timingTabs, selectedTiming, setSelectedTiming, timingViews] = useTabSwitcher('page', style, ['Private', 'Public']);

    const [updated, setUpdated] = useState({});

    const backIdentifier = useRef(null);
    const previous = useRef(null);

    useEffect(() => {
        if (!props.data) return;
        setCurrent(props.data);

        setName(props.data.name);
        setSelectedTiming(props.data.public ? 1 : 0);

        const identifier = Math.random().toString(36);
        backIdentifier.current = identifier;

        fetch(group);
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
        setSelectedTiming(0);
        setUpdated({});
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
        // if (name.length < 1) {
        //     console.log('You need to enter the organization name');
        //     return;
        // }

        const update = Object.keys(updated).reduce((result, current) => ({ ...result, [current]: { name, public: selectedTiming === 1 }[current] }), {});
        const result = await groups.update(current._id, update);

        props.onSave();
        
        const profile = current;
        const identifier = Math.random().toString(36);
        backIdentifier.current = identifier;

        await wait(500);

        if ((current && profile && current._id !== profile._id) || backIdentifier.current !== identifier) return;
        setCurrent(null);
        previous.current = null;

        setName('');
        setSelectedTiming(0);
        setUpdated({});
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

    const newQuestionViewClass = conditional('NewQuestionView', style, { visible: props.data });

    return (
        <div className={newQuestionViewClass}>
            <div className={style.container}>
                <NavigationView title="Edit Organization" modal onClose={!props.root ? back : null} hideHeader persistTitle actions={actions}>
                    <div className={style.profile}>
                    <input
                        className={style.answer}
                        value={name}
                        onChange={e => { setUpdated(u => ({ ...u, name: true })); setName(e.target.value) }}
                        placeholder="Organization Name" />
                        {/* <textarea 
                            className={style.message}
                            placeholder={'Ask a question'}
                            maxLength="250"
                            value={question}
                            onChange={e => setName(e.target.value)}
                        /> */}
                    </div>
                    {/* <div className={style.section}>
                        <div className={style.sectionTitle}>Choices</div>
                        <div className={style.sectionContent}>
                            {answers.map(answerInput)}
                            <div className={style.newAnswer} onClick={addAnswer}>
                                <div className={style.newAnswerIcon} style={{ backgroundImage: icons.addColor }} />
                                <div className={style.newAnswerText}>Add Answer</div>
                            </div>
                        </div>
                    </div> */}
                    <div className={style.section}>
                        <div className={style.sectionTitle}>Access</div>
                        <div className={style.sectionContent} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                            <SegmentTabs selectedTab={selectedTiming} tabs={timingTabs} onSelect={index => { setUpdated(u => ({ ...u, public: true })); setSelectedTiming(index)}} />
                            <div className={style.surveyActions}>
                                <div className={style.surveyAction + ' ' + style.secondary} onClick={back}>Cancel</div>
                                <div className={style.surveyAction} onClick={save}>Save</div>
                            </div>
                        </div>
                    </div>
                    <div style={{height: '20px'}} />
                </NavigationView>
            </div>
        </div>
    );

};

export default NewOrganizationView;
