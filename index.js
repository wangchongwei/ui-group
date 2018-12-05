import * as Basic from './src/basic';
import * as DatePicker from './src/date';
import * as List from './src/list';
import * as Loading from './src/loading';


const plugin = {
    ...Basic,
    ...DatePicker,
    ...List,
    ...Loading,
}

export default plugin;

