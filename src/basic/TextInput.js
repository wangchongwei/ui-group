/**
 * 对textInput的一层封装，因为在rn0.55.4及以后的版本，出现ios手机无法输入中文的情况
 */
import React from 'react';
import { TextInput, Platform } from 'react-native';

type Props = {
    componentKey: string; // 组件的key值
    onChangeText: Function; // 文本改变时
}


type State = {
    text: string; // 输入的文本
}

export default class Input extends React.Component<Props>{

    blur =() => {
        this.refs.input && this.refs.input.blur();
    }

    _onChangeText =(text: string) => {
        const { componentKey, onChangeText } = this.props;
        this.state.text = text;
        onChangeText && onChangeText(text, componentKey);
    }

    render(){
        return (
            <TextInput
                {...this.props}
                ref='input'
                allowFontScaling={false}
                defaultValue={this.state.text}
                onChangeText={this._onChangeText}
                onSubmitEditing={() => { this.input.blur() }}
            />
        )
    }

}
