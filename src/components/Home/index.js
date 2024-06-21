
import React, { useEffect, useState } from 'react';
import style from './style.module.css';

import NavigationBar from '../NavigationBar';
import NavigationView from '../ContentView';
import icons from '../../resources/icons';
import conditional from '../../utils/conditional';
import NotificationsView from '../LeaderboardView';
import { useAppState } from '../../contexts/AppState';
import surveys from '../../api/surveys';
import NewPostView from '../NewPostView';
import groups from '../../api/groups';
import date from '../../utils/date';
import AvailableQuestionsView from '../AvailableQuestionsView';
import bridge from 'bridge-request';
import UserSuggestions from '../UserSuggestions';
import SuggestionBadgeView from '../SuggestionBadgeView';
import ChartView from '../ChartView';
import AddTicketModal from '../AddTicketModal';

import Recommendation from '../Recommendation';
import SuggestionComplimentView from '../SuggestionComplimentView';

export const identifiers = (type, n = 1) => {
    const date = new Date();
    const digit = value => value.toString().padStart(2, '0');

    date.setDate(date.getDate());

    if (type === 'daily') {
        const results = [];
        results.push(`${date.getFullYear()}-${digit(date.getMonth() + 1)}-${digit(date.getDate())}`);

        for (let i = 0; i < n; i++) {
            date.setDate(date.getDate() - 1);
            results.push(`${date.getFullYear()}-${digit(date.getMonth() + 1)}-${digit(date.getDate())}`);
        }

        return results.reverse();
    }

    if (type === 'monthly') {
        const results = [];
        results.push(`${date.getFullYear()}-${digit(date.getMonth() + 1)}`);

        for (let i = 0; i < n; i++) {
            date.setMonth(date.getMonth() - 1);
            results.push(`${date.getFullYear()}-${digit(date.getMonth() + 1)}`);
        }

        return results.reverse();
    }
    if (type === 'yearly') {
        const results = [];
        results.push(`${date.getFullYear()}`);

        for (let i = 0; i < n; i++) {
            date.setFullYear(date.getFullYear() - 1);
            results.push(`${date.getFullYear()}`);
        }

        return results.reverse();
    }
};




export const recommendationValid = recommendation => {
    if (!recommendation.reminder || recommendation.reminder === 'once') return false;

    const a = ['Agree', 'Neutral', 'Disagree'];
    const b = ['Great', 'Okay', 'Not good'];
    const c = ['Good', 'Okay', 'Poorly'];
    const d = ['Very good', 'Okay', 'Poorly'];

    const contents = recommendation.result.map(result => result.content);
    const matches = from => from.every(option => contents.includes(option));

    return matches(a) || matches(b) || matches(c) || matches(d);
};

// export  const recommendation = data => {
//     const count = data.result.map(result => result);

//     const percentage = (from, index = 0) => {
//         const count = Object.values(from.count);
//         const total = Object.values(from.total);

//         if (!total[index] || isNaN(total[index])) return 0;

//         const result = count[index] / total[index];
//         if (isNaN(result) || !isFinite(result)) return 0;
//         return result;
//     };

//     const change = from => {
//         const result = (percentage(from, 0) - percentage(from, 1)) / percentage(from, 1);
//         if (isNaN(result) || !isFinite(result)) return 0;
//         return result;
//     };

//     const search = content => data.result.filter(result => result.content === content)[0];

//     const agree = search('Agree') || search('Great') || search('Good') || search('Very good');
//     const neutral = search('Neutral') || search('Okay');
//     const disagree = search('Disagree') || search('Not good') || search('Poorly');

//     let unitName = '';
//     let labels = identifiers(data.reminder, 7);

//     if (data.reminder === 'daily') {
//         unitName = 'yesterday';
//     }

//     if (data.reminder === 'monthly') {
//         unitName = 'last month';
//     }

//     if (data.reminder === 'yearly') {
//         unitName = 'last year';
//     }

//     let description = '' //'No change from ' + unitName;

//     if (change(agree) < 0) {
//         description = `Down from ${unitName} by ${(Math.abs(change(agree) * 100)).toFixed(0)}%`;
//     }

//     if (change(agree) > 0) {
//         description = `Up from ${unitName} by ${(Math.abs(change(agree) * 100)).toFixed(0)}%`;
//     }

//     const randomChartData = n => {
//         return ([...new Array(n)]).map(_ => Math.random()).sort((a, b) => a < b ? -1 : 1);
//     };

//     return (
//         <div key={data.identifier} className={style.surveyCard}>
//             {/* <div className={style.shortcutIcon} style={{ backgroundImage: data.icon }} /> */}
//             <div className={style.shortcutInfo}>
//                 <div className={style.recommendationHeader}>
//                     <div className={style.recommendationIcon} style={{ backgroundImage: change(agree) < 0 ? icons.trendDown : icons.trendUp }} />
//                     <div className={style.recommendationInfo}>
//                         <div className={style.shortcutTitle}>{data.name}</div>
//                         <div className={style.shortcutDescription}>{description}</div>
//                     </div>
//                 </div>
//                 <div className={style.options} style={{ width: '100%', height: '10px', opacity: '0' }}>
//                     <div className={style.ratingOptions}>
//                         <div className={style.ratingOption}>
//                             <div className={style.ratingOptionIcon} style={{ backgroundImage: icons.faceHappy }} />
//                             <div className={style.ratingOptionPercent}>{(percentage(agree) * 100).toFixed(0)}%</div>
//                             <div className={style.ratingOptionChange}>{(change(agree) * 100) < 0 ? '' : '+'}{(change(agree) * 100).toFixed(0)}%</div>
//                         </div>
//                         <div className={style.ratingOption}>
//                             <div className={style.ratingOptionIcon} style={{ backgroundImage: icons.faceNeutral }} />
//                             <div className={style.ratingOptionPercent}>{(percentage(neutral) * 100).toFixed(0)}%</div>
//                             <div className={style.ratingOptionChange}>{(change(neutral) * 100) < 0 ? '' : '+'}{(change(neutral) * 100).toFixed(0)}%</div>
//                         </div>
//                         <div className={style.ratingOption}>
//                             <div className={style.ratingOptionIcon} style={{ backgroundImage: icons.faceSad }} />
//                             <div className={style.ratingOptionPercent}>{(percentage(disagree) * 100).toFixed(0)}%</div>
//                             <div className={style.ratingOptionChange}>{(change(disagree) * 100) < 0 ? '' : '+'}{(change(disagree) * 100).toFixed(0)}%</div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className={style.chart}>
//                     <div className={style.chartLegend}>
//                         <div className={style.ratingOptionIcon} style={{ backgroundImage: icons.faceHappy }} />
//                         <div className={style.ratingOptionIcon} style={{ backgroundImage: icons.faceNeutral }} />
//                         <div className={style.ratingOptionIcon} style={{ backgroundImage: icons.faceSad }} />
//                     </div>
//                     <ChartView points={randomChartData(7)} respondents={[4, 7, 28, 24, 32, 31, 36, 32]} size={{ height: 160 }} labels={labels} type="month" />
//                 </div>
//                 <div className={style.shortcutDescription}>{data.description}</div>
//             </div>
//         </div>
//     );
// };


const Home = props => {

    const [testVoted, setTestVoted] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [showQuestions, setShowQuestions] = useState(null);
    const [suggestionBadge, setSuggestionBadge] = useState(null);
    const [suggestionCompliment, setSuggestionCompliment] = useState(null);
    const [answered, setAnswered] = useState([]);
    const [posts, setPosts] = useState([]);
    const [post, setPost] = useState(null);
    const [addTicket, setAddTicket] = useState(null);
    const [added, setAdded] = useState(0);
    // const [recommendations, setRecommendations] = useState([]);
    const [search, setSearch] = useState('');

    const { auth, setPath, group, runShortcut, role, path } = useAppState();
    console.log("role", role, "path", path)



    const fetch = async () => {
        const [available, posts] = await Promise.all([
            surveys.available(group, (new Date()).toISOString()),
            groups.posts(group, 'post')
        ]);

        if (!available) {
            console.log('error fetching questions');
            return;
        }

        setQuestions(available);
        setPosts(posts);

        // const types = {
        //     daily: identifiers('daily'),
        //     monthly: identifiers('monthly'),
        //     yearly: identifiers('yearly')
        // };

        // const reports = await surveys.recommendations(group, types);
        // if (reports) setRecommendations(reports);
    };

    useEffect(() => {
        fetch();
    }, [group]);

    const [showNotifications, setShowNotifications] = useState(null);

    const actions = [
        // {
        //     icon: icons.add,
        //     perform: () => {
        //         setPost({});
        //         // fetch()

        //     } // setShowNotifications(true)
        // }
    ];

    const onSave = () => {
        setPost(null);
        fetch(group);
    };

    const item = item => (
        <div className={conditional('item', style, { selected: false })} onClick={() => { }}>
            <div className={style.itemContent}>
                <div className={style.itemInfo}>
                    <div className={style.itemPhoto}>
                        {item.user.photo ? <img src={item.user.photo} /> : null}
                    </div>
                    <div className={style.itemNameContent}>
                        <div className={style.itemNameContainer}>
                            <div className={style.itemName}>{item.user.firstName} {item.user.lastName}</div>
                            <div className={style.itemDate}>{date.format(item.date)}</div>
                        </div>
                        <div className={style.itemPreview}>{item.content}</div>
                        {item.image ? <div className={style.itemMedia}>
                            <img src={item.image} />
                        </div> : null}
                        {/* <div className={style.itemDate}>{item.title}</div> */}
                    </div>
                </div>

                {/* <div className={style.itemActions}>
                    <div className={style.itemShare}>Share</div>
                </div> */}
            </div>
        </div>
    );

    const currentIdentifier = type => {
        const date = new Date();

        const digit = value => value.toString().padStart(2, '0');

        if (type === 'once') return 'once';
        if (type === 'daily') return `${date.getFullYear()}-${digit(date.getMonth() + 1)}-${digit(date.getDate())}`;
        if (type === 'monthly') return `${date.getFullYear()}-${digit(date.getMonth() + 1)}`;
        if (type === 'yearly') return `${date.getFullYear()}`;

        return 'once';
    };

    const wait = time => new Promise(resolve => setTimeout(() => { resolve() }, time));

    const surveyAction = (question, option) => {
        const answer = async () => {
            const identifier = currentIdentifier(question.reminder);
            const result = await surveys.answer(question._id, option.index, identifier);

            if (!result) {
                console.log('error answering survey');
                return;
            }

            setAnswered(answered => [...answered, question._id]);

            await wait(2000);
            setQuestions(questions => questions.filter(q => q._id !== question._id));
        };

        return <div className={style.surveyAction} onClick={answer}>{option.content}</div>
    };

    const likertAction = (question, option) => {
        const answer = async () => {
            const identifier = currentIdentifier(question.reminder);
            const result = await surveys.answer(question._id, option.index, identifier);

            if (!result) {
                console.log('error answering survey');
                return;
            }

            setAnswered(answered => [...answered, question._id]);

            await wait(2000);
            setQuestions(questions => questions.filter(q => q._id !== question._id));
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

    const likertActions = (question, options) => {
        if (options.length !== 5) return null;
        // if (['strongly agree', 'agree', 'neutral', 'disagree', 'strongly disagree'].every(op => options.map()))

        // if (!options.map(option => option.toLowerCase()).includes([]) )
        return (
            <div className={style.surveyActions} style={{ display: !answered.includes(question._id) ? 'flex' : 'none' }}>
                {question.options.map(option => likertAction(question, option))}
                <div className={style.likertLegend}>
                    <div className={style.likertItem}>Strongly Agree</div>
                    <div className={style.likertItem}>Neutral</div>
                    <div className={style.likertItem}>Strongly Disagree</div>
                </div>
            </div>
        );
    };

    const surveyQuestion = question => (
        <div className={style.surveyCard}>
            <div className={style.surveyHeader}>
                <div className={style.featuredIcon} style={{ backgroundImage: icons.surveyFeed }} />
                <div className={style.featuredInfo}>
                    <div className={style.featuredTitle}>{question.name}</div>
                    {likertActions(question, question.options) || <div className={style.surveyActions} style={{ display: !answered.includes(question._id) ? 'flex' : 'none' }}>
                        {question.options.map(option => surveyAction(question, option))}
                    </div>}
                    <div className={style.surveyConfirm} style={{ display: answered.includes(question._id) ? 'flex' : 'none' }}>
                        <div className={style.surveyConfirmIcon} style={{ backgroundImage: icons.check }} />
                        <div className={style.surveyConfirmText}>Thanks for your feedback!</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const name = auth ? auth.user.firstName + ' ' + auth.user.lastName : '';

    const [animated, setAnimated] = useState(false);

    const shortcuts = [
        {
            icon: icons.chatColor,
            identifier: 'chat',
            title: 'Chat with HR',
            description: 'We\'re always happy to help',
            animation: 'a',
            action: () => {
                setPath('/chat');
                runShortcut('newChat');
            }
        },
        {
            icon: icons.headset,
            identifier: 'call',
            title: 'Call HR',
            description: 'Talk to us right now',
            animation: 'b',
            action: async () => {
                try {
                    await bridge.request('call', { phone: '18722500553' });
                } catch (e) {
                    console.log('Could not make request to bridge application');
                }
            }
        },
        // {
        //     icon: icons.send,
        //     identifier: 'email',
        //     title: 'Email HR',
        //     description: 'We would love to hear from you',
        //     animation: 'c',
        //     action: () => { setAddTicket({ type: 'chat' }) }
        // },
        {
            icon: icons.surveySelected,
            identifier: 'survey',
            title: 'Surveys',
            description: `${questions.length} question${questions.length !== 1 ? 's' : ''} for today`,
            animation: 'd',
            action: () => setShowQuestions(questions)
        },
        {
            icon: icons.twoHands,
            identifier: 'highFive',
            title: 'Give a High Five',
            description: 'Recognize someone today',
            animation: 'c',
            action: () => setPath('/contacts')
        }
    ];

    useEffect(() => {
        setTimeout(() => { setAnimated(false) }, 2100);
    }, []);

    const shortcutClass = conditional('shortcut', style, { animated });

    const activity = data => (
        <div key={data.identifier} className={shortcutClass + ' ' + style[data.animation]} onClick={() => data.action()}>
            <div className={style.shortcutIcon} style={{ backgroundImage: data.icon }} />
            <div className={style.shortcutInfo}>
                <div className={style.shortcutTitle}>{data.title}</div>
                <div className={style.shortcutDescription}>{data.description}</div>
            </div>
        </div>
    );

    // const shortcutClass = conditional('shortcut', style, { animated });


    // How are your coworkers performing
    // percentage(agree)} - {change(agree)

    const time = () => {
        const now = new Date();

        if (now.getHours() < 12) return 'morning';
        if (now.getHours() < 17) return 'afternoon';
        return 'evening';
    };

    return (
        <div className={style.Home}>
            <NavigationView title="Home" main titleLarge={role === 'analytics' ? 'Who do you want to recognize today?' : `Good ${time()}, \n${name}!`} actions={actions}>
                {role === 'user' ? (
                    <div className={style.homeActions}>
                        <div className={style.shortcuts}>
                            <div className={style.list}>
                                {shortcuts.filter((shortcut, index) => shortcut.identifier === 'survey' ? (questions.length > 0) : index <= 40).map(activity)}
                            </div>
                        </div>
                    </div>
                ) : null}

                {role === 'analytics' ? (
                    <div className={style.homeActions + ' ' + style.desktopOnly}>
                        <div className={style.shortcuts}>
                            {/* <div className={style.subheading}>Who do you want to recognize today?</div> */}
                            <div className={style.list} style={{ gridTemplateColumns: '1fr' }}>
                                <div className={style.shortcutSearch}>
                                    <div className={style.shortcutIcon} style={{ backgroundImage: icons.search }} />
                                    <div className={style.shortcutInfo}>
                                        <input className={style.search} value={search} onChange={e => setSearch(e.target.value)} onBlur={() => setTimeout(() => { setSearch('') }, 1000)} placeholder="Search for people"></input>
                                        {/* <div className={style.shortcutTitle}>{'test'}</div> */}
                                        {/* <div className={style.shortcutDescription}>{'test'}</div> */}
                                        {/* <input className={style.search} placeholder="Search for people"></input> */}
                                    </div>
                                </div>
                                {/* {recommendations.filter(recommendationValid).map(recommendation)} */}
                            </div>
                        </div>
                        <UserSuggestions search={search} onSelect={user => setSuggestionBadge(user)} />
                    </div>
                ) : null}

                {role === 'user' ? (
                    <div />
                    // <div className={style.homeActions + ' ' + style.desktopOnly}>
                    //     <div className={style.shortcuts}>
                    //         <div className={style.subheading}>Who do you want to recognize today?</div>
                    //         <div className={style.list} style={{ gridTemplateColumns: '1fr' }}>
                    //             <div className={style.shortcutSearch}>
                    //                 <div className={style.shortcutIcon} style={{ backgroundImage: icons.search }} />
                    //                 <div className={style.shortcutInfo}>
                    //                     <input className={style.search} placeholder="Search for people"></input>
                    //                     {/* <div className={style.shortcutTitle}>{'test'}</div> */}
                    //                     {/* <div className={style.shortcutDescription}>{'test'}</div> */}
                    //                     {/* <input className={style.search} placeholder="Search for people"></input> */}
                    //                 </div>
                    //             </div>
                    //             {/* {recommendations.filter(recommendationValid).map(recommendation)} */}
                    //         </div>
                    //     </div>
                    // </div>
                ) : (
                    <div className={style.homeActions + ' ' + style.desktopOnly}>
                        <div className={style.shortcuts}>
                            <div className={style.subheading}>Recent trends</div>
                            <div className={style.list}>
                                {props.recommendations.filter(recommendationValid).map(Recommendation)}
                            </div>
                        </div>
                    </div>
                )}

                {/* <div className={style.surveys}>
                    <div className={style.surveyCard}>
                        <div className={style.surveyHeader}>
                            <div className={style.featuredIcon} style={{ backgroundImage: icons.thumb }} />
                            <div className={style.featuredInfo}>
                                <div className={style.featuredTitle}>Who do you want to recognize today?</div>
                                <div className={style.surveyActions}>
                                    <div className={style.surveyAction} onClick={() => setPath('/contacts')}>Give High Five</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className={style.surveys}>
                    {/* {questions.map(surveyQuestion)} */}
                </div>
                {/* <div className={style.items}>
                    {posts.map(item)}
                </div> */}
                {/* <div className={style.items}>
                    {items.map(item)}
                </div> */}
            </NavigationView>
            <NotificationsView data={showNotifications} onBack={() => setShowNotifications(null)} onSelectUser={user => setSuggestionBadge(user)} onSelectUserCompliment={user => setSuggestionCompliment(user)} />
            <NewPostView data={post} onBack={() => setPost(null)} onSave={onSave} />
            <AvailableQuestionsView data={showQuestions} onBack={() => { fetch(); setShowQuestions(null) }} />
            <SuggestionBadgeView data={suggestionBadge} onBack={() => setSuggestionBadge(null)} />
            <SuggestionComplimentView data={suggestionCompliment} onBack={() => setSuggestionCompliment(null)} />
            <AddTicketModal data={addTicket} onDismiss={() => {setAddTicket(null);setAdded(add => add += 1)}} />
        </div>
    );

};

export default Home;
