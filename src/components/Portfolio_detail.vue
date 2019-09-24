<template>
	<div id="portfolio">
		<h1>Portfolio Manager</h1>
		<h2>Transactions details of the selected portfolio.</h2>
		
		<div>
			<b-table hover 
				:items="items" 
				:fields="fields"
			>
			</b-table>
		</div>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	name: 'portfolio',
	data () {
		return {
			fields: [
				{ key: 'name', label: 'Name' },
			],
			items: []
		}
	},
	mounted () {
		console.log('mounted');
	}
}
</script>
