/**
 * 选择的滚轮
 */
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from '../../index';


type Props = {
  data: any; // 数据源
  defaultData: any; // 默认被选中的值
  defaultIndex: number; // 默认被选中的下标
  onDataChange: Function; // 当选中的值发生改变
  componentKey: string; // 组件key值
}

type State = {
  currentIndex: number;
}

export default class PickerScroll extends React.PureComponent<Props, State>{

  static defaultProps = {
    data: [],
    defaultIndex: 0,
  }

  state = {
    currentIndex: this.props.defaultIndex,
    data: [].concat(this.props.data),
  }
  
  componentDidMount() {
    this._setAndScroll(this.state.currentIndex);
  }


  /** 设置默认被选中项 */
  setDefaultCurrentIndex =(index: number) => {
    this._setAndScroll(index - 1);
  }

  /** 修改state中的数据源 */
  changeStateData = async(data: Array<any>) => {
    if(data.length !== this.state.data.length) {
      // 只有当长度不一致 即数据发生了变化才需要setState
      await this.setState({ data, currentIndex: 0 });
      this._scrollToY(0);
      this.onDataChange(0);
    } else {
    }
  }

  /** 当scrollView滚动动画结束的监听 */
  onAnimationEnd =(e: Object) => {
    if(!this.refs.scroll) return;
    this._onScroll(e);
  }

  /** 当被拖拽时 */
  onScrollEndDrag =(e: Object) => {
    if(!this.refs.scroll) return;
    this._onScroll(e);
  }

  /** 监听scrollView的滚动事件 */
  _onScroll =(e: Object) => {
    // 求出垂直方向上的偏移量 
    var offSetY = e.nativeEvent.contentOffset.y;
    const current = offSetY / 40;

    const a = parseInt(current / 1);
    const b = parseInt(current * 10 / 5);

    let n = a;
    if (2 * a < b) {
      n = a + 1;
    }
    this._setAndScroll(n);
  }

  /** 设置当前的下标并滚动 */
  _setAndScroll =(x) => {
    const numX = parseInt(x);
    this._scrollToY(numX);
    this.setState({ currentIndex: numX });
    this.onDataChange(numX);
  }

  /** 当选中的数据变化，回调到上一层 */
  onDataChange =(numX) => {
    const { onDataChange, componentKey } = this.props;
    const { data } = this.state;
    onDataChange && onDataChange(componentKey, data[numX], numX);
  }

  /** scrollView滚动y轴偏移单位量 */
  _scrollToY =(offsetY: number) => {
    this.refs.scroll && this.refs.scroll.scrollTo({ x:0, y: parseInt(offsetY) * 40, animated: true});
  }

  /** 当scrollView组件初始化完成，scrollView只有在初始化完成才会响应scrollTo事件 */
  _onLayout =() => {
    const { currentIndex, data } = this.state;
    const { defaultData } = this.props;
    if(currentIndex >= data.length) return;
    if(defaultData) {
      const index = data.indexOf(defaultData);
      if(index >= 0 && index !== currentIndex) {
        this._setAndScroll(index);
      }
    }
  }

  render() {
    const { style, ...other } = this.props;
    const { currentIndex, data } = this.state;
    return(
      <View style={{ height: 160 }}>
        <ScrollView
          {...other}
          onLayout={this._onLayout}
          scrollEventThrottle={2}
          contentContainerStyle={styles.center}
          style={[styles.white, style]}
          ref='scroll'
          onMomentumScrollEnd={this.onAnimationEnd}
          onScrollEndDrag={this.onScrollEndDrag}
          contentOffset={{x:0, y: currentIndex * 40}}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ height: 40 }} />
          {
            data.map((item, index) => (
              <View key={data[index]} style={[styles.itemView]}>
                <Text style={[styles.text, { color: currentIndex === index ? '#333333' : '#999999' }]}>{data[index]}</Text>
              </View>
            ))
          }
          <View style={{ height: 80 }} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemView: {
    height: 40,
    justifyContent: 'center',
  },
  line: {
    height: .5,
    backgroundColor: 'red',
    position: 'absolute',
    bottom: 80,
  },
  text: {
    fontSize: 16,
  },
  style: {
    backgroundColor: 'white',
    height: 160,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
