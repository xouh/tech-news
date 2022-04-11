<template>
	<view class="label">
		
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">我的标签</view>
				<view class="label-edit"@click="editLabel">{{is_edit?'完成':'编辑'}}</view>
			</view>
			<uni-load-more v-if="loading" status="loading" iconType="snow"></uni-load-more>
			<view v-if="!loading" class="label-content">
				<view class="label-content__item" v-for="(item, index) in label_list" :key='item._id'>
					{{item.name}}
					<uni-icons 
					v-if="is_edit" 
					class="icon-close" 
					type="clear" 
					size="20" 
					color="red"
					@click="del(index)"
					></uni-icons>
				</view>
				<view v-if="label_list.length === 0" class="no-data">
					当前没有数据
				</view>
			</view>
		</view>
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">标签推荐</view>
			</view>
			<uni-load-more v-if="loading" status="loading" iconType="snow"></uni-load-more>
			<view v-if="!loading" class="label-content">
				<view 
					class="label-content__item" 
					v-for="(item, index) in list" 
					:key="item._id"
					@click="add(index)">
					{{item.name}}
				</view>
				<view v-if="list.length === 0" class="no-data">
					当前没有数据
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: true,
				is_edit:false,
				label_list: [],
				list:[]
				
			}
		},
		onLoad(){
			// this.loading= true
			this.getLabel()
		},
		methods: {
			editLabel(){
				
				if(this.is_edit){
					this.is_edit = false
					this.setUpdateLabel(this.label_list)
				}else{
					this.is_edit = true
				}
				
			},
			getLabel(){
				this.loading=true
				this.$request({
					url: '/getLabels',
					method: 'POST',
					data:{
						type:'all'
					}
				}).then(res=>{
					
					const {data} = res.data
					this.label_list = data.filter(item=>item.current)
					this.list = data.filter(item=>!item.current)
					this.loading=false
					
					console.log("label---",data)
				})
				
			},
			del(index){
				this.list.push(this.label_list[index])
				this.label_list.splice(index, 1)
			},
			add(index){
				if(!this.is_edit) return
				this.label_list.push(this.list[index])
				this.list.splice(index, 1)
			},
			setUpdateLabel(label){
				console.log(label)
				let newArrIds = []
				label.forEach(item=>{
					newArrIds.push(item._id)
				})
				uni.showLoading()
				this.$request({
					url:"updateLabel",
					method: "POST",
					data: {
						labels: newArrIds
					}
				}).then((res)=>{
					uni.hideLoading()
					uni.showToast({
						title:'更新成功',
						icon: 'none'
					})
					uni.$emit('say')
					uni.$emit('labelChange')
					console.log(res)
				})
			},
			emit(){
				// 自定义事件只能在打开的页面触发，有点类似于组件事件传递
				uni.$emit('labelChange','uni-app')
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f5f5f5;
	}
	.label{
		.label-box{
			background-color: #fff;
			margin-bottom: 10px;
			.label-header{
				display: flex;
				// 子元素左右对齐
				justify-content: space-between;
				padding: 10px;
				font-size: 14px;
				color: #666;
				border-bottom: 1px #f5f5f5 solid;
				.label-edit{
					color: #30b33a;
					font-weight: bold;
				}
			}
			.label-content{
				display: flex;
				// 子元素超出一行换行
				flex-wrap: wrap;
				padding: 15px;
				padding-top: 0;
				.label-content__item{
					position: relative;
					padding: 2px 5px;
					margin-top: 12px;
					margin-right: 10px;
					border-radius: 5px;
					border: 1px solid #666;
					color: #666;
					.icon-close{
						position: absolute;
						right: -8px;
						top: -8px;
						background-color: #fff;
						border-radius: 50%;
					}
				}
			}
		}
	}
	.no-data{
		width: 100%;
		text-align: center;
		padding: 50px 0;
		color: #999;
		font-size: 14px;
		}
</style>