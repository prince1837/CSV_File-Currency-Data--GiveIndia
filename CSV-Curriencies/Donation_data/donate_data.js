module.exports=(donate_data,Json2csv,fs,csvtojson)=>{
    donate_data.post('/post_data',(req,res)=>{
        var datetime = new Date()
        var date=datetime.toISOString().slice(0,10)

        var Order_id = "DE129f";
        var char_list = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        for(var i=0; i<9; i++){
            Order_id += char_list.charAt(Math.floor(Math.random() * char_list.length-1))
        }
        var Donation_data={  
            'Current_Date':date,
            "Order_Id":Order_id,
            'NonProfit':req.body.NonProfit,
            'Fee':req.body.Fee,
            'Donation_Currency':req.body.Donation_Currency,
            'Donation_Amount':req.body.Donation_Amount
        }
        csvtojson().fromFile('./Csv_File/data.csv').then(source =>{
            if(source==null){
                source.push("Current_Date","Order_Id","NonProfit","Donation_Currency","Donation_Amount",'Fee')
            }
            source.push(Donation_data)
            var csv=Json2csv(source,{fields:['Current_Date','Order_Id','NonProfit','Donation_Currency','Donation_Amount','Fee']});
            fs.writeFileSync('./Csv_File/data.csv',csv)
            csvtojson().fromFile('./Csv_File/data.csv').then(data=>{
                console.log(data)
                res.send(data)
            })
        })
    })
}

