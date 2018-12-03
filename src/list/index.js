import React from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';

type Props = {}

type State = {}

export default class MyClass extends React.PureComponent<Props, State>{

    data: Array<any>
    state = {}

    componentDidMount() {
        this._initParams();
    }

    data = []

    _initParams = () => {
        for(let i = 0; i < 30; i ++) {
            this.data.push({ id: i });
        }
    }

    _onScroll =(event) => {
        console.log(event);
    }

    render(){
        return(
            <View style={styles.container}>
                <Animated.ScrollView
                    scrollEventThrottle={1}
                    onScroll={this._onScroll}
                >
                    {
                        this.data.map((item, index) => (
                            <View style={{ height: 40, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                <Text>这是第{index}条记录</Text>
                            </View>
                        ))
                    }
                </Animated.ScrollView>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
});

