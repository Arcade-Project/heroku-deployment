import {store} from '../../index';

export default function getStore() {
    store.subscribe(getStore);
    var reduxStore = store.getState();
    try{
        this.data.set('store', reduxStore);
    }catch(err){
        console.log(err);
    }

}
