<template>
	<el-dialog
		class="hei_dialog"
	    v-model="res.dialogVisible"
	    title="技术支援申请详情"
	    width="500px"
	    center
	  >
      <div class="menu-padd" >   
          <div class="Menu-details menu-span">
			  <span>申请人：{{res.menu_data.unit}} {{res.menu_data.contact}} {{res.menu_data.phone}}</span>
		  </div>
          <div class="Menu-details menu-span">
			  <span>申请日期：{{res.menu_data.date}}</span>
		  </div>
          <div class="Menu-details menu-span">
			  <span>地址：{{res.menu_data.province}} {{res.menu_data.city}} {{res.menu_data.address}}</span>
		  </div>
          <div class="Menu-details menu-span">
			  <span>支援事项：{{res.menu_data.thing}}</span>
		  </div>
          <div class="Menu-details menu-span">
			  <span>当前状态：{{res.menu_data.state}}</span>
		  </div>
	  </div>  
	  </el-dialog>
</template>

<script>
import {reactive} from 'vue'
export default{
	setup(){
		const res = reactive({
			dialogVisible:false,
			menu_data:{}
		})
		
		// 被父组件调用的方法，并且携带值
		function popup(val){
			res.dialogVisible = true
			res.menu_data = val[0]
            //console.log("res.menu_data=",res.menu_data.address)
		}
		
		return{res,popup}
	}
}
</script>

<style>
.hei_dialog{
	height: 600px;
	overflow-y: auto;
	
}
</style>
