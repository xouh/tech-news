<template>
	<view>
		<view class="my-header">
			<view class="my-header__backgroud">
				<image :src="userinfo.avatar" mode="aspectFill"></image>
			</view>
			<view class="my-header__logo">
				<view class="my-header__logo-box">
					<image :src="userinfo.avatar" mode="aspectFill"></image>
				</view>
				<text class="my-header__name">{{userinfo.author_name}}</text>
			</view>
			<view class="my-header__info">
				<view class="my-header__info-box">
					<text class="my-header__info-title">被关注</text>
					<text>{{userinfo.follow_count}}</text>
				</view>
				<view class="my-header__info-box">
					<text class="my-header__info-title">粉丝</text>
					<text>{{userinfo.fans_count}}</text>
				</view>
				<view class="my-header__info-box">
					<text class="my-header__info-title">积分</text>
					<text>{{userinfo.integral_count || 0}}</text>
				</view>
			</view>
		</view>
		<view class="my-content">
			<view class="my-content__list" @click="open">
				<view class="my-content__list-title">
					<uni-icons class="icons" type="contact" size="16" color="#666"></uni-icons>
					<text>我的文章</text>
				</view>
				<uni-icons type="arrowright" size="14" color="#666"></uni-icons>
			</view>
			<view class="my-content__list" @click="feedback">
				<view class="my-content__list-title">
					<uni-icons class="icons" type="help" size="16" color="#666"></uni-icons>
					<text>意见反馈</text>
				</view>
				<uni-icons type="arrowright" size="14" color="#666"></uni-icons>
			</view>
			<view class="my-content__list" style="align-items: center;">
				<view class="my-content__list-picker">
					<text>切换用户</text>
					<picker @change="bindPickerChange" :value="index" :range="picker_array" range-key="author_name">
							<view class="uni-input">{{picker_array[index].author_name}}</view>
					</picker>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				picker_array: [{
					user_id: "624b1411f9ddc06fb37d0a8a",
					author_name: "7七月"
				}, {
					user_id: "624b1411f9ddc06fb37d0a8c",
					author_name: "双越"
				},{
					user_id: "624b1411f9ddc06fb37d0a8b",
					author_name: "快乐动起来呀"
				},{
					user_id: "624b1411f9ddc06fb37d0a8d",
					author_name: "liuyubobobo"
				}],
				title: 'picker',
				index: 0
			}
		},
		methods: {
			open(){
				uni.navigateTo({
					url:"../../my-article/my-article"
				})
			},
			feedback(){
				uni.navigateTo({
					url:"../../feedback/feedback"
				})
			},
			bindPickerChange(e) {
				this.index = e.detail.value
				const user_id = this.picker_array[this.index].user_id
				this.$request({url:"/getUser", method: 'POST',data:{
					user_id
				}}).then(res=>{
					const {data} = res.data
					this.$store.dispatch('set_userinfo', data)
					this.$store.dispatch('set_user_id', user_id)
				})
			}
			
		},
		computed:{
			...mapState(['userinfo', 'user_id'])
		},
		onLoad() {
			this.index = this.picker_array.findIndex((item)=>{
				return item.user_id === this.user_id
			})
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f5f5f5;
		.my-header{
			position: relative;
			padding-bottom: 15px;
			.my-header__backgroud{
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				filter: blur(8px);
				opacity: 0.3;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.my-header__logo{
				display: flex;
				flex-direction: column;
				align-items: center;
				padding-top: 30px;
				.my-header__logo-box{
					width: 60px;
					height: 60px;
					border-radius: 50%;
					overflow: hidden;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.my-header__name{
					margin-top: 15px;
					font-size: 16px;
					font-weight: bold;
				}
			}
			.my-header__info{
				margin-top: 15px;
				display: flex;
				.my-header__info-box{
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 100%;
					font-size: 12px;
					color: #999;
					.my-header__info-title{
						font-size: 14px;
						color: #333;
					}
				}
			}
		}
		.my-content{
			.my-content__list{
				display: flex;
				justify-content: space-between;
				padding: 15px;
				margin-bottom: 10px;
				background-color: #fff;
				color: #333;
				font-size: 14px;
				.my-content__list-title{
					display: flex;
					align-items: center;
					.icons{
						margin-right: 5px;
					}
				}
				.my-content__list-picker{
					width: 100%;
					display: flex;
					align-items: center;
					text{
						margin-right: 10px;
					}
				}
			}
		}
	}
</style>
