<template>
	<div>
		<!-- 顶部 -->
		<div class="sidebar-top">
			<div>星巴克后台管理</div>
			<div @click="signOut">退出</div>
		</div>
		<div class="sidebar-cont">
			<el-menu :default-active="ac_index" @select="Select">
				<div v-for="(item,index) in menu" :key="index">
					<router-link :to="{path:item.router}">
						<el-menu-item v-if="item.Subclass.length == 0" :index="item.id">
							<el-icon>
								<component :is="item.icon"></component>
							</el-icon>
							<span>{{item.title}}</span>
						</el-menu-item>
					</router-link>
					<!-- 二级，三级 -->
					<el-sub-menu v-if="item.Subclass.length > 0" :index="item.id">
						<template #title>
							<el-icon>
								<component :is="item.icon"></component>
							</el-icon>
							<span>{{item.title}}</span>
						</template>
						<div v-for="(two,index_two) in item.Subclass" :key="index_two">
							<router-link :to="{path:two.router}">
								<el-menu-item :index="two.id">{{two.title}}</el-menu-item>
							</router-link>
						</div>
					</el-sub-menu>
				</div>
			</el-menu>
		</div>
		<router-view></router-view>
	</div>
</template>

<script>
import {Histogram,UserFilled,CreditCard,Bowl} from '@element-plus/icons-vue'
import {shallowRef,ref,onMounted} from 'vue'
import {useRouter} from 'vue-router'
export default{
	components:{Histogram,UserFilled,CreditCard,Bowl},
	setup(){
		const router = useRouter()
		const Array = [
			{
				id:'1',
				icon:Histogram,
				title:'数据分析',
				router:'data',
				Subclass:[]//是否有二级三级等等菜单
			},
			{
				id:'2',
				icon:UserFilled,
				title:'用户列表',
				router:'userpage',
				Subclass:[]//是否有二级三级等等菜单
			},
			{
				id:'3',
				icon:CreditCard,
				title:'订单管理',
				router:'order',
				Subclass:[]//是否有二级三级等等菜单
			},
			{
				id:'4',
				icon:Bowl,
				title:'菜品管理',
				router:'dishes',
				Subclass:[]//是否有二级三级等等菜单
			},
			{
				id:'5',
				icon:UserFilled,
				title:'员工管理',
				router:'',
				Subclass:[
					{
						id:'5-1',
						title:'员工详情',
						router:'role',
					},
					{
						id:'5-2',
						title:'其他页面',
						router:'',
					}
				]//是否有二级三级等等菜单
			}
		]
	
		const menu = shallowRef(Array)
		// 菜单激活回调
		const ac_index = ref('1')
		function Select(index,path){
			localStorage.setItem('menuid',JSON.stringify(index))
		}
		onMounted(()=>{
			ac_index.value = JSON.parse(localStorage.getItem('menuid'))
		})
		// 退出登录
		function signOut(){
			localStorage.clear()
			router.push({name:'login'})
		}
	
		return{menu,ac_index,Select,signOut}
	
	}
}
</script>

<style>
</style>
