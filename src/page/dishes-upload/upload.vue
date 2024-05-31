<template>
	<div class="ordering">
		<el-breadcrumb :separator-icon="icon">
		    <el-breadcrumb-item :to="{ path: '/dishes' }">菜品管理</el-breadcrumb-item>
		    <el-breadcrumb-item>添加菜品</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="content-view-ten">
			<!-- 菜品类目 -->
			<div class="image-view-title">
				<div class="image-list">菜品类目</div>
				<div>
					<el-select v-model="catevalue" placeholder="请选择菜品类目">
					    <el-option
					      v-for="item in cate"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value"
					    >
					    </el-option>
					</el-select>
				</div>
			</div>
			<!-- 菜品民称 -->
			<div class="image-view-title">
				<div class="image-list">菜品名称</div>
				<el-input v-model="name" placeholder="请输入菜品名称" clearable />
			</div>
			<!-- 菜品价格(元) -->
			<div class="image-view-title">
				<div class="image-list">菜品价格(元)</div>
				<div class="opload-option">
					<el-input type="number" v-model="unitprice" placeholder="请输入菜品价格" clearable />
					<el-select v-model="compvalue" placeholder="请选择单位">
					    <el-option
					      v-for="item in company"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value"
					    >
					    </el-option>
					</el-select>
					<el-input v-if="compvalue == '自定义单位'" v-model="unit" placeholder="请输入自定义单位" clearable />
					<div v-if="compvalue == '自定义单位'">
						<el-button type="success" style="width: 100%; padding: 12px 20px;"
						 @click="Dishunit"
						:loading="unitload"
						>添加自定义单位</el-button>
					</div>
				</div>
			</div>
			<!-- 图片上传 -->
			<div class="image-view-title">
				<div class="image-list">菜品图片</div>
				<div>
					<el-upload
					    :action="img_url"
					    list-type="picture-card"
						accept=".jpg,.png,.webp,.jpeg,.jfif"
					    :on-preview="onpreview"
						:on-remove="onremove"
						:on-success="onsuccess"
						:on-error="onerror"
						:on-progress="onprogress"
						:before-upload="project"
						:file-list="goodsimage"
						:limit="1"
					  >
					    <el-icon><plus /></el-icon>
					  </el-upload>
					  <el-dialog v-model="dialogVisible">
					    <img style="width: 100%;" :src="dialogImageUrl" alt="" />
					  </el-dialog>
				</div>
			</div>
			<!-- 提交 -->
			<div class="sub-button">
				<el-button type="success" :loading="subload" @click="Submit">提交</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import { ArrowRight,Plus } from '@element-plus/icons-vue'
import {shallowRef,reactive,toRefs,getCurrentInstance,toRaw,onMounted,watch} from 'vue'
import {useRouter,useRoute} from 'vue-router'
import {goodsData} from '@/store/index'
const store = goodsData()
export default{
	components:{ArrowRight,Plus},
	setup(){
		const icon = shallowRef(ArrowRight)
		const {proxy} = getCurrentInstance()
		const img_url = proxy.$urls.m().uploadres
		const jump_router = useRouter()//跳转页面
		const router = useRoute()//接收值
		const oper_data = reactive({
			catevalue:'',//选中的菜品类目
			name:'',//菜品名称
			unitprice:'',//输入的价格
			compvalue:'',//选中的单位
			unit:'',//选中的自定义单位
			cate:[],//菜品类目列表
			company:[],//菜品单位列表
			goodsimage:[],//上传接收的图片
			dialogVisible:false,//是否展示大图
			dialogImageUrl:'',//展开大图的图片连接
			unitload:false,//自定义单位按钮loading
			subload:false,//提交按钮loading
			id:'',//该条菜品数据唯一标识_id
		})
		
		// 点击文件列表中已上传的文件时的钩子:点击展开大图时触发
		const onpreview = (file)=>{
			oper_data.dialogImageUrl = toRaw(file).url
			oper_data.dialogVisible = true
		}
		// 文件列表移除文件时的钩子
		const onremove = (file, fileList)=>{
			oper_data.goodsimage = []
		}
		// 文件上传成功时的钩子
		const onsuccess = (res, file, fileList)=>{
			oper_data.goodsimage.push({url:res.data,uid:file.uid})
		}
		// 文件上传失败时的钩子
		const onerror = (err, file, fileList)=>{
			console.log(err, file, fileList)
		}
		// 文件上传时的钩子
		const onprogress = (event, file, fileList)=>{}
		// 上传文件之前的钩子
		const project = (file)=>{}
		
		// 获取菜品类目和单位
		onMounted(()=>{
			cate_unit()
		})
		async function cate_unit(){
			try{
				const CATE = new proxy.$request(proxy.$urls.m().obtaincate).modeget()
				const UNIT = new proxy.$request(proxy.$urls.m().obtainunit).modeget()
				const res = await Promise.all([CATE,UNIT])
				console.log(res)
				oper_data.cate = res[0].data.data
				oper_data.company = res[1].data.data
				oper_data.company.push({label: "自定义单位",unid: "980",value: "自定义单位",_id: "980"})
			}catch(e){
				//TODO handle the exception
			}
		}
		
		// 添加自定义单位
		const Dishunit = async()=>{
			oper_data.unitload = true
			const obj = {unit:oper_data.unit}
			try{
				const res = await new proxy.$request(proxy.$urls.m().dishunit,obj).modepost()
				console.log(res)
				if(res.status !=200){
					new proxy.$tips(res.data.msg,'warning').mess_age()
				}else{
					new proxy.$tips(res.data.msg,'success').mess_age()
					oper_data.compvalue = ''
					oper_data.unit = ''
					cate_unit()
				}
				oper_data.unitload = false
			}catch(e){
				oper_data.unitload = false
				new proxy.$tips('服务器发生错误','error').mess_age()
			}
		}
		
		// 提交上架菜品
		const Submit = async()=>{
			oper_data.subload = true
			const {id,catevalue,name,unitprice,compvalue,goodsimage} = oper_data
			const obj = {id,category:catevalue,name,unitprice,
						unit:compvalue,image:goodsimage}
			console.log(obj)
			const URL = id == '' ? proxy.$urls.m().putdishes : proxy.$urls.m().editdishes
			try{
				const res = await new proxy.$request(URL,obj).modepost()
				if(res.status != 200){
					new proxy.$tips(res.data.msg,'warning').mess_age()
				}else{
					new proxy.$tips(res.data.msg,'success').mess_age()
					jump_router.push({name:'dishes'})
				}
				oper_data.subload = false
			}catch(e){
				oper_data.subload = false
				console.log(e)
			}
		}
		
		// 接收编辑菜品传来的数据
		const etid_data = store.stoGoods
		if(etid_data){
			const value = JSON.parse(etid_data)
			const {category,name,unitprice,unit,image,_id} = value
			oper_data.id = _id,
			oper_data.catevalue = category,
			oper_data.name = name,
			oper_data.unitprice = JSON.stringify(unitprice),
			oper_data.compvalue = unit,
			oper_data.goodsimage = image
		}
		
		return{icon,...toRefs(oper_data),img_url,
		onpreview,onremove,onsuccess,onerror,onprogress,
		project,Dishunit,Submit
		}
	}
}
</script>

<style scoped="scoped">
.opload-option{
	display: flex;
	align-items: center;
	justify-content: left;
}
.opload-option div{
	width: 25% !important;
	margin-right: 5px;
}
.el-button--success{width: 150px;}
</style>
