<template>
	<view class="follow">
		<view class="follow-tab">
			<view class="follow-tab-box">
				<view class="follow-tab__item" :class="{active: activeIndex===0}" @click="tab(0)">文章</view>
				<view class="follow-tab__item" :class="{active: activeIndex===1}" @click="tab(1)">作者</view>
			</view>
		</view>
		<view class="follow-list">
			<swiper class="follow-list__swiper" :current="activeIndex" @change="change">
				<swiper-item>
					<list-scroll>
						<uni-load-more v-if="list.length===0 && !articleShow" iconType="snow" status="loading"></uni-load-more>
						<list-card v-for="item in list" :key="item._id" :item="item" types="follow"></list-card>
						<view class="no-data" v-if="articleShow">没有数据</view>
					</list-scroll>
				</swiper-item>

				<swiper-item>
					<list-scroll>
						<list-author v-for="item in authorLists" :item="item" :key="item.id"></list-author>
						<view class="no-data" v-if="articleShow">没有数据</view>
					</list-scroll>
				</swiper-item>

			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeIndex: 0,
				list: [],
				articleShow: false,
				authorShow: false,
				authorLists:[]
			}
		},
		onLoad() {
			this.getFollow()
			this.getAuthor()
			uni.$on('update_main_page_status',(types)=>{
				this.getFollow()
			})
			uni.$on('update_follow_page',()=>{
				this.getAuthor()
			})
			
		},
		methods: {
			tab(index){
				this.activeIndex = index
			},
			getFollow(){
				this.$request({
					url: '/getFollows',
					method: 'POST',
					data:{}
				}).then(res=>{
					
					const {data} = res.data
					this.list = data
					this.articleShow = this.list.length === 0
				})
			},
			change(e){
				
				const {current} = e.detail
				this.activeIndex = current
			},
			getAuthor(){
				this.$request({
					url: '/getAuthors',
					method: 'POST',
					data:{}
				}).then(res=>{
					const {data} = res.data
					this.authorLists = data
					this.authorShow = this.authorLists.length === 0
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
	}
	.follow{
		height: 100%;
		display: flex;
		flex-direction: column;
		flex: 1; // 撑开页面
		box-sizing: border-box;
		.follow-tab{
			height: 30px;
			padding: 10px 20px;
			border-bottom: 1px #f5f5f5 solid;
			.follow-tab-box{
				display: flex;
				width: 100%;
				height: 100%;
				border-radius: 5px;
				.follow-tab__item{
					width: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					color:#666;
					font-size: 14px;
					&:first-child{
						border-right: 1px solid $mk-base-color;
					}
					&.active{
						color: $mk-base-color
					}
				}
			}
		}
	}
	.follow-list {
	      flex: 1;
	      .follow-list__swiper {
	        height: 100%;
	        .swiper-item {
	          height: 100%;
	          overflow: hidden;
	          .list-scroll {
	            height: 100%;
	          }
	        }
	      }
	    }
	.no-data{
		padding: 50px;
		font-size: 14px;
		color: #999;
		text-align: center;
	}
</style>
