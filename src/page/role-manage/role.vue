<template>
	<div class="ordering" v-loading.fullscreen.lock="Loading">
		<div class="heading">员工详情</div>
		<div class="query-view">
			<el-button type="success" @click="add_to">添加员工</el-button>
			<el-button type="danger" @click="Delete" :disabled="arr_id.length > 0 ? false : true">批量删除</el-button>
		</div>
		<!-- 表格 -->
		<div>
			<el-table :data="table_data" style="width: 100%" @select="Select" @select-all="Selectall">
				<el-table-column type="selection" />
				<el-table-column prop="time" label="创建时间" align="center" min-width="100" />
				<el-table-column prop="jobnumber" label="工号" align="center" min-width="100" />
				<el-table-column prop="name" label="姓名" align="center" min-width="100" />
				<el-table-column prop="sex" align="center" label="性别" min-width="100" />
				<el-table-column prop="position" align="center" label="职位" min-width="100" />
				<el-table-column align="center" label="是否离职" min-width="100">
					<template #default="scope">
						<el-switch v-model="scope.row.quit" @change="Switch($event,scope.row._id,scope.$index)"/>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 分页 -->
		<el-pagination background layout="prev, pager, next"
		 :total="total"
		 :hide-on-single-page="true"
		 @current-change="currentchange"
		 :current-page="cur_page"
		 >
		</el-pagination>
		<div style="height: 120px;"></div>
		<!-- 弹窗 -->
		<Dialog ref="dialog" @launch="launch"></Dialog>
	</div>
</template>

<script>
import {reactive,toRefs,ref,onMounted,getCurrentInstance} from 'vue'
import Dialog from './component/El-dialog.vue'
import qs from 'qs';
import { ElMessageBox } from 'element-plus'
export default{
	components:{Dialog},
	setup(){
		const dialog = ref()
		const Loading = ref(true)
		const {proxy} = getCurrentInstance()
		const oper_data = reactive({
			table_data:[],
			page:0,//分页数
			total:0,//总数据条数
			arr_id:[],//存储待删除的员工_id
			cur_page:1,//分页组件当前页
		})
		
		// 调用子组件显示弹窗
		const add_to = ()=>{
			dialog.value.add()
		}
		
		// 请求员工数据
		onMounted(()=>{
			get_role()
		})
		
		async function get_role(){
			try{
				const res = await new proxy.$request(proxy.$urls.m().getemployees + '?page=' + oper_data.page).modeget()
				console.log(res)
				oper_data.table_data = res.data.data.result
				oper_data.total = res.data.data.total
				Loading.value = false
			}catch(e){
				new proxy.$tips('服务器发生错误','error').mess_age()
			}
		}
		
		// 开关选择器触发
		const Switch = async(val,id,index)=>{
			const query = qs.stringify({id,quit:val,})
			try{
				const res = await new proxy.$request(proxy.$urls.m().modifyresi + '?' + query).modeget()
				if(res.status == 200){
					new proxy.$tips(res.data.msg,'success').mess_age()
				}else{
					oper_data.table_data[index].quit = !val
				}
			}catch(e){
				oper_data.table_data[index].quit = !val
				new proxy.$tips('服务器发生错误','error').mess_age()
			}
		}
	
		// 分页触发事件
		function currentchange(e){
			oper_data.page = e - 1
			oper_data.cur_page = e
			get_role()
		}
		
		// 删除员工数据
		function Delete(){
			console.log(oper_data.arr_id)
			ElMessageBox.confirm(
				`确定删除${oper_data.arr_id.length}个员工吗?`,
				'提示',
				{confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning',center: true}
			)
			.then(res=>{Batch()})
			.catch(err=>{})
		}
		
		// 调用接口删除员工数据
		async function Batch(){
			const obj = {arrayid:oper_data.arr_id}
			try{
				const res = await new proxy.$request(proxy.$urls.m().deleteemp,obj).modepost()
				console.log(res)
				oper_data.arr_id = []
				get_role()
				new proxy.$tips(res.data.msg,'success').mess_age()
			}catch(e){
				new proxy.$tips('服务器发生错误','error').mess_age()
			}
		}
		
		// 单行选中or取消选中
		function Select(e){
			const ID = e.map(item=>{return item._id})
			oper_data.arr_id = ID
		}
		// 全选or取消全选
		function Selectall(e){
			const ID = e.map(item=>{return item._id})
			oper_data.arr_id = ID
		}
		// 被子组件调用的方法
		const launch = ()=>{
			oper_data.page = 0
			oper_data.cur_page = 1
			get_role()
		}
		
		return{...toRefs(oper_data),currentchange,
		add_to,dialog,Switch,Delete,Select,Selectall,launch,Loading}
	}
}
</script>

<style scoped="scoped">
::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
	background-color: #00be06;
	color: #fff;
}
</style>
