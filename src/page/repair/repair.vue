<template>
	<div class="ordering" v-loading.fullscreen.lock="Loading">
		<div class="heading">装备维修申请</div>
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
				<div class="quotation-title">状态</div>
				<div>
					<el-select v-model="sevalue" placeholder="请选择" style="width: 200px;">
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
				<el-table-column prop="contact" label="联系人" align="center" min-width="60" />
				<el-table-column prop="unit" label="单位" align="center" min-width="100" />
				<el-table-column prop="phone" label="联系电话" align="center" min-width="120" />
                <!-- <el-table-column prop="city" label="装备所在地" align="center" min-width="100" /> -->
                <el-table-column prop="equipment" label="装备名称" align="center" min-width="100" />
				<!-- <el-table-column prop="type" label="装备型号" align="center" min-width="100" /> -->
				<el-table-column prop="fault" label="故障现象" align="center" min-width="150" />
                <el-table-column prop="state" label="当前状态" align="center" min-width="80" />
				<el-table-column label="详情" align="center" min-width="60">
					<template #default="scope">
						<el-button size="small" :loading="scope.$index == deta_load ? true : false" @click="detailed(scope.$index,scope.row.id)">详细</el-button>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" min-width="60">
					<template #default="scope">
						<!-- <el-button size="small" v-if="scope.row.transac_status == 'success'" disabled type="danger">已受理</el-button>
						<el-button size="small" v-else type="danger">未受理</el-button> -->
                        <el-button size="small"  type="danger"  v-if="scope.row.state == '已完成'" disabled>已处理</el-button>
                        <el-button size="small"  type="danger" @click="change_state(scope.row.id,scope.row.state)" v-else-if="scope.row.state == '待审核'" >受理</el-button>
                        <el-button size="small" @click="change_state(scope.row.id,scope.row.state)" v-else type="danger">结单</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页 -->
			<el-pagination background layout="prev, pager, next"
			 :total="total"
			 :hide-on-single-page="true"
			 @current-change="currentchange"
             :current-page="currentPage"
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
          value: '待审核',
          label: '待审核'
        }, {
          value: '处理中',
          label: '处理中'
        }, {
          value: '已完成',
          label: '已完成'
        }, {
          value: '',
          label: '全部'
        }]
        const currentPage = ref(1);
		const oper_data = reactive({
			time:[],//选中的时间
			sevalue:'',//选中的状态
			//options:[],//桌号的数据
			table_data:[],// 表格数据
			page:1,//第一页的数据
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
                adminID :localStorage.getItem('adminID'),
				state:oper_data.sevalue,
			})
			try{
				const res = await new proxy.$request(proxy.$urls.m().admin_getrepair+ '?' + query).modeget()
                if(res.status != 200){
					new proxy.$tips(res.data,'warning').mess_age()
				}else{
					//console.log(res)
                    oper_data.table_data = res.data.result
				    oper_data.total = res.data.total
				    Loading.value = false
				}
			}catch(e){
				new proxy.$tips('服务器发生错误','error').mess_age()
			}
		}
		
		// 分页触发事件
		function currentchange(e){
			oper_data.page = e
            currentPage.value = e
			get_order()
		}
		
		//点击详细菜单传值给子组件
		const detailed = async(index,id)=>{
			oper_data.deta_load = index
            //console.log("repairid=",id)
			try{
				const res = await new proxy.$request(proxy.$urls.m().admin_viewrepair + '?id=' + id).modeget()
				dialog.value.popup(res.data.result)
				oper_data.deta_load = -1
			}catch(e){
				oper_data.deta_load = -1
				new proxy.$tips('服务器发生错误','error').mess_age()
			}
		}
        //处理维修需求申请单状态
        const change_state = async(id,state)=>{
            //console.log("repairid=",id)
            let state_temp=''
            if(state=="待审核"){
                state_temp="处理中"
            }else{
                state_temp="已完成"
            }
			try{
				const res = await new proxy.$request(proxy.$urls.m().admin_changerepairstate + '?id=' + id + '&state='+state_temp).modeget()
				get_order()
			}catch(e){
				oper_data.deta_load = -1
				new proxy.$tips('服务器发生错误','error').mess_age()
			}
		}
		
		// 查询
		function queryFun(){
            oper_data.page = 1
            currentPage.value = 1
			get_order()
		}
		return {...toRefs(oper_data),currentchange,detailed,change_state,dialog,queryFun,Loading,options,currentPage}
	}
}
</script>

<style scoped="scoped">
::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
	background-color: #00be06;
	color: #fff;
}
</style>
