<template>
	<view class="detail">
		<view class="detail-title">{{formData.title}}</view>
		<view class="detail-header">
			<view class="detail-header__logo">
				<image :src="formData.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="detail-header__content">
				<view class="detail-header__content-title">
					{{formData.author.author_name}}
				</view>
				<view class="detail-header__content-info">
					<text>{{formData.create_time}}</text>
					<text>{{formData.browse_count}} 浏览</text>
					<text>{{formData.thumbs_up_count}} 赞</text>
				</view>
			</view>
			<button class="detail-header__button" type="default" @click="follow(formData.author.id)">{{formData.is_author_like?"取消关注":"关注"}}</button>
		</view>
		<view class="detail-content">
			<view class="detail-html">
				<u-parse  :content="formData.content" :noData="noData"></u-parse>
				<view class="detail-comment">
					<view class="comment-title">最新评论</view>
					<view v-if="!commentsList.length" class="no-data">没有评论</view>
					<view class="comment-content" v-for="item in commentsList" :key="item.comment_id">
						<comments-box :comments="item" @reply="reply"></comments-box>
					</view>
				</view>
			</view>
			
		</view>
		<view class="detail-bottom">
			<view class="detail-bottom__input" @click="openComment">
				<text>谈谈你的看法</text>
				<uni-icons type="compose" size="16" color="#f07373"></uni-icons>
			</view>
			<view class="detail-bottom__icons">
				<view class="detail-bottom__icons-box">
					<uni-icons type="chat" size="22" color="#f07373" @click="open()"></uni-icons>
				</view>
				<view class="detail-bottom__icons-box" @click="likeTap(formData._id)">
					<uni-icons :type="formData.is_like?'heart-filled':'heart'" size="22" color="#f07373"></uni-icons>
				</view>
				<view class="detail-bottom__icons-box" @click="thumbsup(formData._id)">
					<uni-icons :type="formData.is_thumbs_up?'hand-thumbsup-filled':'hand-thumbsup'" size="22" color="#f07373"></uni-icons>
				</view>
			</view>
		</view>
		<!-- ref属性在uniapp中只能在自定义组件中使用，在view这些原生微信小程序节点中不能使用 -->
		<uni-popup ref="popup" type="bottom" :maskClick="false">
			<view class="popup-wrap">
				<view class="popup-header">
					<text class="popup-header__item" @click="closeComment">取消</text>
					<text class="popup-header__item" @click="submitComment">发布</text>
				</view>
				<view class="popup-content">
					<textarea class="popup-textarea" v-model="commentValue" maxlength="200" fixed placeholder="请输入评论内容" />
					<view class="popup-count">{{commentValue.length}}/200</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uParse from '@/components/gaoyia-parse/parse.vue'
	export default {
		components:{
			uParse
		},
		data() {
			return {
				formData: {},
				noData: '<p style="text-align:center;color: #666">详情加载中...</p>',
				// 评论详情
				commentValue:'',
				commentsList: [],
				replyFormData: {}
			}
		},
		onLoad(query){
			// 通过url 参数传值
			this.formData = JSON.parse(query.params)
			this.getDetail()
			this.getComments()
			
		},
		onReady(){
			
		},
		methods: {
			// 点赞文章
			thumbsup(article_id){
				this.setUpdateThumbs(article_id)
			},
			// 收藏文章
			likeTap(article_id){
				this.setUpdateLike(article_id)
			},
			// 关注作者
			follow(author){
				this.setUpdateAuthor(author)
			},
			getDetail(){
				this.$request({
					url: '/getDetail',
					method: 'POST',
					data: {
						article_id: this.formData._id
					}
				}).then((res)=>{
					const {data} = res.data
					this.formData = data

				})
			},
			// 打开评论窗口
			openComment(){
				this.$refs.popup.open()
			},
			// 关闭评论窗口
			closeComment(){
				this.$refs.popup.close()
			},
			submitComment(){

				if(!this.commentValue){
					uni.showToast({
						title: '请先输入评论内容后再提交',
						icon: 'none'
					});
					return
				}
				this.setUpdateComment({content: this.commentValue, ...this.replyFormData})
				
			},
			reply(e){

				this.replyFormData = {
					"comment_id": e.comments.comment_id,
					"is_reply": e.is_reply
				}
				if(e.comments.reply_id){
					this.replyFormData.reply_id = e.comments.reply_id
				}

				this.openComment()
				
			},
			setUpdateComment(content){
				const formData = {
					article_id: this.formData._id,
					...content
					
				}

				uni.showLoading()
				this.$request({
					url: '/updateComment',
					method: 'POST',
					data: formData
				}).then((res)=>{
					uni.hideLoading()
					uni.showToast({
						title: '评论成功'
					});
					this.getComments()
					this.closeComment()
					this.replyFormData = {}
					this.commentValue = ''
				})
			},
			getComments(){
				this.$request({
					url: 'getComments',
					method: 'POST',
					data:{
						article_id: this.formData._id,
						pageSize: 100
					}
				}).then(res=>{
					console.log(res)
					this.commentsList = res.data.data
				})
			},
			setUpdateAuthor(author_id){
				uni.showLoading()
				this.$request({
					url:"/updateAuthor",
					method: "POST",
					data:{
						author_id
					}
				}).then(res=>{
					uni.hideLoading()
					this.formData.is_author_like = !this.formData.is_author_like
					uni.$emit('update_follow_page')
					uni.showToast({
						title:this.formData.is_author_like? "关注成功":"取消关注",
						icon: "none"
					})
				})
			},
			setUpdateLike(article_id){
				uni.showLoading()
				this.$request({
					url: '/updateLike',
					method: 'POST',
					data: {
						article_id
					}
				})
				.then(res=>{
					uni.hideLoading()
					this.formData.is_like = !this.formData.is_like
					uni.$emit('update_main_page_status', 'follow')
					uni.showToast({
						title: this.formData.is_like? '收藏成功': '取消收藏',
						icon: 'none'
					})
				})
			},
			setUpdateThumbs(article_id){
				if(this.formData.is_thumbs_up) return
				
				uni.showLoading()
				this.$request({
					url: '/updateThumbsup',
					method: 'POST',
					data: {
						article_id
					}
				}).then(res=>{
					uni.$emit('update_main_page_status')
					uni.hideLoading()
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					this.formData.is_thumbs_up = true
					this.formData.thumbs_up_count++
				})
			},
			open(){
				uni.navigateTo({
					url:"../detail-comments/detail-comments?id=" + this.formData._id
				})
			}
		}
	}
</script>

<style lang="scss">
	.detail{
		padding-top: 15px;
		padding-bottom: 54px;
	}
	.detail-title{
		padding: 0 15px;
		font-size: 18px;
		font-weight: bold;
		color: #333;
	}
	.detail-header{
		display: flex;
		align-items: center;
		margin: 10px;
		padding: 0 15px;
		.detail-header__logo{
			// 不压缩
			flex-shrink: 0;
			width: 40px;
			height: 40px;
			border-radius: 50%;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.detail-header__content{
			width: 100%;
			padding-left: 10px;
			display: flex;
			// 垂直显示
			flex-direction: column;
			// 上下对齐
			justify-content: space-between;
			font-size: 12px;
			.detail-header__content-title{
				font-size: 14px;
				color: #333333;
			}
			.detail-header__content-info{
				color: #999;
				text{
					margin-right: 10px;
				}
			}
			
		}
		.detail-header__button{
			flex-shrink: 0;
			height: 30px;
			line-height: 30px;
			font-size: 12px;
			color: #fff;
			background-color: $mk-base-color;
		}
	}
	.detail-content{
		min-height: 500px;
		margin-top: 20px;
		.detail-html{
			padding: 0 15px;
		}
		.detail-comment{
			margin-top: 30px;
			.comment-title{
				padding:10px 15px;
				font-size: 14px;
				color: #666;
				border-bottom: 1px #f5f5f5 solid;
			}
			.comment-content {
				padding: 0 15px;
				border-top: 1px solid #eee;
			}
		}
	}
	
	.detail-bottom{
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		width: 100%;
		height: 44px;
		border-top: 1px #f5f5f5 solid;
		background-color: #fff;
		box-sizing: border-box;
		.detail-bottom__input{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-left: 10px;
			padding: 0 10px;
			width: 100%;
			height: 30px;
			border: 1px #ddd solid;
			border-radius: 5px;
			text{
				font-size: 14px;
				color: #999;
			}
		}
		.detail-bottom__icons{
			display: flex;
			flex-shrink: 0;
			padding: 0 10px;
			.detail-bottom__icons-box{
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 44px;
			}
		}
	}
	.popup-wrap{
		background-color: #fff;
		.popup-header{
			display: flex;
			justify-content: space-between;
			font-size: 14px;
			color:#666;
			border: 1px #f5f5f5 solid;
			.popup-header__item{
				height: 50px;
				line-height: 50px;
				padding: 0 15px;
			}
		}
		.popup-content{
			width: 100%;
			padding: 15px;
			box-sizing: border-box;
			.popup-textarea{
				width: 100%;
				height: 200px;
			}
			.popup-count{
				display: flex;
				justify-content: flex-end;
				font-size: 12px;
				color: #999;
			}
		}
	}
	.no-data{
		width: 100%;
		text-align: center;
		padding: 30px 0;
		font-size: 12px;
		color: #666;
	}
</style>
