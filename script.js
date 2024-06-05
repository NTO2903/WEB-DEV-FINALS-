
getCurrencies()
const chart = document.getElementById('Chart')
const currencies = []
let new_chart = new Chart(chart, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Value',
        data: [],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });

function extractNumbers(str) {
    let numbers = "";
    for (let i = 0; i < str.length; i++) {
        if (!isNaN(str[i]) || str[i]=='.') {
            numbers += str[i];
        }
    }
    return numbers
}


function acceptRequest(){
    const notification_frame = document.getElementById('NotificationFrame')
    const notification_name = document.getElementById('NotificationMessage_Name')
    const notification_currency = document.getElementById('NotificationMessage_Currency')
    const notification_amount = document.getElementById('NotificationMessage_Amount')
    const self_id = document.getElementById('Name')
    const self_currency = document.getElementById('Profile')
    let value = document.getElementById(notification_currency.innerText).innerText
    value = parseFloat(extractNumbers(value))
    let value2 = parseFloat(notification_amount.innerText)
    let convert = 1 * value
    let send_convert = convert * value2  
    
    putData(notification_name.innerText,send_convert,self_currency.innerText)
    
}



function profileWebsocket(data){
    const notification_frame = document.getElementById('NotificationFrame')
    const notification_message = document.getElementById('NotificationMessage_Message')
    const notification_name = document.getElementById('NotificationMessage_Name')
    const notification_message2 = document.getElementById('NotificationMessage_Message2')
    const notification_currency = document.getElementById('NotificationMessage_Currency')
    const notification_message3 = document.getElementById('NotificationMessage_Message3')
    const notification_amount = document.getElementById('NotificationMessage_Amount')
    const conn = new WebSocket('ws://localhost:8080/login')
        conn.addEventListener('open',()=>{
            conn.send(JSON.stringify(data))
            conn.addEventListener('message',(msg)=>{
                let sender = JSON.parse(msg.data)
                notification_frame.style.display = 'flex'
                notification_message.innerText = `REQUEST TRADE FROM USERNAME:`
                notification_name.innerText = sender.sender
                notification_message2.innerText = "CURRENCY:"
                notification_currency.innerText = sender.currency
                notification_message3.innerText = "AMOUNT"
                notification_amount.innerText = sender.amount
               
                
            })
        })
}


async function tradeWebsocket(){
    const conn2 = new WebSocket('ws://localhost:8080/trade')
    const trading_frame = document.getElementById('TradingFrame')
    const amount = document.getElementById('Amount_field').value
    const user_name = document.getElementById('Name')
    const user_currency = document.getElementById('Profile')
    conn2.addEventListener('open',()=>{
        
        console.log('Trade Initiated')

        conn2.addEventListener('message',(msg)=>{
        
            message = JSON.parse(msg.data)
            trading_frame.innerHTML = ''
            trading_frame.style.display = 'flex'
            message.forEach((users)=>{ 
                const newDiv = document.createElement('div')
                if(users.name != user_name.innerText){
                    newDiv.style = 'color: white; margin: 10px;'
                    newDiv.innerText = users.name
                    trading_frame.appendChild(newDiv)
                    newDiv.addEventListener('click',async (e)=>{
                        const notif_message = {
                            sender: user_name.innerText,
                            reciever: e.target.innerText,
                            currency: user_currency.innerText,
                            amount: amount
                        }
                        conn2.send(JSON.stringify(notif_message))
                    })
                }
                

            })

        })
        
    })

}



async function showChart(data,key,currency){
    
    const chart_frame = document.getElementById('ChartFrame')  
    chart_frame.style.display = 'flex'
    new_chart.config.data.labels = [data[29]['date'], data[28]['date'], data[27]['date'], data[26]['date'], data[25]['date'], data[24]['date']
    ,data[23]['date'], data[22]['date'], data[21]['date'], data[20]['date'], data[19]['date'], data[18]['date']
    ,data[17]['date'], data[16]['date'], data[15]['date'], data[14]['date'], data[13]['date'], data[12]['date']
    ,data[11]['date'], data[10]['date'], data[9]['date'], data[8]['date'], data[7]['date'], data[6]['date']
    ,data[5]['date'], data[4]['date'], data[3]['date'], data[2]['date'], data[1]['date'], data[0]['date']
    ]
    new_chart.config.data.datasets[0].data = [1/data[29][currency][key], 1/data[28][currency][key], 1/data[27][currency][key], 1/data[26][currency][key], 1/data[25][currency][key], 1/data[24][currency][key]
    ,1/data[23][currency][key], 1/data[22][currency][key], 1/data[21][currency][key], 1/data[20][currency][key], 1/data[19][currency][key], 1/data[18][currency][key]
    ,1/data[17][currency][key], 1/data[16][currency][key], 1/data[15][currency][key], 1/data[14][currency][key], 1/data[13][currency][key], 1/data[12][currency][key]
    ,1/data[11][currency][key], 1/data[10][currency][key], 1/data[9][currency][key], 1/data[8][currency][key], 1/data[7][currency][key], 1/data[6][currency][key]
    ,1/data[5][currency][key], 1/data[4][currency][key], 1/data[3][currency][key], 1/data[2][currency][key], 1/data[1][currency][key], 1/data[0][currency][key]
    ]
    new_chart.config.data.datasets[0].label = key
    new_chart.update()

    
}

function loginSignup(option){
    const first_frame = document.getElementById('FirstFrame')
    const signup_frame = document.getElementById('SigninFrame')
    const login_frame = document.getElementById('LoginFrame')

    if(option === 'Sign Up'){
        login_frame.style.display = 'None'
        first_frame.style.display = 'None'
        signup_frame.style.display = 'flex'
    }
    else if(option === 'Log In'){
        signup_frame.style.display = 'None'
        first_frame.style.display = 'None'
        login_frame.style.display = 'flex'
    }
}



async function getCurrencies(...args){

    const currency_list = document.getElementById('CurrencyList')
    contentCurrency = await fetchData_currencies()

    if(args != 0){
        contentPrice = await fetchData_currencies(args)
        currency_list.innerHTML = ''
        
        for (let key in contentPrice){
            if(contentPrice.hasOwnProperty(key)){
                value = contentPrice[key]
        
                for(let key2 in value){
                    if(value.hasOwnProperty(key2)){
                    price = value[key2]
                    if(key2 < 10){
                        continue
                    }
                    
                    newList = document.createElement('li')
                    newList.style = 'color: rgb(250, 235, 215); margin-bottom: 10px; margin-right: 10px; cursor: pointer;'
                    newList.addEventListener('click', async e => {
                        timeData = await fetchData_currencies('Date',args)
                        latestTime = await fetchData_currencies(args)

                        showChart(timeData,key2,args)
                    })
                    newList.innerText = `${key2}: ${1/price}`
                    newList.id = key2
                    currencies.push(newList)
                
                    currency_list.appendChild(newList)
                }
                }
            
            }
        }
    }
    else{
    currency_list.innerHTML = ''
    for (let key in contentCurrency){
        if(contentCurrency.hasOwnProperty(key)){
            value = contentCurrency[key]
            if(value === ""){
                continue
            }
            
            newList = document.createElement('li')
            newList.style = 'color: rgb(250, 235, 215); margin-bottom: 10px; margin-right: 10px;'
        
            newList.innerText = `${key.toUpperCase()}: ${value}`
            
            currency_list.appendChild(newList)
        }
    }
    }
}


async function fetchData_login(){
    try{
        const username = document.getElementById('UsernameField_Log').value
        const password = document.getElementById('PasswordField_Log').value
        const LoginFrame = document.getElementById('LoginFrame')
        const Dashboard = document.getElementById('DashboardFrame')
        const Profile = document.getElementById('Profile')
        const Name = document.getElementById('Name')

        const response = await fetch(`https://getpantry.cloud/apiv1/pantry/ed2d4387-3dbf-41eb-aaa8-42df140945b7/basket/${username}`)
        
        if(!response.ok){
            window.alert('USER DOES NOT EXIST')
            throw new Error("Could not find resource")
        }
        else{
        const data = await response.json()
        
            if(password != data.password){
                window.alert('WRONG PASSWORD')
                return
            }
            else{
                profileWebsocket(data)
                LoginFrame.style.display = 'none'
                Profile.innerText = data.def_currency
                Name.innerText = data.name
                Dashboard.style.display = 'flex'
            }
    }
        
    }
    catch(error){
        console.log(error)
    } 
}

async function fetchData_currencies(...args){
    try{
        const response = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json")
        if(args != 0){
            if(args[0] === 'Date'){
                const reqArray = []
                const date = new Date()
                let day = date.getDate()-1
                let month = date.getMonth()+1

                if (day < 10){
                    day = '0' + day
            
                }
                if (month < 10){
                    month = '0' + month
            
                }
                
                for(let i = 30; i > 0;i--){
                    
                    const response3 = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-${month}-${day}/v1/currencies/${args[1]}.json`)
                    const data3 = await response3.json()
            
                    reqArray.push(data3)

                    day -=1
                    if (day < 10 && day > 0){
                        day = '0' + day
                    }
                    else if(day<=0){
                        day = 30
                        month -= 1
                        month = '0' + month
                    }
                
                }
    
            
                return reqArray

            }
            const response2 = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${args}.json`)
            const data2 = await response2.json()
            return data2
        }
        if(!response.ok){
            throw new Error("Could not find resource")
        }
        const data = await response.json()
       

        return data
        
    }
    catch(error){
        console.log(error)
    } 
}


async function postData_signup(){
    try{
        
        const username = document.getElementById('UsernameField').value
        const password = document.getElementById('PasswordField').value
        const def_currency = document.getElementById('CurrencyField').value
        const FormData = {
            name:username,
            password:password,
            def_currency:def_currency,
            balance:0,
            new_balance:[]

        }
    
        const response = await fetch(`https://getpantry.cloud/apiv1/pantry/ed2d4387-3dbf-41eb-aaa8-42df140945b7/basket/${username}`,{
            method:'POST',
            headers:{"Content-Type":'application/json'},
            body:JSON.stringify(FormData)
        })
        
        if(!response.ok){
            throw new Error("Could not find resource")
        }
        const data = await response

        console.log(data)
        
    }
    catch(error){
        console.log(error)
    } 
}

async function putData(name,amount,currency){
    try{
        const currency_name = currency
        const balance_amount = {} 
        balance_amount[currency_name] = amount
        const FormData = {
            new_balance: []
        }
        FormData.new_balance.push(balance_amount)
        const response = await fetch(`https://getpantry.cloud/apiv1/pantry/ed2d4387-3dbf-41eb-aaa8-42df140945b7/basket/${name}`,{
            method:'PUT',
            headers:{"Content-Type":'application/json'},
            body:JSON.stringify(FormData)
        })
        
        if(!response.ok){
            throw new Error("Could not find resource")
        }
        const data = await response

        console.log(data)
        
    }
    catch(error){
        console.log(error)
    } 
}
