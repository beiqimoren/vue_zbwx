<template>
	<el-dialog v-model="dialogFormVisible" width="30%">
	    <el-form :model="form">
	      <el-form-item label="工号">
	        <el-input v-model="form.job_num" autocomplete="off"></el-input>
	      </el-form-item>
	      <el-form-item label="姓名">
	        <el-input v-model="form.name" autocomplete="off"></el-input>
	      </el-form-item>
		  <el-form-item label="性别">
		    <el-radio-group v-model="form.sex">
		        <el-radio label="001">男</el-radio>
		        <el-radio label="002">女</el-radio>
		    </el-radio-group>
		  </el-form-item>
		  <el-form-item label="职位">
		    <el-input v-model="form.position" autocomplete="off"></el-input>
		  </el-form-item>
		  <el-form-item label="是否离职">
		    <el-radio-group v-model="form.quit">
		        <el-radio label="001">在职</el-radio>
		        <el-radio label="002">已离职</el-radio>
		    </el-radio-group>
		  </el-form-item>
	    </el-form>
		<!-- 按钮 -->
	    <template #footer>
	      <span class="dialog-footer">
	        <el-button @click="dialogFormVisible = false">取消</el-button>
	        <el-button type="primary" @click="Submit" :loading="sub_load">确定</el-button>
	      </span>
	    </template>
	  </el-dialog>
</template>

<script>
import {reactive,toRefs,getCurrentInstance} from 'vue'
export default{
	emits:['launch'],
	setup(props,{emit}){
		const {proxy} = getCurrentInstance()
		const form = {
			job_num:'',//工号
			name:'',//姓名
			sex:'',//性别
			position:'',//职位
			quit:'',//是否离职
		}
		const state = reactive({form,
		dialogFormVisible:false,
		sub_load:false
		})
		
		// 被父组件调用
		function add(){
			state.dialogFormVisible = true
		}
		
		// 提交
		const Submit = async()=>{
			state.sub_load = true
			const {job_num,name,sex,position,quit} = state.form
			const obj = {jobnumber:job_num,name,sex,position,quit}
			try{
				const res = await new proxy.$request(proxy.$urls.m().addem,obj).modepost()
				console.log(res)
				if(res.status != 200){
					new proxy.$tips(res.data.msg,'warning').mess_age()
				}else{
					new proxy.$tips(res.data.msg,'success').mess_age()
					state.dialogFormVisible = false
					// 调用父组件的方法
					emit("launch")
				}
				state.sub_load = false
			}catch(e){
				state.sub_load = false
			}
		}
		
		return{...toRefs(state),add,Submit}
	}
}
</script>

<style>
</style>
