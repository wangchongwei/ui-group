/**
 * 时间选择组件
 */
import React from 'react';
import { View, StyleSheet, Modal, Dimensions, TouchableOpacity } from 'react-native';
import PickerScroll from './PickerScroll';
import { Text } from '../../index';

const { width } = Dimensions.get('window');
type Props = {
  title: string; // 标题
  defaultDate: Date | string; // 默认被选中的时间
  onChangeDate: Function; // 选择时间的回调
  maxDate: Date; // 最大可供选择日期
  minDate: Date; // 最小可供选择日期
}

type State = {
  showModal: boolean; // 是否展示时间选择的modal
}

export default class DatePicker extends React.PureComponent<Props, State>{

  params: Object; // 被选中的值
  scrollParams: Object; // 滚动中的值
  static defaultProps = {
    defaultDate: new Date(),
    minDate: new Date(1949, 9, 10), // 最小日期
    maxDate: new Date(),
  }
  state = {
    showModal: false,
  }

  componentDidMount() {
    const { defaultDate } = this.props;
    this.initParams(defaultDate);
  }

  params = {
    year: '',
    month: '',
    day: '',
    type: 4,
  }
  scrollParams = {}

  /** 初始化数据 */
  initParams =(date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    this.setParams(year, month, day);
  }

  /** 这只当前被选中的值 */
  setParams =(year, month, day) => {
    this.params = {
      ...this.params,
      year,
      month,
      day,
    };
    this.scrollParams = {
      ...this.params,
    };
    this.onChangeDate();
  }

  /** 打开modal */
  openModal =() => {
    this.setState({ showModal: true });
  }


  /** 关闭modal */
  closeModal =() => {
    this.setState({ showModal: false });
  }

  /** 当选中时回调 */
  onChangeDate =() => {
    const { onChangeDate } = this.props;
    onChangeDate && onChangeDate(this.params);
  }

  /** 点击确定时 */
  _commit =() => {
    this.closeModal();
    this.params = {
      ...this.scrollParams,
    };
    this.onChangeDate();
  }
  
  /** 年份数据 */
  _createYear =() => {
    const minYear = this._getLimitNumber('year', 'min');
    const maxYear = this._getLimitNumber('year', 'max');
    const year = [];
    for(let i = minYear; i <= maxYear; i ++) {
      year.push(i);
    }
    return year;
  }

  /** 获取被限制的最大|最小日期 */
  _getLimitNumber =(pickerType: 'year'|'month'|'day', limitType: 'max'|'min') => {
    const { minDate, maxDate } = this.props;
    const param = {
      max: {
        year: maxDate.getFullYear(),
        month: maxDate.getMonth() + 1,
        day: maxDate.getDate(),
      },
      min: {
        year: minDate.getFullYear(),
        month: minDate.getMonth() + 1,
        day: minDate.getDate(),
      },
    };
    return param[limitType][pickerType];
  }

  /** 月份 */
  _createMonth =(min: number = 1, max: number = 12) => {
    const month = [];
    for(let i = min; i <= max; i ++) {
      month.push(i);
    }
    return month;
  }

  /** 构建现在需要的月份数据 */
  _createNowMonth =() => {
    const nowYear = this.params.year;
    const maxYear = this._getLimitNumber('year', 'max');
    const minYear = this._getLimitNumber('year', 'min');
    if(maxYear === nowYear) {
      // 当年份被选中最大日期
      return this._createMonth(1, this._getLimitNumber('month', 'max'));
    } else if (minYear === nowYear) {
      return this._createMonth(this._getLimitNumber('month', 'min'), 12);
    } else {
      return this._createMonth();
    }
  }

  /** 初始化 日 的数据 */
  _initNowDay =() => {
    const maxYear = this._getLimitNumber('year', 'max');
    const minYear = this._getLimitNumber('year', 'min');
    const maxMonth = this._getLimitNumber('month', 'max');
    const minMonth = this._getLimitNumber('month', 'min');
    const maxDay = this._getLimitNumber('day', 'max');
    const minDay = this._getLimitNumber('day', 'min');
    let day = [];
    const type = this._getDayType();
    if(this.scrollParams.year === maxYear && this.scrollParams.month === maxMonth) {
      // 最大年、月时
      day = this._getDayData(1, maxDay);
    } else if (this.scrollParams.year === minYear && this.scrollParams.month === minMonth) {
      // 最小年、月时
      day = this._getDayData(minDay, 27 + type);
    } else {
      // 平常
      day = this._getDayData(1, 27 + type);
    }
    return day;
  }

  /**
   * 日的数据
   * type 
   * 1|正常的2月
   * 2|闰二月
   * 3|小月
   * 4|大月
   */
  _createDay =(type: 1|2|3|4 = 4) => {
    const day = this._getDayData(1, 27 + type);
    return day;
  }

  /** 获取一个区间数组 */
  _getDayData =(minDay: number = 1, maxDay: number = 28) => {
    const day = [];
    for(let i = minDay; i <= maxDay; i ++) {
      day.push(i);
    }
    return day;
  }


  /** 改变月份数据 */
  _changeMonthData =(data: Array<number>) => {
    this.refs.month && this.refs.month.changeStateData(data);
  }
  
  /** 改变 日 的数据 */
  _changeDayData =(data: Array<number>) => {
    this.refs.day && this.refs.day.changeStateData(data);
  }

  /** 当某个scrollPicker选中的值变化时 */
  _onDataChange =(componentKey, itemData, itemIndex) => {
    this.scrollParams[componentKey] = itemData;
    // 当 年 的被选中日期被改时
    const maxYear = this._getLimitNumber('year', 'max');
    const minYear = this._getLimitNumber('year', 'min');
    if(componentKey === 'year') {
      let monthData = [];
      if(maxYear === itemData) {
        // 当年份被选中最大日期
        monthData = this._createMonth(1, this._getLimitNumber('month', 'max'));
      } else if (minYear === itemData) {
        monthData = this._createMonth(this._getLimitNumber('month', 'min'), 12);
      } else {
        monthData = this._createMonth();
      }
      this._changeMonthData(monthData);
      this._upateDayData();
    } else if (componentKey === 'month') {
      // const maxMonth = this._getLimitNumber('month', 'max');
      // const minMonth = this._getLimitNumber('month', 'min');
      // if(this.scrollParams.year === maxYear && this.scrollParams.month === maxMonth) {
      //   // 年、月都取到了最大日期
      // } else if (this.scrollParams.year === minYear && this.scrollParams.month === minMonth) {
      //   // 年、月都取到了最小日期
      // } else {
      // }
      const day = this._initNowDay();
      this._changeDayData(day);
    } else {

    }
  }

  /** 获取 日 数据类型 1|2|3|4 非闰二月|闰二月|小月|大月 */
  _getDayType =() => {
    let type = 4;
    if(this.scrollParams.year % 4 === 0) {
      // 闰年
      if(this.scrollParams.month in { 4: 1, 6: 1, 9: 1, 11: 1}) {
        // 小月
        type = 3;
      } else if(this.scrollParams.month === 2) {
        // 润二月
        type = 2;
      }
    } else {
      if(this.scrollParams.month in { 4: 1, 6: 1, 9: 1, 11: 1}) {
        // 小月
        type = 3;
      } else if(this.scrollParams.month === 2) {
        // 润二月
        type = 1;
      }
    }
    return type;
  }

  /** 修改 日 的数据 */
  _upateDayData =() => {
    const type = this._getDayType();
    if(type !== this.scrollParams.type) {
      this.refs.day && this.refs.day.changeStateData(this._createDay(type));
      this.scrollParams.type = type;
    }
  }

  render() {
    const { title } = this.props;
    return(
      <Modal
        ref={(ref) => { this.modal = ref; }}
        transparent
        animationType={'fade'}
        style={{ flex: 1 }}
        visible={this.state.showModal}
        onRequestClose={() => { this.setState({ showModal: false }); }}
      >
        <View
          style={{ flex: 1, backgroundColor: '#00000033' }}
        >
          <TouchableOpacity onPress={this.closeModal} style={{ flex: 1 }} />
          <View style={styles.commitiew}>
            <Text onPress={this.closeModal} style={styles.cancel}>取消</Text>
            <Text style={styles.titleText}>{title}</Text>
            <Text onPress={this._commit} style={styles.sure}>确定</Text>
          </View>
          <View style={styles.titleView}>
            <Text style={styles.leftText}>年</Text>
            <Text style={[styles.leftText, { flex: 3 }]}>月</Text>
            <Text style={[styles.leftText, { flex: 3 }]}>日</Text>
          </View>
          <View style={styles.scroll}>
            <PickerScroll
              ref='year'
              componentKey='year'
              style={styles.left}
              data={this._createYear()}
              onDataChange={this._onDataChange}
              defaultData={this.params.year}
            />
            <PickerScroll
              ref='month'
              componentKey='month'
              style={styles.center}
              data={this._createNowMonth()}
              onDataChange={this._onDataChange}
              defaultData={this.params.month}
            />
            <PickerScroll
              ref='day'
              componentKey='day'
              style={styles.right}
              data={this._initNowDay()}
              onDataChange={this._onDataChange}
              defaultData={this.params.day}
            />
          </View>
          <View style={styles.line} />
          <View style={[styles.line, { bottom: 120 }]} />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  scroll: {
    flexDirection: 'row',
    backgroundColor: '#f6f6f6',
    height: 160,
    position: 'absolute',
    paddingHorizontal: 20,
    bottom: 0,
  },
  left: {
    width: (width - 40) * 0.4,
  },
  center: {
    width: (width - 40) * 0.3,
    flex: 2,
  },
  right: {
    width: (width - 40) * 0.3,
    flex: 2,
  },
  titleView: {
    height: 28,
    width,
    backgroundColor: '#dddddd',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 160,
    paddingHorizontal: 20,
  },
  line: {
    height: 1,
    width,
    backgroundColor: '#DDDDDD',
    position: 'absolute',
    bottom: 80,
  },
  leftText: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#999999',
    fontSize: 12,
    textAlign: 'center',
  },
  commitiew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 46,
    width,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 188,
  },
  cancel: {
    color: '#999999',
    fontSize: 14,
    textAlign: 'left',
  },
  sure: {
    color: '#D63C83',
    textAlign: 'right',
    fontSize: 14,
  },
  titleText: {
    flex: 1,
    textAlign: 'center',
    color: '#666666',
    fontSize: 14,
  },
});
