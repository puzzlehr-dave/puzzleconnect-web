
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

const NewPostView = props => {

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

    const newPostViewClass = conditional('NewPostView', style, { visible: props.data });
    
    return (
        <div className={newPostViewClass}>
            <div className={style.container}>
                <NavigationView title={'New Post'} modal onClose={!props.root ? back : null} hideHeader persistTitle actions={actions}>
                    <div className={style.profile}>
                        <textarea 
                            className={style.message}
                            placeholder={'Share something with the team'}
                            maxLength="250"
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                        />
                    </div>
                    <div className={style.surveyActions}>
                        <div className={style.surveyAction + ' ' + style.secondary} onClick={back}>Cancel</div>
                        <div className={style.surveyAction} onClick={save}>Post</div>
                    </div>
                    {/* <div style={{height: '20px'}} /> */}
                </NavigationView>
            </div>
        </div>
    );

};

export default NewPostView;
