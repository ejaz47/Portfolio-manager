<template>
	<div id="portfolio">
		<h1>Portfolio Manager</h1>
		<h2>Transactions details of the selected portfolio.</h2>
		
		<div style="padding: 20px">
			<div class="text-right" style="padding: 10px;">
				Portfolio value by date:
				<input type="date" v-model="selectedDate" @change="getItems()">
			</div>
			<b-table hover 
				:items="items" 
				:fields="fields"
				foot-clone
				 >

				<template v-slot:head(selectedDateCombined)="data">
			        <span class="text-info">
			        	<div>Selected date</div>
				        {{ data.label }}
				    </span>
			    </template>
				<template v-slot:foot(name)="data">
					<span class="text-danger">Total Portfolio value:</span>
				</template>
				<template v-slot:foot(selectedDateCombined)="data">
					<span class="text-danger">{{ total }}</span>
				</template>
				<template v-slot:foot()="data">
			        
			    </template>					
			</b-table>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import { helper } from '@/helper'

export default {
	mixins: [helper],
	name: 'portfolio',
	data () {
		return {
			fields: [
				{ key: 'name', label: 'Name', class: ['text-left']},
				{ key: 'Date', label: 'Transaction Date', class: ['text-left']},
				{ key: 'Type', label: 'Transaction Type', class: ['text-left']},
				{ key: 'Amount', label: 'Amount', class: ['text-right']},
				{ key: 'price', label: 'Price', class: ['text-right']},
				{ key: 'shares', label: 'Shares', class: ['text-right']},
				{ key: 'selectedDateCombined', label: 'Shares | Price | Amount', class: ['text-right']},
			],
			items: [],
			selectedPortfolio: null,
			securities: null,
			selectedDate: '2011-11-30',
			total: 0
		}
	},
	methods: {
		getItems: function(){

			// make a fresh entry
			this.items = [];
			this.total = 0;
			// loop through each transaction
		    this.selectedPortfolio["Transactions"].forEach((T) => {

		    	// get specific security by id
		        let security = this.findInArray(T['SecurityId'], '_Id', this.securities);
		    
		        //calculate at transaction date
		        let value = this.findPriceByDate(T.Date, 'EndDate', security['HistoryDetail']);
		        T.name = security['name'];
		        T.price = parseFloat(value['Value']).toFixed(2);
		        T.shares = parseFloat(T.Amount) / parseFloat(T.price);
		        T.shares = this.floorFigure(T.shares);
		        T.selectedDate = {
		            shares: 0,
		            price: 0,
		            amount: 0
		        };

		        //calc at selected date
		        let res = this.findPriceByDate(this.selectedDate, 'EndDate', security['HistoryDetail']);
		        T.selectedDate.shares = T.shares;
		        T.selectedDate.price = parseFloat(res['Value']).toFixed(2);
		        T.selectedDate.amount = parseFloat(T.selectedDate.shares) * parseFloat(T.selectedDate.price);
		        T.selectedDate.amount = T.selectedDate.amount.toFixed(2);        
		        T.selectedDateCombined = T.selectedDate.shares + ' | ' + T.selectedDate.price + ' | ' + T.selectedDate.amount;
		        // push computed item row
		        this.items.push(T);

		    })

	        this.items.forEach((mi) => {
	        	console.log(mi.selectedDate.amount);
	        	this.total = parseFloat(this.total) + parseFloat(mi.selectedDate.amount);
	        });
	        this.total = this.total.toFixed(2);

		    console.log("Final", this.items);
		}
	},
	mounted () {
		console.log('mounted');
		this.selectedPortfolio = this.$route.params.portfolio;
		this.securities = this.$route.params.securities;

		if(this.selectedPortfolio && this.securities){
			this.getItems();
		}else{
			this.$router.back();
		}
	}
}
</script>
