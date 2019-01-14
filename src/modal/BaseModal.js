/**
 * 对modal的一层简单封装
 */
import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';

type Props = {
    backClose: boolean; // 点击back时是否关闭modal
    onClose: Function; // 关闭modal时执行回调
    containerStyle: any; // modal内层view样式
}

type State = {
    show: boolean; // 是否展示modal
}

export default class MyClass extends React.PureComponent<Props, State>{

    static defaultProps = {
        backClose: true,
    }

    state = {
        show: false,
    }

    /** 关闭modal */
    closeModal =() => {
        this.setState({ show: false });
        const { onClose } = this.props;
        onClose && onClose();
    }

    /** 打开modal */
    openModal =() => {
        this.setState({ show: true });
    }

    /** android 点击物理back时 */
    _onRequestClose =() => {
        const { backClose } = this.props;
        if(backClose) {
            this.closeModal();
        }
    }

    render(){
        const { show } = this.state;
        const { containerStyle, children, ...other } = this.props;
        return(
            <Modal
                {...other}
                transparent
                animationType={'fade'}
                style={{ flex: 1 }}
                onRequestClose={this._onRequestClose}
                visible={show}
            >
                <View style={[styles.container, containerStyle]}>
                    {children}
                </View>
            </Modal>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#00000033',
        flex: 1,
    },
});

