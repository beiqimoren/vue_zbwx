<template>
	<div class="ordering" v-loading.fullscreen.lock="Loading">
		<div class="heading">菜品管理</div>
		<div class="button-view">
			<router-link :to="{name:'upload'}">
			<el-button type="success" @click="addGoods">添加菜品</el-button>
			</router-link>
		</div>
		<div class="modify-button">
			<el-table :data="dish_data" style="width: 100%" >
				<el-table-column prop="time" label="创建时间" align="center" min-width="100" />
				<el-table-column prop="category" label="类目" align="center" min-width="100" />
				<el-table-column prop="name" label="菜品名称" align="center" min-width="100" />
				<el-table-column label="商品图片" align="center" min-width="100">
					<!-- 头像 -->
					<template #default="scope">
						<el-image
							style="width: 40px; height: 40px"
							:src="scope.row.image[0].url"
							:preview-src-list="[scope.row.image[0].url]"
							fit="cover"
							:hide-on-click-modal="true"
							lazy
						></el-image>
					</template>
				</el-table-column>
				<el-table-column prop="unitprice" align="center" label="价格" min-width="100" />
				<el-table-column align="center" label="操作" min-width="100">
					<template #default="scope">
						<el-button size="small" type="primary" @click="Edit(scope.row)">编辑</el-button>
						<el-button size="small" type="danger" v-if="scope.row.onsale" @click="offthe_Shelf(scope.row.name,scope.row._id,scope.$index)">下架</el-button>
						<el-button size="small" type="danger" disabled v-else>已下架</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页 -->
			<el-pagination background layout="prev, pager, next"
			 :total="total"
			 :hide-on-single-page="true"
			 @current-change="currentchange"
			 >
			</el-pagination>
		</div>
	</div>
</template>

<script>
import {reactive,toRefs,onMounted,getCurrentInstance,ref} from 'vue'
import { ElMessageBox } from 'element-plus'
import {useRouter} from 'vue-router'
import {goodsData} from '@/store/index'
const store = goodsData()
export default{
	setup(){
		const {proxy} = getCurrentInstance()
		const Loading = ref(true)
		const router = useRouter()
		const oper_data = reactive({
			page:0,
			dish_data:[],
			total:0
		})
		
		// 请求菜品数据
		onMounted(()=>{
			get_dishes()
		})
		async function get_dishes(){
			try{
				const res = await new proxy.$request(proxy.$urls.m().obtaindishes + '?page=' + oper_data.page).modeget()
				console.log(res)
				oper_data.dish_data = res.data.data.result
				oper_data.total = res.data.data.total
				Loading.value = false
			}catch(e){
				new proxy.$tips('服务器发生错误','error').mess_age()
			}
		}
		
		// 下架菜品提示框
		const offthe_Shelf = (name,id,index)=>{
			console.log(name,id)
			 ElMessageBox.confirm(
				`确定对 ${name} 下架吗?`,
				'提示',
				{confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning',center: true}
			)
			.then(res=>{
				console.log('确定')
				Shelf(id,index)
			})
			.catch(err=>{
				console.log('取消')
			})
		}
		// 下架菜品
		async function Shelf(id,index){
			try{
				const res = await new proxy.$request(proxy.$urls.m().fromsale + '?id=' + id).modeget()
				console.log(res)
				oper_data.dish_data[index].onsale = false
			}catch(e){
				new proxy.$tips('服务器发生错误','error').mess_age()
			}
		}
		//添加商品重置为null
		const addGoods = ()=>{store.editItem(null)}
		// 编辑商品
		const Edit = (scope)=>{ 
			const val = JSON.stringify(scope)
			store.editItem(val)
			router.push({name:'upload'})
		}
		// 分页触发:作业
		function currentchange(){
			oper_data.page = e - 1
			get_dishes()
		}
		return{...toRefs(oper_data),currentchange,offthe_Shelf,Edit,Loading,addGoods}
		
	}
}
</script>

<style scoped="scoped">
::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
	background-color: #00be06;
	color: #fff;
}
</style>
