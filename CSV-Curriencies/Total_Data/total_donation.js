module.exports=(Total_donation,axios,csvtojson,createCsvWriter)=>{
    Total_donation.get('/total_data/:base',(req,res)=>{
        var total_data=[]
        var Base=req.params.currency_base
        csvtojson().fromFile('./Csv_File/data.csv').then((data)=>{
            var Base=req.params.base;
            var Give_currency=data            
            axios.get('https://api.exchangeratesapi.io/latest?base='+Base)
            .then((data)=>{
                var data_rates=data.data.rates  
                for (var i of Give_currency){                    
                    var Donation_Currency=i.Donation_Currency                    
                    for (var [key,value] of Object.entries(data_rates)){                        
                        if (Donation_Currency==key){
                                i.Donation_Amount=i.Donation_Amount/value
                        }
                    }
                }
                var nonprofit_data=[]
                for(var i of Give_currency){
                    if (!nonprofit_data.includes(i.NonProfit)){
                        nonprofit_data.push(i.NonProfit)
                        var count=0
                        for (j of Give_currency){
                            if (i.NonProfit==j.NonProfit){
                               if (count>0){
                                   i.Donation_Amount+=j.Donation_Amount
                                   i.Fee+=j.Fee
                                   count+=1
                               }else{
                                count+=1
                               }
                            }
                        }
                        var data_dict={
                            "NonProfit":i.NonProfit,
                            "Total_Amount": i.Donation_Amount+" "+Base,
                            "Numbers_of_Donations":count,
                            "Total_Fee":i.Fee
                        };
                        var csv_Writer = createCsvWriter({
                            path: "./Csv_File/Total_Donation.csv",
                            header: [
                                { id: "NonProfit", title: "Nonprofit" },
                                { id: "Total_Amount", title: "Total Amount" },
                                { id: "Numbers_of_Donations", title: "Numbers of Donations"},
                                { id: "Total_Fee", title: "Total Fee"}
                              ]
                          });
                        total_data.push(data_dict)
                        csv_Writer.writeRecords(total_data)
                        .then(() => {
                            console.log("Data inserted Sucessfully in CSV file");
                            res.send(total_data);
                        })
                    } 
                }
            })      
        })
    })
}
