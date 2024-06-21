
import React, { useState } from 'react';
import style from './style.module.css';

import NavigationBar from '../NavigationBar';
import ChatView from '../ChatView';
import NavigationView from '../ContentView';
import icons from '../../resources/icons';
import conditional from '../../utils/conditional';

const PromptList = props => {

    const [selected, setSelected] = useState(null);

    const actions = [
        {
            icon: icons.add,
            perform: () => {}
        }
    ];

    const select = index => {
        setSelected(index);
    };

    const item = (item, index) => (
        <div className={conditional('item', style, { selected: selected === index })} onClick={() => select(index)}>
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
    
    return (
        <div className={style.ChatList}>
            <NavigationView primary title="Questions" actions={actions}>
                <div className={style.items}>
                    {items.map(item)}
                </div>
            </NavigationView>
            <ChatView data={selected !== null ? items[selected] : null} onBack={() => {console.log('back');setSelected(null)}} />
        </div>
    );

};

export default PromptList;
