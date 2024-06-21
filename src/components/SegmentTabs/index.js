
import React from 'react';
import style from './style.module.css';
// import { Link } from 'react-router-dom';
import conditional from '../../utils/conditional';

const SegmentTabs = props => {

    const tab = (tab, index) => {
        const className = conditional('tab', style, {
            selected: props.selectedTab === index
        });

        return (
            <div className={className} onClick={() => props.onSelect(index)} style={{ display: props.hides && index === 0 ? 'none': 'inline-block' }}>
                <div className={style.backdrop} />
                <div className={style.content + ' b1'}>{tab}</div>
            </div>
        );
    }

    const segmentTabsClass = conditional('SegmentTabs', style, { minimal: props.minimal });

    return (
        <div className={segmentTabsClass}>
            {props.tabs.map(tab)}
        </div>
    );

};

export default SegmentTabs;
