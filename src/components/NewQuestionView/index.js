
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

const repeats = [
    {
        title: 'None',
        type: 'none',
        count: 1
    },
    // {
    //     title: 'debug',
    //     type: 'minutely',
    //     count: 5
    // },
    // {
    //     title: 'Daily',
    //     type: 'daily',
    //     count: 1825
    // },
    {
        title: 'Weekly',
        type: 'weekly',
        count: 260
    },
    {
        title: 'Monthly',
        type: 'monthly',
        count: 72
    },
    {
        title: 'Yearly',
        type: 'yearly',
        count: 5
    }
];

const actions = [];

const NewQuestionView = props => {

    const { auth, group } = useAppState();

    const [current, setCurrent] = useState(null);
    
    // const [badges, setBadges] = useState([]);
    // const [fives, setFives] = useState([]);

    const [awards, setAwards] = useState([]);
    const [earned, setEarned] = useState([]);
    const [dialog, setDialog] = useState(null);
    const [scheduleDate, setScheduleDate] = useState(null);

    const [question, setQuestion] = useState('');
    // const [answers, setAnswers] = useState(['', '']);
    const [answers, setAnswers] = useState(['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']);

    const [timingTabs, selectedTiming, setSelectedTiming, timingViews] = useTabSwitcher('page', style, ['Send Once', 'Daily', 'Weekly', 'Monthly', 'Yearly']);
    const [scheduleRepeat, setScheduleRepeat] = useSmoothState(0, 0.5);
    // const [scheduleDate, setScheduleDate] = useSmoothState(null, 0.5);

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
        setAnswers(['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']);
        // setAnswers(['', '']);
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
            console.log('You need to enter a question first.')
            return;
        }

        if (answers.filter(answer => answer.length > 0).length < 2) {
            console.log('You must enter at least two answers.')
            return;
        }

        const survey = {
            name: question,
            options: answers,
            timing: timing()
        };

        console.log('group', group);

        const result = await surveys.add(group, survey);
        console.log('saved', result);
        props.onSave();
        
        const profile = current;
        const identifier = Math.random().toString(36);
        backIdentifier.current = identifier;

        await wait(500);

        if ((current && profile && current._id !== profile._id) || backIdentifier.current !== identifier) return;
        setCurrent(null);
        previous.current = null;

        setQuestion('');
        // setAnswers(['', '']);
        setAnswers(['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']);
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
                placeholder="Answer" /> 
            <div className={style.answerRemove} style={{ backgroundImage: icons.remove }} onClick={() => remove(index)} />
        </div>
    );

    const newQuestionViewClass = conditional('NewQuestionView', style, { visible: props.data });
    
    const profileUser = current ? current : (props.root ? user() : {});
    const profileData = current ? { ...data(), data: current.groupData } : (props.root ? data() : {});

    return (
        <div className={newQuestionViewClass}>
            <div className={style.container}>
                <NavigationView title="New Question" modal onClose={!props.root ? back : null} hideHeader persistTitle actions={actions}>
                    <div className={style.profile}>
                        <textarea 
                            className={style.message}
                            placeholder={'Ask a question'}
                            maxLength="250"
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                        />
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
                        <div className={style.sectionTitle}>Repeat</div>
                        <div className={style.sectionContent} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                            <SegmentTabs selectedTab={selectedTiming} tabs={timingTabs} onSelect={setSelectedTiming} />
                            <div className={style.datePicker}>
                                <input className={style.date} value={scheduleDate} type="datetime-local" onChange={e => setScheduleDate(e.target.value)} />
                                <div className={style.dateIcon} style={{ backgroundImage: icons.calendar }}></div>
                            </div>
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

export default NewQuestionView;
