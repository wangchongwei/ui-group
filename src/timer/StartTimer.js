/**
 * 有开始时刻、结束时刻节点的倒计时 组件
 * 时间倒数器
 */
import React from 'react';
import { View, Text, AppState } from 'react-native';
import * as CommonFunc from './utils';


/** 将分钟转换为时钟格式 */
function transMinuteToHour (minute: number) {
  if(minute < 60) return minute;
  if(minute === 60) return '1 : 00';
  const hour = parseInt(minute / 60);
  const min = parseInt(minute % 60);
  if(min < 10) return hour + ' : 0' + min;
  return hour + ' : ' + min;
}


 /** 将秒转换为时钟、分钟的显示 */
function transSecondToMins (second: number) {
  if(second) {
    if(second < 10) {
      if(second < 0) {
        return false;
      }
      return '0' + second;
    }
    if (second <= 60) {
      return second;
    }
    const mins = parseInt(second / 60);
    const sec = parseInt(second % 60);
    // 0分0秒
    if(mins === 0 && sec === 0) {
      return false;
    }
    const minute = transMinuteToHour(mins);
    if(sec === 0) {
      return minute + ' : 00';
    }
    if(sec < 10) {
      return minute + ' : 0' + sec;
    }
    return minute + ' : ' + sec;
  }
  return false;
}

/** 获取初始化时的秒钟 */
function getInitSecond(startTime, endTime) {
    const now = new Date();
    const startDate = startDate ? CommonFunc.getDateForStr(startTime, true) : now;
    const startSecond = startDate.getTime();
    const endSecond = CommonFunc.getDateForStr(endTime, true).getTime();
    const second = (endSecond - startSecond) / 1000;
    
    return parseInt(second);
}

type Props = {
  tips: string; // 倒数时间结束后的提示语句
  onEnd: Function; // 倒计时结束后执行的回调
  textStyle: any; // 文本样式
  startTime: string; // 开始时间节点文本
  endTime: string; // 结束时间节点文本
}
type State = {
  date: string | number; // 显示的时长,
}

export default class CountDownTimer extends React.PureComponent<Props, State> {

  
  interval: Object; // 循环计时器
  second: number; // 循环次数
  initTime: number; // 初始化的系统毫秒数
  appStateTime: number; // appState被唤醒的系统毫秒数
  duration: number; // 有效期的时长间隔
  allSecond: number; // 有效期的总时长秒数
  static defaultProps = {
    duration: 30,
  }
  state = {
    date: transSecondToMins(getInitSecond(this.props.startTime, this.props.endTime)),
  }
  componentWillMount() {
    this.passTime();
    this._initParams();
    // 计算一次
    this._setDate();
      this.second += 1;
    AppState.addEventListener('change', this.handleAppStateChange);
    this.interval = setInterval(()=> {
      this._setDate();
      this.second += 1;
    }, 1000);
  }

  componentWillUnmount() {
    this.removeListener();
  }

  removeListener =() => {
    clearInterval(this.interval);
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  interval = {}
  second = 0
  initTime = 0
  appStateTime = 0
  duration = 0
  allSecond = 0

  /** 初始化数据 */
  _initParams = () => {
    const { endTime } = this.props;
    let allSecond = 0;
      // 如果截止日期存在
    const date = CommonFunc.getDateForStr(endTime, true);
      // 总时长等于 截止日期 减去 开始日期
    allSecond = (date.getTime() - this.initTime) / 1000;
    this.allSecond = allSecond;
  }

  // 当app状态改变时
  handleAppStateChange =() => {
    console.log('AppState.currentState', AppState.currentState);
    if('active' === AppState.currentState) {
        this.parTime(true);
    } else if ('background' === AppState.currentState) {
        this.initTime = new Date().getTime();
    }
  }

  passTime =() => {
    this.initTime = new Date().getTime();
    const { startTime } = this.props;
    // 开始日期存在
    const createDate = CommonFunc.getDateForStr(startTime, true);
    console.log('createDate', createDate);
    this.initTime = createDate.getTime(); // 初始化的日期秒数等于下单时的秒数
    this.parTime(false);
  }

  /** 计算毫秒差值 */
  parTime =(initTimeReset: boolean = true) => {
    this.appStateTime = new Date().getTime();
    const duration = parseInt((this.appStateTime -  this.initTime) / 1000);
    console.log(duration);
    if(initTimeReset) {
      // 初始化时间是否需要重置  如果是app前后台切换则需要重置
      this.initTime = this.appStateTime;
    }
    this.second += duration;
  }

  /** 获取时长 */
  _setDate =() => {
    const { tips } = this.props;
    // 获取剩余时间秒数
    const leftSecond = this.allSecond - this.second;
    const text = transSecondToMins(leftSecond);
    if(text) {
      this.setState({ date: text });
    } else {
      this.setState({ date: tips });
      this._stop();
    }
  }

  /** 结束循环 */
  _stop =() => {
    const { onEnd } = this.props;
    onEnd && onEnd();
    clearInterval(this.interval);
  }

  render() {
    const { date } = this.state;
    const { textStyle } = this.props;
    return(
      <View><Text style={textStyle}>{date}</Text></View>
    );
  }
}