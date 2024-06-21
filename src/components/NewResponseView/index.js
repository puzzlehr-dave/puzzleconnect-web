
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
import AwardView from '../AwardView';
import surveys from '../../api/surveys';
import responses from '../../api/responses';
import fragments from '../../api/fragments';

const actions = [];

const NewResponseView = props => {

    const { auth, group } = useAppState();

    const [current, setCurrent] = useState(null);
    
    const [awards, setAwards] = useState([]);
    const [earned, setEarned] = useState([]);
    const [dialog, setDialog] = useState(null);

    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState(['']);

    const [timingTabs, selectedTiming, setSelectedTiming, timingViews] = useTabSwitcher('page', style, ['Send Once', 'Daily', 'Monthly', 'Yearly']);
    const [scheduleRepeat, setScheduleRepeat] = useSmoothState(0, 0.5);
    const [scheduleDate, setScheduleDate] = useSmoothState(null, 0.5);

    const backIdentifier = useRef(null);
    const previous = useRef(null);
    const groupRef = useRef(null);

    const fetch = async (group, reload = true) => {
        groupRef.current = group;

        if (reload) {
            // setBadges([]);
            // setFives([]);
        }


        // const data = await groups.posts(group, 'badge'); // '652abf68d60a19a12ebb23fc');

        // if (!data) {
        //     console.log('error loading badges');
        //     return;
        // }

        // const items = {};
        // const counts = {};

        // for (const item of data) {
        //     if (props.data && props.data._id !== item.to._id) continue;
        //     if (!props.data && auth.user._id !== item.to._id) continue;

        //     const id = `${item.badge._id}_${item.user._id}`;
        //     const count = (counts[id] || 0) + 1;
        //     counts[id] = count;
        //     items[id] = { ...item, count };
        // }

        // setBadges(Object.values(items));
    };

    const fetchAwards = async () => {
        const [awarded, badged] = await Promise.all([
            badges.awarded(group, current._id),
            badges.earned(group, current._id)
        ]);

        if (!awarded || !badged) {
            console.log('error fetching awards');
            return;
        }
        
        setAwards(awarded);
        setEarned(badged);
    };

    useEffect(() => {
        if (!current) return;
        fetchAwards();
    }, [current]);

    useEffectGroup(fetch); // for badges

    useEffect(() => {
        if (!props.data) return;
        setCurrent(props.data);
        console.log(props.data);

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

        setQuestion('');
        setAnswers(['']);
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
        if (question.length < 1) {
            console.log('You need to enter a response.')
            return;
        }

        if (answers.filter(answer => answer.length > 0).length < 1 && props.type !== 'fragment') {
            console.log('You must enter a prompt.')
            return;
        }

        const survey = {
            name: question,
            options: answers,
            timing: timing()
        };

        console.log('group', group);

        const result = props.type === 'fragment' ? await fragments.add(group, { content: question }) : await responses.add(group, {
            content: answers[0],
            response: question
        });

        if (!result) {
            console.log('Error saving response');
            return;
        }

        props.onSave();
        
        const profile = current;
        const identifier = Math.random().toString(36);
        backIdentifier.current = identifier;

        await wait(500);

        if ((current && profile && current._id !== profile._id) || backIdentifier.current !== identifier) return;
        setCurrent(null);
        previous.current = null;

        setQuestion('');
        setAnswers(['']);
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
        fetchAwards();
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
                placeholder="Question to answer with this response" />
            {/* <div className={style.answerRemove} style={{ backgroundImage: icons.remove }} onClick={() => remove(index)} /> */}
        </div>
    );

    const newResponseViewClass = conditional('NewResponseView', style, { visible: props.data });
    
    const profileUser = current ? current : (props.root ? user() : {});
    const profileData = current ? { ...data(), data: current.groupData } : (props.root ? data() : {});

    return (
        <div className={newResponseViewClass}>
            <div className={style.container}>
                <NavigationView title={props.type === 'fragment' ? 'Add Document' : 'New Response'} modal onClose={!props.root ? back : null} hideHeader persistTitle actions={actions}>
                    <div className={style.profile}>
                        <textarea 
                            className={style.message}
                            style={props.type === 'fragment' ? { minHeight: '190px' } : {}}
                            placeholder={props.type === 'fragment' ? 'Relevant reference information' : 'Appropriate response to question'}
                            maxLength="250"
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                        />
                    </div>
                    {props.type !== 'fragment' ? (
                        <div className={style.section}>
                            <div className={style.sectionTitle}>Prompt</div>
                            <div className={style.sectionContent}>
                                {answers.map(answerInput)}
                                {/* <div className={style.newAnswer} onClick={addAnswer}>
                                    <div className={style.newAnswerIcon} style={{ backgroundImage: icons.addColor }} />
                                    <div className={style.newAnswerText}>Add Answer</div>
                                </div> */}
                            </div>
                        </div>
                    ) : null}
                    <div className={style.surveyActions}>
                        <div className={style.surveyAction + ' ' + style.secondary} onClick={back}>Cancel</div>
                        <div className={style.surveyAction} onClick={save}>Save</div>
                    </div>
                    {/* <div style={{height: '20px'}} /> */}
                </NavigationView>
            </div>
        </div>
    );

};

export default NewResponseView;
