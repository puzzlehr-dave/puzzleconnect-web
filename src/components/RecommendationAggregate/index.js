import React, { useState, useEffect } from 'react';
import { identifiers } from '../Home';
import style from './style.module.css';
import { useAppState } from '../../contexts/AppState';
import icons from '../../resources/icons';
import AggregateChartView from '../AggregateChartView';

const RecommendationAggregate = data => {

    const dataOverview = data.overview.reverse();    

    const { path } = useAppState();

    let unitName = '';
    unitName = 'last month'
    let percentage = 0;
    let description;
    const points = [];
    let respondents = [];

    const answerValues = {
        "Strongly Agree": 1,
        "Agree": 0.70,
        "Neutral": 0.50,
        "Disagree": 0.30,
        "Strongly Disagree": 0.10
    };
   
    const calculatePercentage = (data) => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const currentMonthIdentifier = `${currentYear}-${currentMonth}`;
    
        // Find the index of the current month's data in the data array
        const currentIndex = data.findIndex(item => {
            const month = Object.keys(item)[0];
            return month === currentMonthIdentifier;
        });
    
        // Check if there's data for the previous month
        if (currentIndex >= 0) {
            const currentMonthData = Object.values(data[currentIndex])[0] || 0;
            let previousMonthData = 0;
    
            if (currentIndex < data.length - 1) {
                previousMonthData = Object.values(data[currentIndex + 1])[0] || 0;
            }
    
            // Calculate the difference
            const difference = currentMonthData - previousMonthData;
            const percentageChange = previousMonthData !== 0 ? (difference / previousMonthData) * 100 : 0;
    
            if (!isNaN(percentageChange) && isFinite(percentageChange)) {
                percentage = percentageChange;
    
                if (percentageChange > 0) {
                    description = `Up from ${unitName} by ${(percentageChange).toFixed(0)}%`;
                } else if (percentageChange < 0) {
                    description = `Down from ${unitName} by ${(percentageChange).toFixed(0)}%`;
                } else {
                    description = 'No change from previous month';
                }
            }
        } else {
            // If there's no current month data available, set percentage change and description to zero
            percentage = 0;
            description = '';
        }
    
    };
    const calculateAverageForMonth = (monthData) => {
        let total = 0;
        let weightedTotal = 0;

        // Loop through each rating in the month's data & calculate
        for (const rating in answerValues) {
            const ratingCount = monthData[rating];
            weightedTotal += answerValues[rating] * ratingCount;
            total += ratingCount;
        }

        // Calculate the average for the month
        let average = total === 0 ? 0 : weightedTotal / total;

        // Ensure average doesn't exceed 0.9 to keep it on the chart
        if (average > 0.9) {
            average = 0.9;
        }

        return { average, total };
    };


    // Calculate Average & Current Percentage This month to last
    for (const month in dataOverview) {
        const result = calculateAverageForMonth(dataOverview[month]);

        points.push({ [month]: result.average });

        respondents.unshift(result.total)

        calculatePercentage(points);
    }


    const identifiers = (type, n = 1) => {
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
        
            for (let i = -1; i < n; i++) {
                // Calculate the current month and year
                let currentMonth = date.getMonth() - i;
                let currentYear = date.getFullYear();
        
                // Adjust for negative months (go back to the previous year)
                if (currentMonth < 0) {
                    currentYear -= 1;
                    currentMonth += 12; 
                }
        
                // Add the formatted date to the results array
                results.push(`${currentYear}-${digit(currentMonth + 1)}`);
            }
        
            // Reverse the results array before returning
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

    let labels = identifiers('monthly', 6);


    return (
        <div key={data.identifier} className={style.surveyCard}>
            {/* <div className={style.shortcutIcon} style={{ backgroundImage: data.icon }} /> */}
            <div className={style.shortcutInfo}>
                <div className={style.recommendationHeader}>
                    <div className={style.recommendationIcon} style={{ backgroundImage: percentage < 0 ? icons.trendDown : icons.trendUp }} />
                    <div className={style.recommendationInfo}>
                        {/* <div className={style.shortcutTitle}>{data ? Object.keys(data)[0] : null}</div> */}
                        <div className={style.shortcutDescription}>{description}</div>
                    </div>
                </div>
                <div className={style.options} style={{ width: '100%', height: '10px', opacity: '0' }}>
                    <div className={style.ratingOptions}>
                        <div className={style.ratingOption}>
                            <div className={style.ratingOptionIcon} style={{ backgroundImage: icons.faceHappy }} />
                            {/* <div className={style.ratingOptionPercent}>{(percentage(agree) * 100).toFixed(0)}%</div> */}
                            {/* <div className={style.ratingOptionChange}>{(change(agree) * 100) < 0 ? '' : '+'}{(change(agree) * 100).toFixed(0)}%</div> */}
                        </div>
                        <div className={style.ratingOption}>
                            <div className={style.ratingOptionIcon} style={{ backgroundImage: icons.faceNeutral }} />
                            {/* <div className={style.ratingOptionPercent}>{(percentage(neutral) * 100).toFixed(0)}%</div> */}
                            {/* <div className={style.ratingOptionChange}>{(change(neutral) * 100) < 0 ? '' : '+'}{(change(neutral) * 100).toFixed(0)}%</div> */}
                        </div>
                        <div className={style.ratingOption}>
                            <div className={style.ratingOptionIcon} style={{ backgroundImage: icons.faceSad }} />
                            {/* <div className={style.ratingOptionPercent}>{(percentage(disagree) * 100).toFixed(0)}%</div> */}
                            {/* <div className={style.ratingOptionChange}>{(change(disagree) * 100) < 0 ? '' : '+'}{(change(disagree) * 100).toFixed(0)}%</div> */}
                        </div>
                    </div>
                </div>
                <div className={style.chart}>
                    <div className={style.chartLegend}>
                        <div className={style.ratingOptionIcon} style={{ backgroundImage: icons.faceHappy }} />
                        <div className={style.ratingOptionIcon} style={{ backgroundImage: icons.faceNeutral }} />
                        <div className={style.ratingOptionIcon} style={{ backgroundImage: icons.faceSad }} />
                    </div>
                    <AggregateChartView path={path} points={points} respondents={respondents} size={{ height: 160 }} labels={labels} type="month" />
                </div>
                <div className={style.shortcutDescription}>{data.description}</div>
            </div>
        </div>
    );
};





export default RecommendationAggregate;