<template>
	<view class="navbar">
		<view class="navbar-fixed">
			<view :style="{height: statusBarHeight+'px'}"></view>
			<view class="navbar-content" :class="{search: isSearchPage}" :style="{height: navbarHeight+'px', width: windowWidth+'px'}" @click.stop="open">
				<view v-if="isSearchPage" class="navbar-content__search-icons" @click="back">
					<uni-icons type="back" size="22" color="#fff"></uni-icons>
				</view>
				<view v-if="!isSearchPage" class="navbar-search">
					<view class="navbar-search_icon">
						<text class="iconfont icon-search"></text>
					</view>
					<view class="navbar-search_text">Vue、uni-app</view>
				</view>
				<view v-else class="navbar-search">
					<view class="navbar-search_icon">
						<text class="iconfont icon-search"></text>
					</view>
					<input 
					class="navbar-search_text" 
					value="" 
					placeholder="请输入您要搜索的内容" 
					v-model="val"
					@input="inputChange"
					>
				</view>
			</view>
		</view>
		<view :style="{height: statusBarHeight + navbarHeight + 'px'}"></view>
	</view>
</template>

<script>
	export default{
		props:{
			value:{
				type:[String, Number],
				default:''
			},
			isSearchPage:{
				type: Boolean,
				default: false
			}
		},
		data(){
			return {
				statusBarHeight: 20,
				navbarHeight: 45,
				windowWidth: 375,
				val:''
			}
		},
		watch:{
			value(newVal){
				this.val = newVal
			}
		},
		created(){
			// 获取手机系统信息
			const sys_info = uni.getSystemInfoSync()
			this.statusBarHeight = sys_info.statusBarHeight
			
			this.windowWidth = sys_info.windowWidth
			
			// #ifndef H5 || APP-PLUS || MP-ALIPAY
			// 获取导航按钮信息
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			
			this.navbarHeight = menuButtonInfo.bottom - sys_info.statusBarHeight + menuButtonInfo.top - sys_info.statusBarHeight
			this.windowWidth = menuButtonInfo.left
			
			// #endif
		},
		methods:{
			open(){
				if(this.isSearchPage) return
				uni.navigateTo({
					url:"/pages/home-search/home-search"
				})
			},
			inputChange(e){
				const {value} = e.detail
				this.$emit('input',value)
			},
			back(){
				// uni.navigateBack({})
				uni.switchTab({
					url: "/pages/tabbar/index/index"
				})
			}
		}
	}
</script>

<style lang="scss">
@import "@/common/css/icons.css";
.navbar {
	.navbar-fixed{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		background-color: $mk-base-color;
		.navbar-content{
			box-sizing: border-box;
			display: flex;
			height: 45px;
			justify-content: center;
			align-items: center;
			padding: 0 15px;
			.navbar-search{
				display: flex;
				align-items: center;
				height: 30px;
				width: 100%;
				border-radius: 30px;
				background-color: #fff;
				padding: 0 10px;
				.navbar-search_icon{
					margin-right: 10px;
					text{
						color: #999;
					}
				}
				.navbar-search_text{
					width: 100%;
					font-size: 14px;
					color: #999;
				}
			}
			&.search{
				padding-left: 0;
				.navbar-content__search-icons{
					margin:0 10px;
					
				}
				.navbar-search{
					border-radius: 5px;
				}
			}
			
		}
		
	}
	
}
</style>