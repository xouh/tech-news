<template>
	<view @click="open">
		<!-- 基础视图 -->
		<view v-if="item.mode === 'base'" class="listcard">
			<view class="listcard-image">
				<image :src="item.cover[0]" mode="aspectFill"></image>
			</view>
			<view class="listcard-content">
				<view class="listcard-content__title">
					<text>
						{{item.title}}
					</text>
					<!-- <likes :item="item" :types="types"></likes> -->
				</view>
				<view class="listcard-content__des">
					<view class="listcard-content__des-label">
						<view class="listcard-content__des-label-item">{{ item.classify }}</view>
					</view>
					<view class="listcard-content__des-browse">{{item.browse_count}}浏览</view>
				</view>
			</view>
		</view>
		<!-- 多图视图 -->
		<view v-if="item.mode === 'column'" class="listcard mode-column">
			
			<view class="listcard-content">
				<view class="listcard-content__title">
					<text>
						{{item.title}}
					</text>
					<!-- <likes :item="item" :types="types"></likes> -->
				</view>
				<view class="listcard-image">
					<view v-if="index<=2" v-for="(item_sub, index) in item.cover" :key="index" class="listcard-image__item">
						<image :src="item_sub" mode="aspectFill"></image>
					</view>
				</view>
				<view class="listcard-content__des">
					<view class="listcard-content__des-label">
						<view class="listcard-content__des-label-item">{{ item.classify }}</view>
					</view>
					<view class="listcard-content__des-browse">{{ item.browse_count }}浏览</view>
				</view>
			</view>
		</view>
		<!-- 大图视图 -->
		<view v-if="item.mode === 'image'" class="listcard mode-image">
			<view class="listcard-image">
				<image :src="item.cover[0]" mode="aspectFill"></image>
			</view>
			<view class="listcard-content">
				<view class="listcard-content__title">
					<text>
						{{item.title}}
					</text>
					<!-- <likes  :item="item" :types="types"></likes> -->
				</view>
				
				<view class="listcard-content__des">
					<view class="listcard-content__des-label">
						<view class="listcard-content__des-label-item">{{item.classify}}</view>
					</view>
					<view class="listcard-content__des-browse">{{item.browse_count}}浏览</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			item:{
				type: Object,
				default(){
					return {}
				}
			},
			types:{
				type: String,
				default: ''
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			open(){
				const item = this.item
				this.$emit('click', item)

				const params = {
					_id: item._id,
					title: item.title,
					create_time: item.create_time,
					thumbs_up_count: item.thumbs_up_count,
					browse_count: item.browse_count,
					author: item.author
				}
				// attention params length
				uni.navigateTo({
					url:'/pages/home-detail/home-detail?params=' + JSON.stringify(params)
				})
			}
		}
	}
</script>

<style lang="scss">
.listcard{
	display: flex;
	padding: 10px;
	margin: 10px;
	border-radius: 5px;
	box-shadow: 0 0 5px 1px rgba($color:#000000, $alpha: 0.1);
	box-sizing: border-box;
	.listcard-image{
		flex-shrink: 0; //消除同级元素flex 我w100%被挤压
		width: 60px;
		height: 60px;
		border-radius: 5px;
		overflow: hidden;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.listcard-content{
		position: relative;
		display: flex;
		justify-content: space-between; //上元素top0 下元素 bottom 0
		flex-direction: column;
		padding-left: 10px;
		width: 100%;
		.listcard-content__title{
			position: relative;
			padding-right: 30px;
			font-size: 14px;
			color: #333;
			font-weight: 400;
			line-height: 1.2;
			
			text{
				// 文本两行溢出隐藏
				overflow: hidden;
				text-overflow: ellipsis;
				text-overflow: -o-ellipsis-lastline;
				display: -webkit-box;
				line-clamp:2;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}
		.listcard-content__des{
			display: flex;
			justify-content: space-between; //左右两边对齐 左边元素left0 右边元素right0
			font-size: 12px;
			.listcard-content__des-label{
				display: flex;
				.listcard-content__des-label-item{
					color: $mk-base-color;
					padding: 0 15px;
					margin-right: 5px;
					border-radius: 15px;
					border: 1px $mk-base-color solid;
				}
				.listcard-content__des-browse{
					color: #999;
					line-height: 1.5;
				}
			}
			
		}
	}
	&.mode-column{
		.listcard-content{
			width: 100%;
			padding-left: 0;
			.listcard-image{
				display: flex;
				margin-top: 10px;
				width: 100%;
				height: 70px;
				.listcard-image__item{
					margin-left: 10px;
					width: 100%;
					border-radius: 5px;
					overflow: hidden;
					&:first-child{
						margin-left: 0;
					}
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
			.listcard-content__des{
				margin-top: 10px;
			}
		}
		
	}
	&.mode-image{
		flex-direction: column;
		.listcard-image{
			width: 100%;
			height: 100px;
		}
		.listcard-content{
			padding-left: 0;
			margin-top: 10px;
			.listcard-content__des{
				display: flex;
				align-items: center;
				margin-top: 10px;
			}
			
		}
	}
}
</style>
