
import React, { useState, useEffect } from 'react';
import style from './style.module.css';
import conditional from '../../utils/conditional';
import { useAppState } from '../../contexts/AppState';
import groups from '../../api/groups';

const UserSuggestions = props => {

    const { auth, group } = useAppState();

    const [results, setResults] = useState([]);

    const fetch = async () => {
        const members = await groups.members(group);

        if (!members) {
            console.log('Error fetching group members');
            return;
        }
        
        setResults(members.filter(member => member._id !== ((auth || {}).user || {})._id));
    };

    useEffect(() => {
        fetch();
    }, [group]);

    const validUsers = () => results.filter(result => {
        if (props.search.length < 2) return false;

        const name = result.firstName + ' ' + result.lastName;
        return name.toLowerCase().includes(props.search.toLowerCase());
    });

    const item = data => (
        <div className={conditional('item', style, { selected: false })} onClick={() => props.onSelect(data)}>
            <div className={style.itemContent}>
                <div className={style.itemPhoto} style={{ backgroundImage: `url('${data.thumbnail || 'https://cdn2.hubspot.net/hub/6444014/hubfs/PuzzleHR_October2019/images/Puzzle_favicon-150x150.png?width=108&height=108'}` }} />
                <div className={style.itemInfo}>
                    <div className={style.itemNameContent}>
                        <div className={style.itemName}>{data.firstName} {data.lastName}</div>
                        <div className={style.itemPreview}>{(data.groupData || {}).title}</div>
                        <div className={style.itemBadges}>
                            {/* {item.badgeData.map(itemBadge)} */}
                        </div>
                        {/* <div className={style.itemDate}>{item.date}</div> */}
                    </div>
                    {/* <div className={style.itemPreview}>{item.preview}</div> */}
                </div>
            </div>
        </div>
    );

    const userSuggestionsClass = conditional('UserSuggestions', style, { visible: validUsers().length });

    return (
        <div className={userSuggestionsClass}>
            <div className={style.items}>
                {validUsers().map(item)}
            </div>
        </div>
    );

};

export default UserSuggestions;
