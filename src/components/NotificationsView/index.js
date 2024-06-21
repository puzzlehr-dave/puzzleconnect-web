
import React, { useEffect, useState } from 'react';
import style from './style.module.css';
import axios from 'axios';

import NavigationView from '../ContentView';
import conditional from '../../utils/conditional';
import icons from '../../resources/icons';
import ProfileView from '../ProfileView';

const NotificationsView = props => {

    const test = [
        {
            name: 'Employee Satisfaction',
            preview: 'Chris Timol invited you to take a survey.',
            date: 'Yesterday'
        },
        {
            name: 'Compliance Report',
            preview: 'Time to submit your weekly survey.',
            date: 'Oct 8'
        },
        {
            name: 'Manager Approval Rating',
            preview: 'Joe Daggar invited you to take a survey.',
            date: 'Oct 4'
        },
        {
            name: 'Workplace Environment',
            preview: 'Geeky Interactive invited you to take a survey.',
            date: 'Oct 3'
        }
    ];

    const [current, setCurrent] = useState(null);
    const [items, setItems] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        if (!props.data) return;
        setCurrent(props.data);
    }, [props.data]);

    useEffect(() => {
        setItems(test);
    }, []);

    const wait = time => new Promise(resolve => setTimeout(() => { resolve() }, time));

    const ask = async () => {
        const question = input;
        setInput('');

        try {
            setItems(items => [...items, { name: 'Me', preview: question, sent: true }]);

            const result = await axios.post('https://api.promptjs.io/chat', {
                request: {
                    content: question
                }
            });

            await wait(1000);

            const response = result.data[0];
            if (response) setItems(items => [...items, { name: 'Puzzle', preview: response.content.split('[name]').join('Gabe'), sent: false }]);
        } catch (e) {}
    };
    
    const response = item => (
        <div className={style.response}>
            <div className={style.responseInfo}>
                <div className={style.responsePhoto} />
                <div className={style.responseName}>{'Gabe The Coder'}</div>
            </div>
            <div className={style.responseText}>{item.preview}</div>
        </div>
    );

    const select = index => {
        
    };
    
    const item = (item, index) => (
        <div className={conditional('item', style, { selected: false })} onClick={() => select(index)}>
            <div className={style.itemContent}>
                <div className={style.itemPhoto} />
                <div className={style.itemInfo}>
                    <div className={style.itemNameContent}>
                        <div className={style.itemName}>{item.name}</div>
                        <div className={style.itemDate}>{item.date}</div>
                    </div>
                    <div className={style.itemPreview}>{item.preview}</div>
                </div>
            </div>
        </div>
    );

    const notificationsViewClass = conditional('NotificationsView', style, { visible: props.data !== null });
    
    const actions = [];

    return (
        <div className={notificationsViewClass}>
            <NavigationView title={'Shortcuts'} side onBack={() => props.onBack()} actions={actions}>
                <div className={style.items}>
                    {/* {items.map(item)} */}
                </div>
            </NavigationView>
        </div>
    );

};

export default NotificationsView;
