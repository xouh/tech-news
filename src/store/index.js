// Vuex
import Vue from 'vue'
import  Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
	//数据源
	state:{
		user_id: uni.getStorageSync("USERID") || '624b1411f9ddc06fb37d0a8b',
		userinfo:uni.getStorageSync("USERINFO")||{},
		historyList: uni.getStorageSync("__history") || []
	},
	mutations:{
		SET_USER_INFO(state, userinfo){
			state.userinfo = userinfo
		},
		SET_HISTORY_LIST(state, history){
			state.historyList = history
		},
		CLEAR_HISTORY(state){
			state.historyList = []
		},
		SET_USER_ID(state, user_id){
			state.user_id = user_id
		}
	},
	actions:{
		set_user_id({commit}, user_id){
			uni.setStorageSync('USERID',user_id)
			commit('SET_USER_ID', user_id)
		},
		set_userinfo({commit}, userinfo){
			uni.setStorageSync('USERINFO',userinfo)
			commit('SET_USER_INFO', userinfo)
		},
		set_history({commit, state}, history){
			let list = state.historyList
			list.unshift(history)
			uni.setStorageSync("__history", list)
			commit('SET_HISTORY_LIST', list)
		},
		clear_history({commit}){
			// uni.setStorageSync('__history', [])
			uni.removeStorageSync('__history')
			commit('CLEAR_HISTORY')
		}
	}
})

export default store