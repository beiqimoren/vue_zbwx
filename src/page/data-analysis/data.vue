<template>
	<div class="ordering" v-loading.fullscreen.lock="Loading">
		<div class="heading">数据分析</div>
		<div>
			<First :pieChert="pieChert" :hisTogram="hisTogram"></First>
			<Second :lineChart="lineChart"></Second>
		</div>
	</div>
</template>

<script>
import First from './component/first-floor.vue'
import Second from './component/second.vue'
import {reactive,onMounted,getCurrentInstance,toRefs,ref} from 'vue'
export default{
	components:{First,Second},
	setup(){
		const {proxy} = getCurrentInstance()
		const Loading = ref(true)
		const ansLysis = reactive({
			pieChert:[],//饼图
			hisTogram:[],//柱状图
			lineChart:[],//折线图
		})
		// 请求数据
		onMounted(()=>{
			get_data()
		})
		async function get_data(){
			try{
				const res = await new proxy.$request(proxy.$urls.m().analysis).modeget()
				console.log(res)
				ansLysis.pieChert = res.data.data[0]
				ansLysis.hisTogram = res.data.data[1]
				ansLysis.lineChart = res.data.data[2]
				Loading.value = false
			}catch(e){
				new proxy.$tips('服务器发生错误','error').mess_age()
			}
		}
		return{...toRefs(ansLysis),Loading}
	}
}
</script>

<style>
</style>
