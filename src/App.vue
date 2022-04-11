<script>
	export default {
		onLaunch: function() {
			this.$request({url:"/getUser", method: 'POST',data:{
				user_id: this.$store.state.user_id
			}}).then(res=>{
				const {data} = res
				this.$store.dispatch('set_userinfo', data.data)
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* 文章的富文本全局样式加载 */
	@import 'components/gaoyia-parse/parse.css';
</style>
