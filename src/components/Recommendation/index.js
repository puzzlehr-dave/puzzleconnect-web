import React from 'react';
import { identifiers } from '../Home';
import style from './style.module.css';
import ChartView from '../ChartView';
import { useAppState } from '../../contexts/AppState';
import icons from '../../resources/icons';

 const Recommendation = data => {
    const {path} = useAppState();

    const count = data.result.map(result => result);

    const percentage = (from, index = 0) => {
        const count = Object.values(from.count);
        const total = Object.values(from.total);

        if (!total[index] || isNaN(total[index])) return 0;

        const result = count[index] / total[index];
        if (isNaN(result) || !isFinite(result)) return 0;
        return result;
    };

    const change = from => {
        const result = (percentage(from, 0) - percentage(from, 1)) / percentage(from, 1);
        if (isNaN(result) || !isFinite(result)) return 0;
        return result;
    };

    const search = content => data.result.filter(result => result.content === content)[0];

    const agree = search('Agree') || search('Great') || search('Good') || search('Very good');
    const neutral = search('Neutral') || search('Okay');
    const disagree = search('Disagree') || search('Not good') || search('Poorly');

    let unitName = '';
    let labels = identifiers(data.reminder, 7);

    if (data.reminder === 'daily') {
        unitName = 'yesterday';
    }

    if (data.reminder === 'monthly') {
        unitName = 'last month';
    }

    if (data.reminder === 'yearly') {
        unitName = 'last year';
    }

    let description = '' //'No change from ' + unitName;

    if (change(agree) < 0) {
        description = `Down from ${unitName} by ${(Math.abs(change(agree) * 100)).toFixed(0)}%`;
    }

    if (change(agree) > 0) {
        description = `Up from ${unitName} by ${(Math.abs(change(agree) * 100)).toFixed(0)}%`;
    }

    const randomChartData = n => {
        return ([...new Array(n)]).map(_ => Math.random()).sort((a, b) => a < b ? -1 : 1);
    };

    return (
        <div key={data.identifier} className={style.surveyCard}>
            {/* <div className={style.shortcutIcon} style={{ backgroundImage: data.icon }} /> */}
            <div className={style.shortcutInfo}>
                <div className={style.recommendationHeader}>
                    <div className={style.recommendationIcon} style={{ backgroundImage: change(agree) < 0 ? icons.trendDown : icons.trendUp }} />
                    <div className={style.recommendationInfo}>
                        <div className={style.shortcutTitle}>{data.name}</div>
                        <div className={style.shortcutDescription}>{description}</div>
                    </div>
                </div>
                <div className={style.options} style={{ width: '100%', height: '10px', opacity: '0' }}>
                    <div className={style.ratingOptions}>
                        <div className={style.ratingOption}>
                            <div className={style.ratingOptionIcon} style={{ backgroundImage: icons.faceHappy }} />
                            <div className={style.ratingOptionPercent}>{(percentage(agree) * 100).toFixed(0)}%</div>
                            <div className={style.ratingOptionChange}>{(change(agree) * 100) < 0 ? '' : '+'}{(change(agree) * 100).toFixed(0)}%</div>
                        </div>
                        <div className={style.ratingOption}>
                            <div className={style.ratingOptionIcon} style={{ backgroundImage: icons.faceNeutral }} />
                            <div className={style.ratingOptionPercent}>{(percentage(neutral) * 100).toFixed(0)}%</div>
                            <div className={style.ratingOptionChange}>{(change(neutral) * 100) < 0 ? '' : '+'}{(change(neutral) * 100).toFixed(0)}%</div>
                        </div>
                        <div className={style.ratingOption}>
                            <div className={style.ratingOptionIcon} style={{ backgroundImage: icons.faceSad }} />
                            <div className={style.ratingOptionPercent}>{(percentage(disagree) * 100).toFixed(0)}%</div>
                            <div className={style.ratingOptionChange}>{(change(disagree) * 100) < 0 ? '' : '+'}{(change(disagree) * 100).toFixed(0)}%</div>
                        </div>
                    </div>
                </div>
                <div className={style.chart}>
                    <div className={style.chartLegend}>
                        <div className={style.ratingOptionIcon} style={{ backgroundImage: icons.faceHappy }} />
                        <div className={style.ratingOptionIcon} style={{ backgroundImage: icons.faceNeutral }} />
                        <div className={style.ratingOptionIcon} style={{ backgroundImage: icons.faceSad }} />
                    </div>
                    <ChartView path={path} points={randomChartData(7)} respondents={[4, 7, 28, 24, 32, 31, 36, 32]} size={{ height: 160 }} labels={labels} type="month" />
                </div>
                <div className={style.shortcutDescription}>{data.description}</div>
            </div>
        </div>
    );
};





export default Recommendation