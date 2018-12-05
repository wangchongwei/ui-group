/**
 * 对textInput的一层封装，因为在rn0.55.4及以后的版本，出现ios手机无法输入中文的情况
 */
import React from 'react';
import { TextInput, Platform } from 'react-native';

type Props = {}


export default class Input extends React.Component<Props>{


    shouldComponentUpdate(nextProps){
        return Platform.OS !== 'ios' || (this.props.value === nextProps.value &&
            (nextProps.defaultValue == undefined || nextProps.defaultValue == '' )) ||
            (this.props.defaultValue === nextProps.defaultValue &&
                (nextProps.value == undefined || nextProps.value == '' ));
    }

    blur =() => {
        this.refs.input && this.refs.input.blur();
    }

    render(){
        return (
            <TextInput
                ref='input'
                allowFontScaling={false}
                {...this.props}
            />
        )
    }

}
