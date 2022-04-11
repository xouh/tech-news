import request from '@/utils/request'

export const getArticles = data=>{
	return request('/getArticles',data)
}