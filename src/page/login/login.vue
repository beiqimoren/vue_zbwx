<template>
	<div id="backcont">
		<div class="meituan-content">
			<div class="login-cont">
				<div class="meituan-title">扫码点餐商户端</div>
				<div class="meituan-user">
					<p>账号</p>
					<el-input clearable v-model="account" class="inptflex" placeholder="请输入账号" />
				</div>
				<div class="meituan-user">
					<p>密码</p>
					<el-input v-model="password" show-password class="inptflex" placeholder="请输入密码" />
				</div>
				<!-- 登录和注册按钮的切换 -->
				<div class="reg-view" @click="regi = regi == '登录' ? '注册' : '登录'"><p>{{regi}}</p></div>
				<!-- 登录或注册按钮提交 -->
				<el-button v-if="regi == '注册'" @click="signin" type="success" :loading="load" class="meituan-btn">登录</el-button>
				<el-button v-else type="success" @click="register" :loading="load" class="meituan-btn">注册</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import {reactive,toRefs,getCurrentInstance} from 'vue'
import {useRouter} from 'vue-router'
export default{
	setup(){
		const {proxy} = getCurrentInstance()
		const router = useRouter()
		const user = reactive({
			account:'',
			password:'',
			regi:'注册',
			load:false
		})
		// 登录
		const signin = async()=>{
			user.load = true
			const obj = {account:user.account,password:user.password}
			try{
				const res = await new proxy.$request(proxy.$urls.m().login,obj).modepost()
				if(res.status != 200){
					new proxy.$tips(res.data.msg,'warning').mess_age()
				}else{
					// 跳转到内容页面
					let ids = '1'
					localStorage.setItem('token',res.data.data.token)
					localStorage.setItem('menuid',JSON.stringify(ids))
					router.push({name:'index'})
				}
				user.load = false
			}catch(e){
				user.load = false
				new proxy.$tips('服务器发生出错误','error').mess_age()
			}
			
		}
		// 注册
		const register = async()=>{
			user.load = true
			const obj = {account:user.account,password:user.password}
			try{
				const res = await new proxy.$request(proxy.$urls.m().register,obj).modepost()
				if(res.status != 200){
					new proxy.$tips(res.data.msg,'warning').mess_age()
				}else{
					user.regi = '注册'
				}
				user.load = false
			}catch(e){
				user.load = false
				new proxy.$tips('服务器发生错误','error').mess_age()
			}
			
		}
		return{...toRefs(user),signin,register}
	}
}
</script>

<style>
</style>
