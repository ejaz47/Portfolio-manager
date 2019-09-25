<template>
	<div id="portfolio">
		<h1>Portfolio Manager2</h1>
		<!-- <h2>Transactions details of the selected portfolio.</h2> -->
		
		<div style="padding: 20px">
			<b-table hover 
				:items="items" 
				:fields="fields"
				@row-clicked="gotoDetails"
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
				{ key: 'name', label: 'Name', class: ['text-left'] },
				{ key: 'holdings_count', label: 'Number of Holdings'},
				{ key: 'last_modified', label: 'Last Modified'}
			],
			items: [],
			portfolios: null,
			securities: null
		}
	},
	methods: {
		gotoDetails: function(item, index){
			console.log('clicked', item.id, index);
			this.$router.push({ name: 'Portfolio_detail', params: {
				portfolio: this.portfolios[index],
				securities: this.securities
			}});
		},
		getProtfolios: function(){
			return new Promise((resolve, reject) => {
	            axios.get('https://8j4rtfdbq0.execute-api.ap-south-1.amazonaws.com/dev/portfolios')
		        .then(resp => {
		        	this.portfolios = resp.data["Portfolios"];
		        	resolve(this.portfolios);
		        })
		        .catch(err => {
		        	reject(err);
		        })
	        })
		},
		getSecurities: function(){
			return new Promise((resolve, reject) => {
	            axios.get('https://8j4rtfdbq0.execute-api.ap-south-1.amazonaws.com/dev/securities')
		        .then(resp => {
		        	this.securities = resp.data["Securities"];
		        	resolve(this.securities);
		        })
		        .catch(err => {
		        	reject(err);
		        })
	        })
		}
	},
	mounted () {

		//protfolio fetch
    	this.getProtfolios().then(portfolios => {

        	window.port = portfolios;

			//securities fetch
    		this.getSecurities().then(securities => {

	        	window.sec = securities;

	        	try{
		        	portfolios.forEach(p => {
						let maxDate = '-';

		        		let sorted = p["Transactions"].sort(function sortDates(a, b){
						    return (new Date(a['Date'])).getTime() - (new Date(b['Date'])).getTime();
						});
						maxDate = sorted.length ? sorted[sorted.length-1]['Date'] : '-';

		        		this.items.push({
		        			id: p["_Id"],
		        			name: p["Name"],
		        			holdings_count: p["Transactions"].length,
		        			last_modified: maxDate
		        		});
		        	});
	        	}catch(err){
	        		console.log(err);
	        		alert('something went wrong!');
	        	}

    	    }, err => {
	    		console.log(err);
	    		alert('something went wrong!');
		    })

	    }, err => {
    		console.log(err);
    		alert('something went wrong!');
	    })
	}
}


</script>
