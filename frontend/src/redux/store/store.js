import { createStore } from 'redux'; //функция которая дает возможность создать глобальный объект сторе
import rootReducer from '../reducers/rootReducer';

const DevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(); //в консоле сможем следить за изменениями стейта, инструмент только для нас для разработчиковю Инсрумент дает много возможностей (например сохранить историю кликов, которые привели к багу, или тестировщик так может сделать)

const store = createStore(rootReducer, DevTools);

export default store;
