
import React, { useEffect, useRef, useState } from 'react';
import style from './style.module.css';

import NavigationView from '../ContentView';
import conditional from '../../utils/conditional';
import icons from '../../resources/icons';
import ProfileView from '../ProfileView';
import ConfirmDialog from '../ConfirmDialog';
import { useAppState } from '../../contexts/AppState';
import surveys from '../../api/surveys';
import date from '../../utils/date';
import axios from 'axios';

const SurveyView = props => {

    const [current, setCurrent] = useState(null);
    const [question, setQuestion] = useState(null);
    const [timeData, setTimeData] = useState([]);
    const [timeFields, setTimeFields] = useState([]);
    const [dialog, setDialog] = useState(null);

    const [scroll, setScroll] = useState(null);
    const [showIndicator, setShowIndicator] = useState(false);

    const { group, setGroup } = useAppState();

    const backIdentifier = useRef(null);
    const previous = useRef(null);

    useEffect(() => {
        if (!props.data) return;
        setCurrent(props.data._id);
    }, [props.data]);

    const fetch = async () => {
        const prev = previous.current;
        previous.current = current;
        if (prev === current || prev === 'new') return;

        setQuestion(null);
        setTimeData([]);
        setTimeFields([]);
        setShowIndicator(false);

        const result = await surveys.fetch(group, current, ['a', 'b', 'c']);

        if (!result) {
            console.log('error fetching results');
            return;
        }

        let identifiers = [...(new Array(50))].map((_, index) => {
            const date = new Date();
            const digit = value => value.toString().padStart(2, '0');

            // if you want to cut off before survey made you can uncomment the line under date.setDate

            if (result.reminder === 'daily') {
                date.setDate(date.getDate() - index);
                // if (date.getTime() <= (new Date(result.date))) return null;
                return `${date.getFullYear()}-${digit(date.getMonth() + 1)}-${digit(date.getDate())}`;
            }

            if (result.reminder === 'monthly') {
                date.setMonth(date.getMonth() - index);
                // if (date.getTime() <= (new Date(result.date))) return null;
                return `${date.getFullYear()}-${digit(date.getMonth() + 1)}`;
            }

            if (result.reminder === 'yearly') {
                date.setFullYear(date.getFullYear() - index);
                // if (date.getTime() <= (new Date(result.date))) return null;
                return `${date.getFullYear()}`;
            }
        }).filter((date, index) => {
            const limits = {
                daily: 365,
                monthly: 12,
                yearly: 5
            };

            const limit = limits[result.reminder] || 0;
            return date && index <= limit;
        });

        const surveyResults = await surveys.fetch(group, current, result.reminder === 'once' ? ['once'] : identifiers);

        if (!surveyResults) {
            console.log('error fetching results');
            return;
        }

        const names = surveyResults.results.map(result => result.content);
        const fields = ['Time range', ...names.map(name => name), 'Answers'];
        if (!['daily', 'monthly', 'yearly'].includes(surveyResults.reminder)) fields.shift();
        if (result.reminder === 'once') identifiers = ['once'];

        const rows = identifiers.map(identifier => {
            const count = surveyResults.results.map(result => result.count[identifier]);
            const total = Math.max(...surveyResults.results.map(result => result.total[identifier]));

            const percentage = count.map(count => total ? ((count / total) * 100).toFixed(0) + '%' : 0);
            
            const date = new Date(identifier);

            const times = {
                daily: date.toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
                monthly: date.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
                yearly: date.getFullYear()
            };

            const time = times[result.reminder] || identifier;
            const results = [time, ...percentage, total];
            if (!['daily', 'monthly', 'yearly'].includes(surveyResults.reminder)) results.shift();

            return results; // ...count add this for exact numbers
        });

        const removeLast = () => {
            if (!rows.length) return;

            const last = rows[rows.length - 1];
            const total = last[last.length - 1];

            if (total < 1) {
                rows.pop();
                removeLast();
            }
        };

        removeLast();

        setQuestion(surveyResults);
        setTimeData(rows);
        setTimeFields(fields);

        console.log('question results', result, rows);
    };

    useEffect(() => {
        if (!current) return;
        fetch();
    }, [current]);

    const wait = time => new Promise(resolve => setTimeout(() => { resolve() }, time));

    const back = async () => {
        props.onBack();

        const chat = current;
        const identifier = Math.random().toString(36);
        backIdentifier.current = identifier;

        await wait(500);

        if (current !== chat || backIdentifier.current !== identifier) return;
        setCurrent(null);
        previous.current = null;

        setQuestion(null);
        setTimeData([]);
        setTimeFields([]);
    };

    const remove = async () => {
        setDialog({
            title: `Delete This Question?`,
            description: `If you delete, users will no longer get prompted to answer this question.`,
            main: {
                title: 'Delete',
                action: async () => {
                    const result = await surveys.remove(current);

                    if (!result) {
                        console.log('Error removing survey');
                        return;
                    }

                    const currentChat = current;
                    const identifier = Math.random().toString(36);
                    backIdentifier.current = identifier;

                    await wait(500);
                    props.onFinish && props.onFinish();
                    props.onArchive && props.onArchive();
                    setDialog(null);

                    if (current !== currentChat || backIdentifier.current !== identifier) return;
                    setCurrent(null);
                    previous.current = null;
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

    const actions = [
        {
            icon: icons.archive,
            perform: remove
        }
    ];

    const lines = message => message.split('\n').map((line, index) => <div className={style.itemPreview} style={{ marginTop: index ? '5px' : '0px' }}>{line}</div>);
    
    const item = (item, index) => (
        <div className={conditional('item', style, { })}>
            <div className={style.itemContent}>
                <div className={style.itemPhoto} style={{ backgroundImage: item.user ? `url(${item.user.thumbnail})` : 'url(https://cdn2.hubspot.net/hub/6444014/hubfs/PuzzleHR_October2019/images/Puzzle_favicon-150x150.png?width=108&height=108)', backgroundSize: !item.user ? '70% 70%': 'cover' }} />
                <div className={style.itemInfo}>
                    <div className={style.itemNameContent}>
                        <div className={style.itemName}>{item.user ? (item.user.firstName + ' ' + item.user.lastName) : 'Harley'}</div>
                        <div className={style.itemDate}>{date.format(item.date)}</div>
                    </div>
                    {lines(item.message)}
                </div>
            </div>
        </div>
    );

    const percentage = item => {
        if (!props.data || !props.data.results || !props.data.results.length) return '0%';

        const total = props.data.results.reduce((sum, result) => sum + result.count, 0);
        if (!total) return '0%';

        const percent = (item.count / total) * 100;
        return `${parseInt(percent)}%`;
    };

    const max = () => {
        if (!props.data || !props.data.results || !props.data.results.length) return null;
        
        let max = 0;
        let result = null;

        for (const data of props.data.results) {
            if (data.count > max) {
                max = data.count;
                result = data;
            }
        }

        return result ? result.index : null;
    };

    const timeSeries = () => {
        if (!question) return [];

        const results = question.results;
        console.log('rest', results);
    };

    const card = item => {
        const surveyCardClass = conditional('surveyCard', style, { highlighted: max() === item.index });

        return (
            <div className={surveyCardClass}>
                <div className={style.surveyHeader}>
                    <div className={style.featuredInfo}>
                        <div className={style.featuredTitle}>{item.content}</div>
                        <div className={style.featuredSubtitle}>{item.count} response{item.count !== 1 ? 's' : ''}</div>
                    </div>
                    <div className={style.featuredNumber}>{percentage(item)}</div>
                </div>
            </div>
        );
    };

    const resultItem = (item, index) => (
        <div className={conditional('resultItem', style, { selected: false })}>
            <div className={style.resultItemContent}>
                <div className={style.resultItemPhoto} style={{ backgroundImage: '' }} />
                <div className={style.resultItemInfo}>
                    <div className={style.resultItemNameContent}>
                        <div className={style.resultItemName}>{item.name}</div>
                        <div className={style.resultItemDate}>{item.count}x</div>
                    </div>
                    {/* <div className={style.resultItemPreview}>{item.secondaryInfo.description || 'Serving customers'}</div> */}
                </div>
            </div>
        </div>
    );
    
    const surveyViewClass = conditional('SurveyView', style, { visible: props.data !== null });
    const surveysClass = conditional('surveys', style, { visible: true });
    const indicatorClass = conditional('indicator', style, { visible: showIndicator });

    if (!current) return <div className={surveyViewClass} />;
    
    return (
        <div className={surveyViewClass}>
            <NavigationView secondary title={props.data ? props.data.name : 'Results'} bottom scroll={scroll} onBack={back} actions={actions}>
                <div className={style.info}>
                    <div className={style.infoIcon} style={{ backgroundImage: icons.schedule }} />
                    <div className={style.infoText}>{'Repeats ' + ((question || {}).reminder || '')}</div>
                </div>
                <div className={style.items}>
                    <div className={style.section}>
                        <div className={style.sectionContent}>
                            <table className={style.table}>
                                <thead>
                                    <tr>{timeFields.map(field => <th>{field}</th>)}</tr>
                                </thead>
                                <tbody>
                                    {timeData.map(data => <tr>{data.map(d => <td>{d}</td>)}</tr>)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div style={{height: '16px'}} />
                </div>
            </NavigationView>
            <ConfirmDialog data={dialog} />
        </div>
    );

};

export default SurveyView;
