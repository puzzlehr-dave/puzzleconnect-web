
import React, { useRef, useState } from 'react';
import style from './style.module.css';

import SurveyView from '../SurveyView';
import NavigationView from '../ContentView';
import icons from '../../resources/icons';
import conditional from '../../utils/conditional';
import { useEffectGroup } from '../../contexts/AppState';
import surveys from '../../api/surveys';
import date from '../../utils/date';
import { useAppState } from '../../contexts/AppState';
import NewQuestionView from '../NewQuestionView';
import ListHeader from '../ListHeader';

const SurveyList = props => {

    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState(null);
    const [updates, setUpdates] = useState(null);
    const [question, setQuestion] = useState(null);

    const { group } = useAppState();

    const groupIdentifier = useRef();

    const fetch = async group => {
        const results = await surveys.list(group);

        if (!results) {
            console.log('error fetching surveys');
            return;
        }
        
        setItems(results.sort((a, b) => (new Date(b.date)) - (new Date(a.date))));

        console.log('Survey results', results)

        groupIdentifier.current = group;
    };

    const add = async () => {
        setQuestion({});
        // if (items.some(item => item._id === 'new')) {
        //     select(0);
        //     return;
        // }

        // const message = { _id: 'new' };
        // setItems([message, ...items]);
        // select(0);
    };

    const updateChat = chat => {
        // setTimeout(() => {
        //     console.log('upd', items, chat);
        //     setItems(items => items.map(item => item._id === chat._id ? chat : item));
        // }, 100);
    };

    useEffectGroup(fetch);

    const actions = [
        {
            icon: icons.add,
            perform: () => add(),
            // name: 'New Chat',
            // primary: true
        }
    ];

    const select = index => {
        setSelected(index);
    };

    const addChat = chat => {
        setItems(items => items.map(item => item._id === 'new' ? chat : item));
    };

    const total = item => {
        const answers = item.total; // item.results.reduce((sum, current) => sum + current.count, 0);
        return `${answers} participant${answers === 1 ? '' : 's'}`;
    };

    const onSave = () => {
        setQuestion(null);
        fetch(group);
    };

    const item = (item, index) => (
        <div className={conditional('item', style, { selected: selected === index })} onClick={() => select(index)}>
            <div className={style.itemContent}>
                {/* <div className={style.itemPhoto} /> */}
                <div className={style.itemInfo}>
                    <div className={style.itemNameContent}>
                        <div className={style.itemName}>{item._id !== 'new' ? item.name : 'New Question'}</div>
                        <div className={style.itemDate}>{item._id !== 'new' ? date.format(item.date) : ''}</div>
                    </div>
                    <div className={style.itemPreview}>{item._id !== 'new' ? total(item) : 'What do you want to ask?'}</div>
                </div>
            </div>
        </div>
    );
    
    return (
        <div className={style.SurveyList}>
        <NavigationView primary title="Questions" actions={actions}>
            <ListHeader title="New Question" description="Get feedback from your team" action={add} />
            <div className={style.items}>
                {items.map(item)}
            </div>
            </NavigationView>
            <SurveyView data={selected !== null ? items[selected] : null} updates={updates} add={addChat} update={updateChat} onBack={() => setSelected(null)} onArchive={() => {setSelected(null);fetch(group)}} />
            <NewQuestionView data={question} onBack={() => setQuestion(null)} onSave={onSave} />
        </div>
    );

};

export default SurveyList;
