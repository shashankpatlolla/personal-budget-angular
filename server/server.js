const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3005;


//app.use('/', express.static('public'));
app.use(cors());

const budget ={
    myBudget :[
    {
        title: 'Shopping',
        budget: 100
    },
    {
        title: 'Groceries',
        budget: 200
    },
    {
        title: 'Rent',
        budget: 300
    }
]};
/* 
app.get('/hello',(req,res)=>{
    res.send('Hello World !!!');
});
*/
app.get('/budget',(req,res)=>{

    /* fs.readFile('budget-data.json', 'utf8', (error, data) => {
        if (error) {
          console.error(error);
          return res.status(500).send('Error reading budget data.');
        }
    
        try {
          const budgetData = JSON.parse(data);
          res.json(budgetData);
        } 
        catch (parseError) {
          console.error(parseError);
          res.status(500).send('Error parsing budget data.');
        }
      }); */
    res.json(budget);
});

app.listen(port,()=>{
     console.log(`App is listening at localhost:${port}`);
});