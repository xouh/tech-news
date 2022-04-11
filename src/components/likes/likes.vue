<template>
	<view class="icons" @click.stop="likeTap">
		<uni-icons size="20" color="#f07373" :type="like?'heart-filled':'heart'"></uni-icons>
	</view>
</template>

<script>
	export default {
		props:{
			item:{
				type: Object,
				default(){
					return {
						
					}
				}
			},
			// types是收藏页面传过来的，先传到list-card，在从父节点传到likes，用于判断页面
			types:{
				type: String,
				default: ''
			}
		},
		data() {
			return {
				like:false
			};
		},
		watch:{
			item(newVal){
				this.like = this.item.is_like
			}
		},
		created(){
			this.like = this.item.is_like
		},
		methods:{
			likeTap(e){				
				this.like = !this.like
				this.setUploadLikes()
			},
			setUploadLikes(){
				uni.showLoading()
				this.$api.upload_like({
					article_id:this.item._id
				}).then(res=>{
					uni.hideLoading()
					uni.showToast({
						title: this.like?'收藏成功':'取消收藏',
						icon: 'none'
					})
					uni.$emit('update_main_page_status', this.types)
					console.log(res)
				}).catch(()=>{
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss">
	.icons{
		display: flex;
		position: absolute;
		top: 0;
		right: 0;
		justify-content: center;
		align-items: center;
		width: 20px;
		height: 20px;
	}
</style>
