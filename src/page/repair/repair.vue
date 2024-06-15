<template>
	<div class="ordering" v-loading.fullscreen.lock="Loading">
		<div class="heading">装备维修需求</div>
		<div class="query-view">
			<!-- 日期选择器
			<div class="quotation-query">
				<div class="quotation-title">交易时间</div>
				<div>
					<el-date-picker
						v-model="time"
						type="daterange"
						unlink-panels
						range-separator="至"
						start-placeholder="开始时间"
						end-placeholder="结束时间"
						value-format="YYYY-MM-DD"
					  >
					</el-date-picker>
				</div>
			</div> -->
			<!-- 下拉列表 -->
			<div class="quotation-query">
				<div class="quotation-title">类型</div>
				<div>
					<el-select v-model="sevalue" placeholder="请选择">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value"
					    >
					    </el-option>
					</el-select>
				</div>
			</div>
			<!-- 查询按钮 -->
			<div class="quotation-query"><el-button type="success" @click="queryFun">查询</el-button></div>
		</div>
		<!-- 表格 -->
		<div>
			<el-table :data="table_data" style="width: 100%" >
				<el-table-column prop="contact" label="联系人" align="center" min-width="100" />
				<el-table-column prop="unit" label="单位" align="center" min-width="100" />
				<el-table-column prop="phone" label="联系电话" align="center" min-width="100" />
                <el-table-column prop="city" label="装备所在地" align="center" min-width="100" />
				<el-table-column prop="type" label="装备型号" align="center" min-width="100" />
				<el-table-column prop="fault" label="故障现象" align="center" min-width="100" />
				<el-table-column label="详情" align="center" min-width="100">
					<template #default="scope">
						<el-button size="small" :loading="scope.$index == deta_load ? true : false" @click="detailed(scope.$index,scope.row._id)">详细</el-button>
					</template>
				</el-table-column>
				<el-table-column label="状态" align="center" min-width="100">
					<template #default="scope">
						<el-button size="small" v-if="scope.row.transac_status == 'success'" disabled type="danger">已受理</el-button>
						<el-button size="small" v-else type="danger">未受理</el-button>
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
		<!-- 弹窗 -->
		<Dialog ref="dialog"></Dialog>
	</div>
</template>

<script>
import {reactive,toRefs,onMounted,getCurrentInstance,ref} from 'vue'
import Dialog from './component/el-dialog.vue'
import qs from 'qs';
export default{
	components:{Dialog},
	setup(){
		const {proxy} = getCurrentInstance()
		const Loading = ref(true)
		let dialog = ref()
        const options= [{
          value: '已处理',
          label: '已处理'
        }, {
          value: '待受理',
          label: '待受理'
        }]
		const oper_data = reactive({
			time:[],//选中的时间
			sevalue:'',//选中的桌号
			//options:[],//桌号的数据
			table_data:[],// 表格数据
			page:0,//第一页的数据
			total:0,//数据总得条数
			deta_load:-1
		})
		
		// 请求数据
		onMounted(()=>{
			get_order()
		})
		
		async function get_order(){
			const query = qs.stringify({
				page:oper_data.page,
				table_number:oper_data.sevalue,
				order_time:JSON.stringify(oper_data.time)
			})
			try{
                const adminID = localStorage.getItem('adminID')
                const res = await new proxy.$request(proxy.$urls.m().admin_getrepair+ '?' + 'page='+oper_data.page+'&adminID='+adminID).modeget()
				if(res.status != 200){
					new proxy.$tips(res.data,'warning').mess_age()
				}else{
					//console.log(res)
                    oper_data.table_data = res.data.result
				    //oper_data.total = res.data.result.length
                    console.log("oper_datatotal=",res.data.result.length)
				    Loading.value = false
				}
			}catch(e){
				new proxy.$tips('服务器发生错误','error').mess_age()
			}
		}
		
		// 分页触发事件
		function currentchange(e){
			oper_data.page = e - 1
			get_order()
		}
		
		//点击详细菜单传值给子组件
		const detailed = async(index,id)=>{
			oper_data.deta_load = index
			try{
				const res = await new proxy.$request(proxy.$urls.m().vieworder + '?id=' + id).modeget()
				dialog.value.popup(res.data.data)
				oper_data.deta_load = -1
			}catch(e){
				oper_data.deta_load = -1
				new proxy.$tips('服务器发生错误','error').mess_age()
			}
		}
		
		// 查询
		function queryFun(){
			get_order()
		}
		return {...toRefs(oper_data),currentchange,detailed,dialog,queryFun,Loading,options}
	}
}
</script>

<style scoped="scoped">
::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
	background-color: #00be06;
	color: #fff;
}
</style>
