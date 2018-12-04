/**
 * 瀑布流list组件
 */
import React from 'react';
import { View, StyleSheet, VirtualizedList, ScrollView, RefreshControl, findNodeHandle } from 'react-native';

type Column = {
    index: number,
    totalHeight: number, // 总高度
    data: Array<any>, // 数据源
    heights: Array<number>, // 高度
};

type Props = {
    data: Array<any>, // 数据源
    numColumns: number, // 列数
    renderItem: ({ item: any, index: number, column: number }) => ?React.Element< any, >, // 子条目的渲染
    getHeightForItem: ({ item: any, index: number }) => number, // 获取每个子条目高度
    ListHeaderComponent?: ?React.ComponentType<any>, // list头部组件
    ListEmptyComponent?: ?React.ComponentType<any>, // list无数据时显示的组件
    keyExtractor?: (item: any, index: number) => string, // 获取条目key
    onEndReached?: ?(info: { distanceFromEnd: number }) => void, // 当列表触底执行的方法
    contentContainerStyle?: any, //
    onScroll?: (event: Object) => void, // 当列表在滚动时 触发的函数
    onScrollBeginDrag?: (event: Object) => void, // 当滚动开始
    onScrollEndDrag?: (event: Object) => void, // 
    onMomentumScrollEnd?: (event: Object) => void,
    onEndReachedThreshold?: ?number,
    scrollEventThrottle: number,
    renderScrollComponent: (props: Object) => React.Element<any>, 
}

type State = {
    columns: Array<Column>,
}

const _stateFromProps = ({ numColumns, data, getHeightForItem }) => {
    console.log('data', data);
    const columns: Array<Column> = Array.from(
        { length: numColumns, })
        .map((col, i) => ({
            index: i, totalHeight: 0, data: [], heights: [], }));
    
    data.forEach((item, index) => {
        const height = getHeightForItem({ item, index });
        const column = columns.reduce( (prev, cur) => (cur.totalHeight < prev.totalHeight ? cur : prev), columns[0], );
        column.data.push(item);
        column.heights.push(height);
        column.totalHeight += height; });
        return { columns };
};

class FakeScrollView extends React.Component<{ style?: any, children?: any }> {
    render() {
        return (
            <View style={this.props.style}>{this.props.children}</View>
        );
    }
}


export default class MasonryList extends React.Component<Props, State>{

    static defaultProps = {
        scrollEventThrottle: 50,
        numColumns: 1,
        renderScrollComponent: (props: Props) => {
            if (props.onRefresh && props.refreshing != null) {
                return (
                    <ScrollView
                        {...props}
                        refreshControl={
                            <RefreshControl
                                refreshing={props.refreshing}
                                onRefresh={props.onRefresh}
                            />
                        }
                    />
                );
            }
            return <ScrollView {...props} />
        }, 
    };

    state = _stateFromProps(this.props);
    _listRefs: Array<?VirtualizedList> = [];
    _scrollRef: ?ScrollView;
    _endsReached = 0;

    componentWillReceiveProps(newProps: Props) {
        this.setState(_stateFromProps(newProps));
    }

    getScrollResponder() {
        if (this._scrollRef && this._scrollRef.getScrollResponder) {
            return this._scrollRef.getScrollResponder(); 
        }
        return null;
    }

    getScrollableNode() {
        if (this._scrollRef && this._scrollRef.getScrollableNode) {
            return this._scrollRef.getScrollableNode();
        }
        return findNodeHandle(this._scrollRef);
    }

    scrollToOffset({ offset, animated }: any) {
        if (this._scrollRef) {
          this._scrollRef.scrollTo({ y: offset, animated });
        }
    }

    _onLayout = event => {
        this._listRefs.forEach(
          list => list && list._onLayout && list._onLayout(event),
        );
    };

    _onContentSizeChange = (width, height) => {
        this._listRefs.forEach( list =>
            list && list._onContentSizeChange && list._onContentSizeChange(width, height),
        );
    };

    _onScroll = event => {
        if (this.props.onScroll) {
            this.props.onScroll(event);
        }
        this._listRefs.forEach( list =>
            list && list._onScroll && list._onScroll(event),
        );
    };

    _onScrollBeginDrag = event => {
        if (this.props.onScrollBeginDrag) {
            this.props.onScrollBeginDrag(event);
        }
        this._listRefs.forEach(list =>
            list && list._onScrollBeginDrag && list._onScrollBeginDrag(event),
        );
    };

    _onScrollEndDrag = event => {
        if (this.props.onScrollEndDrag) {
            this.props.onScrollEndDrag(event);
        }
        this._listRefs.forEach( list =>
            list && list._onScrollEndDrag && list._onScrollEndDrag(event),
        );
    };

    _onMomentumScrollEnd = event => {
        if (this.props.onMomentumScrollEnd) {
            this.props.onMomentumScrollEnd(event);
        }
        this._listRefs.forEach( list =>
            list && list._onMomentumScrollEnd && list._onMomentumScrollEnd(event),
        );
    };

    _getItemLayout = (columnIndex, rowIndex) => {
        const column = this.state.columns[columnIndex];
        let offset = 0;
        for (let ii = 0; ii < rowIndex; ii += 1) {
            offset += column.heights[ii];
        }
        return { length: column.heights[rowIndex], offset, index: rowIndex };
    };

    _renderScrollComponent = () => <FakeScrollView style={styles.column} />;

    _getItemCount = data => data.length;

    _getItem = (data, index) => data[index];

    _captureScrollRef = ref => (this._scrollRef = ref);


    render(){
        const { renderItem, ListHeaderComponent, ListEmptyComponent, keyExtractor, onEndReached, ...props } = this.props;
        let headerElement = null;
        if (ListHeaderComponent) {
            headerElement = <ListHeaderComponent />;
        }
        let emptyElement;
        if (ListEmptyComponent) {
            emptyElement = <ListEmptyComponent />;
        }
        const content = (
            <View style={styles.contentContainer}>
                {this.state.columns.map(col =>
                    <VirtualizedList
                        {...props}
                        ref={ref => (this._listRefs[col.index] = ref)}
                        key={`$col_${col.index}`}
                        data={col.data}
                        getItemCount={this._getItemCount}
                        getItem={this._getItem}
                        getItemLayout={(data, index) => this._getItemLayout(col.index, index)}
                        renderItem={({ item, index }) => renderItem({ item, index, column: col.index })}
                        renderScrollComponent={this._renderScrollComponent}
                        keyExtractor={keyExtractor}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={this.props.onEndReachedThreshold}
                        removeClippedSubviews={false}
                    />,
                )}
            </View>
        );

        const scrollComponent = React.cloneElement(
            this.props.renderScrollComponent(this.props),
            {
                ref: this._captureScrollRef,
                removeClippedSubviews: false,
                onContentSizeChange: this._onContentSizeChange,
                onLayout: this._onLayout,
                onScroll: this._onScroll,
                onScrollBeginDrag: this._onScrollBeginDrag,
                onScrollEndDrag: this._onScrollEndDrag,
                onMomentumScrollEnd: this._onMomentumScrollEnd,
            },
            headerElement,
            emptyElement && this.props.data.length === 0 ? emptyElement : content,
        );
        
        return scrollComponent;
    }
}

const styles = StyleSheet.create({
    contentContainer: {
        flexDirection: 'row',
    },
    column: {
        flex: 1,
    },
});

