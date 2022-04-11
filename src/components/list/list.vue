<template>
	<swiper class="home-swiper" :current="activeIndex" @change="change">
		<swiper-item  v-for="(item, index) in tab" :key="index" class="swiper-item">
			<list-item :list="listCatchData[index]" @loadMore="loadMore" :load="load[index]"></list-item>
		</swiper-item>
	</swiper>

</template>

<script>
	import listItem from './list-item.vue'
	export default {
		props:{
			tab:{
				type: Array,
				default(){
					return []
				}
			},
			activeIndex:{
				type: Number,
				default: 0
			}
		},
		components:{
			listItem
		},
		data() {
			return {
				list:[],
				listCatchData: {},
				load:{},
				pageSize: 7
			}
		},watch:{
			tab(newVal){
				if(newVal.length === 0) return
				this.listCatchData = {}
				this.load = {}
				this.getList(this.activeIndex)
			}

		},
		created(){
			
			uni.$on('update_main_page_status',(pageType)=>{
				if(pageType !== 'follow') return
				this.listCatchData = {}
				this.load = {}
				this.getList(this.activeIndex)
			})
		},
		methods:{
			loadMore(){
				if(this.load[this.activeIndex].loading==='noMore'){
					return
				}
				this.load[this.activeIndex].page++
				this.getList(this.activeIndex)
			},
			change(e){
				const {current} = e.detail
				this.$emit('change', current)
				//当数据不存在或长度是零的时候去请求数据
				if(!this.listCatchData[current] || this.listCatchData[current].length === 0){
					this.getList(current)
				}
			},
			getList(current){
				if(!this.load[current]){
					this.load[current]={
						page:1,
						loading:'loading'
					}
				}
				this.$request({
					url: '/getArticles',
					method: 'POST',
					data:{
						name: this.tab[current].name,
						page: this.load[current].page,
						pageSize: this.pageSize
					
					}
				}).then(res=>{

					const {data} = res.data;
					if(data.length ===0){
						let oldLoad = {}
						oldLoad.loading='noMore'
						oldLoad.page = this.load[current].page
						this.$set(this.load, current, oldLoad)
					}
					
					let oldList = this.listCatchData[current] || []
					oldList.push(...data)
					// 懒加载
					this.$set(this.listCatchData, current, oldList)
				})
			}
		}
	}
</script>

<style lang="scss">
.home-swiper{
	height: 100%;
	.swiper-item{
		height: 100%;
		overflow: hidden;
	}
}
</style>
