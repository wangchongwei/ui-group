/**
 * 倒计时组件
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import StartTimer from './StartTimer';
import MinuteCountDownTimer from './MinuteCountDownTimer';
import * as Common from './utils';


type Props = {
    startTime: string; // 开始时间节点文本
    endTime: string; // 结束时间节点文本
    duration: number; // 时长 以分钟为单位
}

type State = {}

export default class MyClass extends React.PureComponent<Props, State>{

    state = {}

    render(){
        const { startTime, endTime, duration, ...other } = this.props;
        if(duration && !startTime) {
            return(
                <MinuteCountDownTimer
                    {...other}
                    duration={duration}
                />
            )
        } else if (startTime && endTime) {
            return (
                <StartTimer
                    {...other}
                    startTime={startTime}
                    endTime={endTime}
                />
            )
        } else if (startTime && duration) {
            return (
                <StartTimer
                    {...other}
                    startTime={startTime}
                    endTime={Common.format(Common.getDate(30, 5), 'YYYY-MM-DD hh:mm:ss')}
                />
            )
        } else {
            console.warn('传入的数据错误，部分字段缺失，请检查');
        }
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
});


