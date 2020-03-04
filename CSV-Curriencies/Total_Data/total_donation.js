module.exports=(Total_donation,axios,csvtojson,Json2csv,fs)=>{
    Total_donation.get('/total_data',(req,res)=>{
        var total_data=[]
        var my_data=""

        var Base=req.params.currency_base
        csvtojson().fromFile('./data.csv').then((data)=>{
            var Base="INR"
            var Give_currency=data            
            axios.get('https://api.exchangeratesapi.io/latest?base='+Base)
            .then((data)=>{
                var data_rates=data.data.rates  
                for (var i of Give_currency){                    
                    var Donation_Currency=i.Donation_Currency                    
                    for (var [key,value] of Object.entries(data_rates)){                        
                        if (Donation_Currency==key){
                            if(value<0){
                                i.Donation_Amount=i.Donation_Amount*value
                            }else{
                                i.Donation_Amount= i.Donation_Amount/value
                            }
                        }
                    }
                }
                var nonprofit_data=[]
                for(var i of Give_currency){
                    if (!nonprofit_data.includes(i.NonProfit)){
                        var count=0
                        for (j of Give_currency){
                            if (i.NonProfit==j.NonProfit){
                               if (count>0){
                                   i.Donation_Amount+=j.Donation_Amount
                                   i.Fee+=j.Fee
                                   count+=1
                               }else{
                                nonprofit_data.push(i.NonProfit)
                                count+=1
                               }
                            }
                        }
                        var data_dict={
                            "NonProfit":i.NonProfit,
                            "Total_Amount": i.Donation_Amount+" "+Base,
                            "Numbers of Donations":count,
                            "Total Fee":i.Fee
                        }
                        var index=0
                        total_data.push(data_dict)
                        csvtojson().fromFile('./Total_Donation.csv').then(source =>{
                            if(source==null){
                                var Headers="NonProfit"+","+"Total_Amount"+","+"Numbers of Donations"+","+"Total Fee"
                                my_data+=Headers
                            }                            
                            source.push(total_data[index])
                            index+=1
                            var csv=Json2csv(source)
                            var csv1=csv.toString()
                            var csv2=csv1.slice(61,140)
                            my_data+=csv2
                            fs.writeFileSync('./Total_Donation.csv',my_data)
                            console.log("data inserted into csv")
                            res.send(total_data)
                        })
                    } 
                }
            })      
        })
    })
}