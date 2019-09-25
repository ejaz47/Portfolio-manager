export const helper = {
	data() {
		return {};
	},
	created: function() {},
	methods: {
		greetings: function() {
			console.log('Howdy my good fellow!');
		},
		// will return undefined if no match found
		findInArray: function(term, attr, arr){
		    for (let i=0; i < arr.length; i++) {
		        if (arr[i][attr] === term) {
		            return arr[i];
		        }
		    }
		},
		// will return most recent as per date if no match found
		findPriceByDate: function(_date, attr, arr){
		    let res = null;
		    let recent = null;

		    // loop each untill match found
		    for (let i=0; i < arr.length; i++) {
		    	// take most recent price by comparing date
		    	recent = (new Date(arr[i][attr])).getTime() < (new Date(_date)).getTime() ? arr[i] : recent; 
		        if (arr[i][attr] === _date) {
	                res = arr[i];
		            break;
		        }
		    }
		    
		    // return if found any match else return most recent
		    return res || recent;
		},
		//toFixedNoRound
		floorFigure: function(figure, decimals){
		    if (!decimals) decimals = 2;
		    var d = Math.pow(10,decimals);
		    return (parseInt(figure*d)/d).toFixed(decimals);
		}
	}
};