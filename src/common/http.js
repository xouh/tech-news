import store from '../store/index.js';

export default function $http(options){
	return new Promise((reslove,reject) =>{
		const {url, data} = options

		const dataObj = {
			user_id: store.state.userinfo._id,
			...data
		}
		uniCloud.callFunction({
			name: url,
			data: dataObj
		}).then((res) =>{
			if (res.result.code === 200){
				reslove(res.result)
			}else{
				reject(res.result)
			}
		}).catch((err)=>{
			reject(err)
		})
	})
}