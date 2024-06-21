
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

const AvailableQuestionsView = props => {

    const { auth, group } = useAppState();

    const [current, setCurrent] = useState(null);
    
    const [awards, setAwards] = useState([]);
    const [earned, setEarned] = useState([]);
    const [dialog, setDialog] = useState(null);

    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState(['']);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState(null);
    const [answered, setAnswered] = useState([]);

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

        setCurrentQuestion(0);
        setCurrentAnswer(null);
        setAnswered([]);
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
            console.log('You need to enter something to post.');
            return;
        }

        const survey = {
            name: question,
            options: answers,
            timing: timing()
        };

        console.log('group', group);

        const result = await groups.post(group, question);

        if (!result) {
            console.log('Error posting');
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

    const currentIdentifier = type => {
        const date = new Date();

        const digit = value => value.toString().padStart(2, '0');

        if (type === 'once') return 'once';
        if (type === 'daily') return `${date.getFullYear()}-${digit(date.getMonth() + 1)}-${digit(date.getDate())}`;
        if (type === 'monthly') return `${date.getFullYear()}-${digit(date.getMonth() + 1)}`;
        if (type === 'yearly') return `${date.getFullYear()}`;

        return 'once';
    };

    const likertAction = (question, option) => {
        const answer = async () => {
            const identifier = currentIdentifier(question.reminder);
            const result = await surveys.answer(question._id, option.index, identifier);

            if (!result) {
                console.log('error answering survey');
                return;
            }

            // setAnswered(answered => [...answered, question._id]);

            // await wait(2000);
            // setQuestions(questions => questions.filter(q => q._id !== question._id));
        };

        const colors = {
            'strongly agree': 'rgba(122, 193, 66, 1.0)',
            'agree': 'rgba(122, 193, 66, 1.0)',
            'neutral': 'rgb(200, 200, 200)',
            'disagree': '#e55151',
            'strongly disagree': '#e55151'
        };

        const sizes = {
            'strongly agree': '20px',
            'agree': '16px',
            'neutral': '10px',
            'disagree': '16px',
            'strongly disagree': '20px'
        };

        return (
            <div className={style.likertAction} onClick={answer}>
                <div 
                    className={style.likertCircle}
                    style={{ 
                        width: sizes[option.content.toLowerCase()], 
                        height: sizes[option.content.toLowerCase()], 
                        borderColor: colors[option.content.toLowerCase()] 
                    }} />
                {/* <div className={style.likertTitle}>{option.content}</div> */}
            </div>
        );
    };

    const answer = async (question, option) => {
        if (currentAnswer === null) {
            alert('You must provide an answer first');
            return;
        }

        const identifier = currentIdentifier(question.reminder);
        const result = await surveys.answer(question._id, option.index, identifier);

        if (!result) {
            console.log('error answering survey');
            return;
        }

        if (currentQuestion === current.length - 1) {
            props.onBack();

            const profile = current;
            const identifier = Math.random().toString(36);
            backIdentifier.current = identifier;

            await wait(500);

            if ((current && profile && current._id !== profile._id) || backIdentifier.current !== identifier) return;
            setCurrent(null);
            previous.current = null;

            setCurrentQuestion(0);
            setCurrentAnswer(null);
            setAnswered([]);
            
            return;
        }

        setAnswered(answered => [...answered, question._id]);
        setCurrentQuestion(currentQuestion => currentQuestion + 1);
        setCurrentAnswer(null);

        // await wait(2000);
        // setQuestions(questions => questions.filter(q => q._id !== question._id));
    };

    const likertActions = (question, options) => {
        if (options.length !== 5) return null;
        // if (['strongly agree', 'agree', 'neutral', 'disagree', 'strongly disagree'].every(op => options.map()))

        // if (!options.map(option => option.toLowerCase()).includes([]) )
        return (
            <div className={style.surveyActions} style={{ display: 'flex' }}>
                {/* {question.options.map(option => likertAction(question, option))} */}
                <div className={style.likertLegend}>
                    <div className={style.likertItem}>Strongly Agree</div>
                    <div className={style.likertItem}>Neutral</div>
                    <div className={style.likertItem}>Strongly Disagree</div>
                </div>
            </div>
        );
    };

    const questions = current || [];
    const askedQuestion = questions[currentQuestion] || {};
    const options = askedQuestion.options || [];

    const availableQuestionsViewClass = conditional('AvailableQuestionsView', style, { visible: props.data });
    const nextActionClass = conditional('surveyAction', style, { disabled: currentAnswer === null });
    
    return (
        <div className={availableQuestionsViewClass}>
            <div className={style.container}>
                <NavigationView title={'Survey Questions'} modal onClose={!props.root ? back : null} hideHeader persistTitle actions={actions}>
                    <div className={style.profile}>
                        <div className={style.questionText}>{askedQuestion.name}</div>
                        <div className={style.questionOptions}>
                            <div className={style.questionOption} onClick={() => setCurrentAnswer({ index: 0 })} style={{ backgroundImage: icons.faceVeryHappy, backgroundColor: (currentAnswer || {}).index === 0 ? 'rgba(122, 193, 66, 0.16)' : 'rgba(246, 246, 246, 1.0)' }} />
                            <div className={style.questionOption} onClick={() => setCurrentAnswer({ index: 1 })} style={{ backgroundImage: icons.faceHappy, backgroundColor: (currentAnswer || {}).index === 1 ? 'rgba(122, 193, 66, 0.16)' : 'rgba(246, 246, 246, 1.0)' }} />
                            <div className={style.questionOption} onClick={() => setCurrentAnswer({ index: 2 })} style={{ backgroundImage: icons.faceNeutral, backgroundColor: (currentAnswer || {}).index === 2 ? 'rgba(122, 193, 66, 0.16)' : 'rgba(246, 246, 246, 1.0)' }} />
                            <div className={style.questionOption} onClick={() => setCurrentAnswer({ index: 3 })} style={{ backgroundImage: icons.faceSad, backgroundColor: (currentAnswer || {}).index === 3 ? 'rgba(122, 193, 66, 0.16)' : 'rgba(246, 246, 246, 1.0)' }} />
                            <div className={style.questionOption} onClick={() => setCurrentAnswer({ index: 4 })} style={{ backgroundImage: icons.faceVerySad, backgroundColor: (currentAnswer || {}).index === 4 ? 'rgba(122, 193, 66, 0.16)' : 'rgba(246, 246, 246, 1.0)' }} />
                            {/* {likertActions(askedQuestion, askedQuestion.options) || <div className={style.surveyActions} style={{ display: 'flex' }}> */}
                                {/* {question.options.map(option => surveyAction(question, option))} */}
                            {/* </div>} */}
                            {/* {JSON.stringify(props.data)} */}
                        </div>
                        <div className={style.pageIndicator}>Question {currentQuestion + 1} of {questions.length}</div>
                    </div>
                    <div className={style.surveyActions}>
                        <div className={style.surveyAction + ' ' + style.secondary} onClick={back}>Cancel</div>
                        <div className={nextActionClass} onClick={() => answer(askedQuestion, currentAnswer)}>Next</div>
                    </div>
                    {/* <div style={{height: '20px'}} /> */}
                </NavigationView>
            </div>
        </div>
    );

};

export default AvailableQuestionsView;
