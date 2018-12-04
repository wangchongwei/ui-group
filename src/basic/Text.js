/**
 * Text 组件 封装一层，避免在手机中文本内容大小随手机设置字体变化
 */
import React from 'react';

type Props = {}

export default class CommonText extends React.PureComponent<Props>{

    render(){
        const props = this.props;
        return(
            <Text allowFontScaling={false} {...props}>{props.children}</Text>
        )
    }

}

