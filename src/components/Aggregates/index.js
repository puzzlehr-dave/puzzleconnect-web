import React, { useMemo, useState } from 'react';
import NavigationView from '../ContentView';
import style from './style.module.css';
import NotificationsView from '../LeaderboardView';
import { recommendationValid } from '../Home';
import Recommendation from '../Recommendation';
import RecommendationAggregate from '../RecommendationAggregate';

const Aggregates = (props) => {
    const actions = []

    const filteredRecommendations = props.recommendations
        ? props.recommendations.filter(recommendationValid)
        : [];

    const convertDateFormat = (date) => {
        let parts = date.split('-');

        if (parts.length === 3) {
            let year = parts[0];
            let month = parts[1];

            let convertedDateStr = year + '-' + month;
            return convertedDateStr
        } else {
            return date;
        }
    };

    const categoryMap = {
        'Talent Management': [
            'Our department is appropriately staffed',
            'The new employees who join our company are skilled and easily become part of our team',
            'The number of employees leaving the company has NOT negatively impacted my department and my ability to do well',
            'After finishing their initial training and orientation, new employees are ready to do their assigned tasks well'
        ],
        'Total Rewards': [
            'Our company demonstrates respect for work-life balance by providing the flexibility that allows me to succeed',
            'I think the pay I receive is fair for the work I have to do',
            'Our company insurance benefits meet the needs of myself and my family',
            'I am happy with the total paid time off (vacation/sick/PTO/holidays) offered to me'
        ],
        'Culture/Engagement': [
            'Our company employs people from different backgrounds and values diversity',
            'All employees at my company are treated fairly',
            'Our company culture is safe and welcomes new ideas and feedback',
            'I agree with the values and ethics of my company',
            'I would recommend my company to family and friends',
            'I can talk to my boss\'s boss if I need to'
        ],
        'Performance Management': [
            'I understand what is expected of me on a day-to-day basis',
            'The meetings I have with my manager are useful and help me get work done',
            'I get feedback that helps me do better at my job',
            'I am recognized for my efforts and a job well done',
            'The leaders at my company keep people informed about what is happening'
        ],
        'Learning/Development': [
            'I get the training I need within the company to do my job well',
            'The company supports my growth and improvement',
            'I know what my opportunities for advancement are in the organization',
            'I am made aware of job openings within my company'
        ]
        // 'Wellness Check-Ins': [
        //     'How was your day today?'
        // ]
    };

    //FUNCTION FOR ORGANIZING QUESTIONS INTO CATAEGORIES AND THEN COMBINING QUESTIONS RESULTS INTO AN OVERVIEW
    const handleOrganizeRecommendationResults = (data) => {
        console.log("incoming data", data)

        const questionCategories = {};

        for (const category in categoryMap) {
            const questions = categoryMap[category];

            for (const question of questions) {
                questionCategories[question] = category;
            }
        }

        let x = 0;

        data.forEach((dta) => {
            console.log('dta = ', dta);
            dta['category'] = questionCategories[dta.name] || 'Misc';
            x += 1;
        });

        if (!data) return;
        //STORES ALL CATEGORY / SURVEY QUESTIONS & OVERVIEW
        const obj = {};


        const a = ["Strongly Agree"];
        const b = ['Agree'];
        const c = ['Neutral'];
        const d = ['Disagree'];
        const e = ['Strongly Disagree'];


        // LOOP THROUGH DATA AND CREATE CATEGORIES & ASSIGN QUESTIONS TO CATEGORIES
        for (let i = 0; i < data.length; i++) {
            const recommendationCategory = data[i].category;
            const recommendationName = data[i].name;
            console.log('rn', recommendationName);
            //NO CATEGORY EXIST CREAATE NEW KEY 
            if (!obj.hasOwnProperty(recommendationCategory)) {
                obj[recommendationCategory] = {
                    [recommendationName]: data[i]
                }

                //LOOP THROUGH MONTHS AAND CHECK OVERVIEW FIELD TO POPULATE WITH SURVEY RESULTS

                const currentDate = new Date();
                let currentYear = currentDate.getFullYear();
                let currentMonth = currentDate.getMonth() + 1; // Adding 1 because JavaScript months are zero-based

                for (let i = 0; i < 7; i++) {
                    // Adjusting the year if the current month goes below 1
                    if (currentMonth < 1) {
                        currentMonth = 12;
                        currentYear--;
                    }

                    // Formatting month and year strings
                    const formattedMonth = String(currentMonth).padStart(2, '0');
                    const key = `${currentYear}-${formattedMonth}`;

                    // Creating overview array for the current month
                    if (!obj[recommendationCategory].hasOwnProperty('overview')) {
                        obj[recommendationCategory].overview = [];
                    }

                    obj[recommendationCategory].overview[key] = {
                        "Strongly Agree": 0,
                        "Agree": 0,
                        "Neutral": 0,
                        "Disagree": 0,
                        "Strongly Disagree": 0,
                    };

                    // Moving to the previous month
                    currentMonth--;
                }
            } else {
                obj[recommendationCategory][recommendationName] = data[i];
            }
        };
        // LOOP THROUGH DATA AND GRAB RESULTS AND APPLY OVERVIEW OF CATEGORY
        for (let i = 0; i < data.length; i++) {
            const surveyResults = data[i].result;
            const surveyCategory = data[i].category;
            if (!surveyResults) return;

            let j = 0;
            while (j < surveyResults.length) {

                const currentResultContent = surveyResults[j].content;
                const currentResultCount = surveyResults[j].count;

                //IS OF STRONGLY AGREE RESULT
                if (a.includes(currentResultContent)) {
                    // go into haashmaap and record result
                    for (const key in currentResultCount) {
                        let formattedDateKey = convertDateFormat(key);
                        obj[surveyCategory].overview[formattedDateKey][a] += currentResultCount[key]

                    }
                }
                // IS OF AGREE RESULT
                if (b.includes(currentResultContent)) {
                    // go into haashmaap and record result
                    for (const key in currentResultCount) {
                        let formattedDateKey = convertDateFormat(key);
                        obj[surveyCategory].overview[formattedDateKey][b] += currentResultCount[key]

                    }
                }
                // IS OF NEUTRAL RESULT
                if (c.includes(currentResultContent)) {
                    // go into haashmaap and record result
                    for (const key in currentResultCount) {
                        let formattedDateKey = convertDateFormat(key);
                        obj[surveyCategory].overview[formattedDateKey][c] += currentResultCount[key]

                    }
                }
                // IS OF DISAGREE RESULT
                if (d.includes(currentResultContent)) {
                    // go into haashmaap and record result
                    for (const key in currentResultCount) {
                        let formattedDateKey = convertDateFormat(key);
                        obj[surveyCategory].overview[formattedDateKey][d] += currentResultCount[key]

                    }
                }
                // IS OF STRONGLY DISAGREE RESULT
                if (e.includes(currentResultContent)) {
                    // go into haashmaap and record result
                    for (const key in currentResultCount) {
                        let formattedDateKey = convertDateFormat(key);
                        obj[surveyCategory].overview[formattedDateKey][e] += currentResultCount[key]

                    }
                }
                j++
            }

        }
        return obj
    };

    const recommendations = handleOrganizeRecommendationResults(filteredRecommendations);

    return (
        <div className={style.Aggregate}>
            <NavigationView main title="Analytics Categories" actions={actions}>
                <div className={style.AggregateList}>
                    {recommendations && Object.entries(recommendations).map(([key, value, i]) => (

                        <details key={i} className={style.accordion}>
                            <summary className={style.subheading}>{key}</summary>

                            <div className={style.accordionData}>
                                <RecommendationAggregate {...value} />
                            </div>
                        </details>
                    ))}

                </div>
            </NavigationView>

            <NotificationsView />
        </div>

    )
}

export default Aggregates