<template>
	<view>
		<uni-load-more v-if="!list.length" status="loading"></uni-load-more>
		<list-card v-for="item in list" :item="item" :key="item.id"></list-card>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[]
			}
		},
		methods: {
			getMyArticle(){
				this.$request({
					url: '/getMyArticles',
					method: 'POST',
					data:{}
				}).then(res=>{
					const {data} = res.data
					this.list = data
				})
			}
		},
		onLoad(){
			this.getMyArticle()
		}
	}
</script>

<style>

</style>
