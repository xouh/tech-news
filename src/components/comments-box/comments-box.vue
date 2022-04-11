<template>
	<view class="comments-box">
		<view class="comments-header">
			<view class="comment-header__logo">
				<image :src=comments.author.avatar mode="aspectFill"></image>
			</view>
			<view class="comment-header__info">
				<view v-if="!comments.is_reply" class="title">{{comments.author.author_name}}</view>
				<view v-else class="title">
					{{comments.author.author_name}}
					<text class="reply-text">回复</text>
					{{ comments.to }}
				</view>
				<view>{{formatTime(comments.comment_create_time)}}</view>
			</view>
		</view>
		<view class="comments-content">
			<view>{{comments.comment_content}}</view>
			<view class="comments-info">
				<view class="comments-button" @click="commentsReply({comments, is_reply:reply})">Reply</view>
			</view>
			<view class="comments-reply" v-for="item in comments.replys" :key="item.comment_id">
				<comments-box :reply="true" :comments="item" @reply="commentsReply"></comments-box>
			</view>
		</view>
	</view>
</template>

<script>
	import commentsBox from '@/components/comments-box/comments-box.vue'
	export default {
		// 递归调用组件需要name值，和组件名一样
		name:"comments-box",
		components:{
			commentsBox
		},
		props:{
			comments:{
				type: Object,
				default(){
					return {}
				}
			},
			reply:{
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			commentsReply(comment){
				// 区分mian回复，还是回复的回复
				if(comment.is_reply){
					comment.comments.reply_id = comment.comments.comment_id
					comment.comments.comment_id = this.comments.comment_id
				}
				this.$emit('reply', comment)
			},
			// 将时间戳转换成日期时间格式
			formatTime (timestamp) {

				let time = new Date(timestamp)
				let year = time.getFullYear()
				let month = time.getMonth() + 1
				let date = time.getDate()
				let hours = time.getHours()
				let minute = time.getMinutes()
				let second = time.getSeconds()
				
				// 该字段用来表示评论时间是否超过24小时，如果没有则返回时间，否则返回日期+时间
				let isToday = this.isToday(timestamp)
				
				if (month < 10) { month = '0' + month }
				if (date < 10) { date = '0' + date }
				if (hours < 10) { hours = '0' + hours }
				if (minute < 10) { minute = '0' + minute }
				if (second < 10) { second = '0' + second }
				return isToday ? (hours + ':' + minute) : (month + '-' + date + ' ' + hours + ':' + minute)
			},
			isToday(timestamp){
				let today = new Date().getTime()
				return today - timestamp <= 86400000000
			},

		}
	}
</script>

<style lang="scss">
	.comments-box{
		margin: 15px 0;
		.comments-header{
			display: flex;
			.comment-header__logo{
				flex-shrink: 0;
				height: 30px;
				width: 30px;
				border-radius: 5px;
				overflow: hidden;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.comment-header__info{
				display: flex;
				flex-direction: column;
				padding-left: 15px;
				font-size: 12px;
				color: #999;
				line-height: 1;
				.title{
					margin-bottom: 10px;
					font-size: 14px;
					color: #333;
					.reply-text{
						margin: 0 10px;
						font-weight: bold;
						color: #000;
					}
				}
			}
		}
		.comments-content{
			margin-top: 10px;
			font-size: 14px;
			color: #000;
			
			.comments-info{
				margin-top: 15px;
				display: flex;
				.comments-button{
					padding: 2px 10px;
					font-size: 12px;
					color: #999;
					border-radius: 20px;
					border: 1px solid #ccc;
				}
			}
			.comments-reply{
				display: flex;
				margin: 15px 0;
				padding: 0 10px;
				border: 1px #eee solid;
			}
		}
	}
</style>
