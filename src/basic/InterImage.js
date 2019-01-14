/**
 * 网络图片加载， 支持点击放大
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {}


export default class InterImage extends React.PureComponent<Props>{

    state = {}

    render(){
        return(
            <View style={styles.container}>
                
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
});

