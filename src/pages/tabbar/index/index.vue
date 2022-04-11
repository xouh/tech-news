<template>
	<view class="home">
		<navbar></navbar>
		<tab :tabList="tabList" :tabIndex="tabIndex" @tab="tab" v-if="update"></tab>
		<view class="list-container">
			<list :tab="tabList" :activeIndex="activeIndex" @change="change" />
		</view>	
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				title: 'Hello',
				tabList: [],
				tabIndex: 0,
				activeIndex: 0,
				update: true
			}
		},
		computed:{
			...mapState(['userinfo'])
		},
		onLoad() {
			uni.$on('labelChange',()=>{
				this.tabList = []
				this.tabIndex = 0
				this.activeIndex = 0
				this.getLabel()

			})

			this.getLabel()
			
		},
		methods:{
			change(current){
				this.tabIndex = current
				this.activeIndex = current
			},
			getLabel(){
				console.log("getLabel")
				this.$request({
					url: '/getLabels',
					method: 'POST',
					data:{}
				}).then((res) => {
					this.update = false
					const {data} = res.data

					this.tabList = data

					data.unshift({
						name: "全部",
					})

					this.update = true
				})
			},
			tab(data){
				this.activeIndex = data.index
			}
		},
	}
</script>

<style lang="scss">
page{
	display: flex;
	height: 100%;
	.home{
		display: flex;
		flex-direction: column; // 竖向排列
		flex: 1;
		overflow: hidden;
		.list-container{
			flex: 1;
			box-sizing: border-box;
		}
	}
}
</style>
