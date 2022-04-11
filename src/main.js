import Vue from 'vue'
import App from './App'
import api from './common/api'
import store from './store'
import axios from 'axios'

Vue.config.productionTip = false

const instance = axios.create({
  baseURL: 'http://localhost/api'
});

instance.interceptors.request.use(config=>{
	// 所有请求默认带上user_id
	if( !config.data?.user_id){
		config.data.user_id = store.state.userinfo._id
	}
	
	return config
})

Vue.prototype.$request = instance


App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
