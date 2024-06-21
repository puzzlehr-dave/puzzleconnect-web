
import React, { useEffect, useState } from 'react';
import style from './style.module.css';
import conditional from '../../utils/conditional';

import NavigationView from '../ContentView';
import icons from '../../resources/icons';
import ProfileView from '../ProfileView';

const FeedView = props => {

    const [current, setCurrent] = useState(null);

    useEffect(() => {
        if (!props.data) return;
        setCurrent(props.data);
    }, [props.data]);

    const items = [
        {
            name: 'Gabe',
            preview: 'Hey Gabe, I looked at the project and it sounds great. A few things to do before we move forward.',
            sent: true
        },
        {
            name: 'Gabe',
            preview: 'Hey Gabe, I looked at the project and it sounds great. A few things to do before we move forward.',
            sent: false
        },
        {
            name: 'Gabe',
            preview: 'Hey Gabe, I looked at the project and it sounds great. A few things to do before we move forward.',
            sent: true
        },
        {
            name: 'Gabe',
            preview: 'Hey Gabe, I looked at the project and it sounds great. A few things to do before we move forward.',
            sent: false
        },
        {
            name: 'Gabe',
            preview: 'Hey Gabe, I looked at the project and it sounds great. A few things to do before we move forward.',
            sent: true
        },
        {
            name: 'Gabe',
            preview: 'Hey Gabe, I looked at the project and it sounds great. A few things to do before we move forward.',
            sent: false
        },
        {
            name: 'Gabe',
            preview: 'Hey Gabe, I looked at the project and it sounds great. A few things to do before we move forward.',
            sent: true
        }
    ];

    const response = item => (
        <div className={style.response}>
            <div className={style.responseInfo}>
                <div className={style.responsePhoto} />
                <div className={style.responseName}>{'Gabe The Coder'}</div>
            </div>
            <div className={style.responseText}>{item.preview}</div>
        </div>
    );
    
    const item = (item, index) => (
        <div className={conditional('item', style, { received: index % 2 === 0 })}>
            <div className={style.itemContent}>
                <div className={style.itemPhoto} />
                <div className={style.itemInfo}>
                    <div className={style.itemNameContent}>
                        <div className={style.itemName}>{item.name}</div>
                        <div className={style.itemDate}>{item.date || 'Date'}</div>
                    </div>
                    <div className={style.itemPreview}>{item.preview}</div>
                </div>
            </div>
        </div>
    );

    const feedViewClass = conditional('FeedView', style, { visible: props.data !== null });
    
    const actions = [
        {
            icon: icons.add,
            perform: () => {}
        }
    ];

    return (
        <div className={feedViewClass}>
            <NavigationView secondary title={'Post'} onBack={() => props.onBack()} actions={actions}>
                <div className={style.items}>
                    {items.map(item)}
                </div>
            </NavigationView>
        </div>
    );

};

export default FeedView;
