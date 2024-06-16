import {createRouter,createWebHashHistory} from "vue-router"

const routes = [
	{//登录界面
		path:'/',
		name:'login',
		component:()=>import(/*webpackChunkName:'Login'*/ '@/page/login/login.vue')
	},
	{//主界面
		path:'/index',
		name:'index',
		component:()=>import(/*webpackChunkName:'Lndex'*/ '@/page/index/index.vue'),
		redirect:'/repair',
		// 二级路由
		children:[
			{//用户列表
				path:'/userpage',
				name:'userpage',
				component:()=>import(/*webpackChunkName:'Userpage'*/ '@/page/user-page/user.vue')
			},
			{//装备维修申请
				path:'/repair',
				name:'repair',
				component:()=>import(/*webpackChunkName:'Repair'*/ '@/page/repair/repair.vue')
			},
			{//技术支援申请
				path:'/support',
				name:'support',
				component:()=>import(/*webpackChunkName:'Support'*/ '@/page/support/support.vue')
			},
			{//订单管理
				path:'/order',
				name:'order',
				component:()=>import(/*webpackChunkName:'Order'*/ '@/page/order/order.vue')
			},
			{//菜品管理
				path:'/dishes',
				name:'dishes',
				component:()=>import(/*webpackChunkName:'Dishes'*/ '@/page/dishes/dishes.vue')
			},
			{//菜品管理:上传菜品
				path:'/upload',
				name:'upload',
				component:()=>import(/*webpackChunkName:'Upload'*/ '@/page/dishes-upload/upload.vue')
			},
			{//员工详情
				path:'/role',
				name:'role',
				component:()=>import(/*webpackChunkName:'Role'*/ '@/page/role-manage/role.vue')
			},
			{//数据分析
				path:'/data',
				name:'data',
				component:()=>import(/*webpackChunkName:'Data'*/ '@/page/data-analysis/data.vue')
			}
		]
	}
]

const router = createRouter({
  // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes
})

export default router