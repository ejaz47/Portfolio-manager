<template>
	<div id="portfolio">
		<h1>Portfolio Manager2</h1>
		<!-- <h2>Transactions details of the selected portfolio.</h2> -->
		
		<div>
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
				{ key: 'name', label: 'Name' },
				{ key: 'holdings_count', label: 'Number of Holdings'},
				{ key: 'last_modified', label: 'Last Modified'}
			],
			items: [],
			gotoDetails: (item) => {
				console.log('clicked', item.id);
				this.$router.push({ name: 'Portfolio_detail', params: {}});
			}
		}
	},
	mounted () {
		console.log('mounted');

		//protfolio fetch
    	axios.get('https://8j4rtfdbq0.execute-api.ap-south-1.amazonaws.com/dev/portfolios')
        .then(portfolioRes => {

        	window.port = portfolioRes.data;

			//securities fetch
    		axios.get('https://8j4rtfdbq0.execute-api.ap-south-1.amazonaws.com/dev/securities')
	        .then(securitiesRes => {

	        	window.sec = securitiesRes.data;
	        	try{
		        	portfolioRes.data.Portfolios.forEach(p => {
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


//console calculation to be applied


var selectedDate = "2011-11-30";
var items = [];
function getShares(poprtfolio, allSecs){

    poprtfolio["Transactions"].forEach((T) => {
        securities = search(T['SecurityId'], '_Id', allSecs);
    
        //calc at transaction date
        var value = searchPrice(T.Date, 'EndDate', securities['HistoryDetail']);
//         if(value){
     
            T.name = securities['name'];
            T.price = value['Value'];
            T.shares = parseFloat(T.Amount) / parseFloat(T.price);
            T.shares = floorFigure(T.shares);
            T.selectedDate = {
                shares: 0,
                price: 0,
                amount: 0
            };
//         }

        //calc at selected date
        var res = searchPrice(selectedDate, 'EndDate', securities['HistoryDetail']);
        T.selectedDate.shares = T.shares;
        T.selectedDate.price = res['Value'];
        T.selectedDate.amount = parseFloat(T.selectedDate.shares) * parseFloat(T.selectedDate.price);
        T.selectedDate.amount = T.selectedDate.amount.toFixed(2);        

        items.push(T);
    })
}

function search(term, attr, arr){
    for (var i=0; i < arr.length; i++) {
        if (arr[i][attr] === term) {
            return arr[i];
        }
    }
}

function searchPrice(term, attr, arr){
    var res = null;
    for (var i=0; i < arr.length; i++) {
        if (arr[i][attr] === term) {
            if(arr[i]['Value']){
                res = arr[i];
            }else{

                //get most prior selectedDate
            }
            break;
        }
    }
    
    return res;
}

function floorFigure(figure, decimals){
    if (!decimals) decimals = 2;
    var d = Math.pow(10,decimals);
    return (parseInt(figure*d)/d).toFixed(decimals);
};

// getShares(port['Portfolios'][0], sec['Securities']);

</script>
