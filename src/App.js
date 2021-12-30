import React, { useEffect, useState } from 'react'; 
import './App.css'; 
import Axios from "axios"
import {BrowserRouter, Link, Route, Routes, Switch, useSearchParams} from 'react-router-dom'
import { Table } from "reactstrap";
import {Bar} from 'react-chartjs-2';
import {Line} from 'react-chartjs-2';  

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale, 
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js' 

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
) 
function App() {
  const [covidVacStatus, setcovidVacStatus] = useState("");
  const [covidCaseNumStatus, setcovidCaseNumStatus] = useState("");
  const [condition, setCondition] = useState(false);
  const [condition1, setCondition1] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [DataRdy, setDataRdy] = useState(false);
  const [isLoadingArchive, setLoadingArchive] = useState(true);
  // let condition = false;
  const CovidArrdata = condition1? covidCaseNumStatus.result.records.map((s,index) => {
    return { 
      pr_date: [s.pr_date ] ,
      count_of_case: [s.count_of_case ] 
    };
  } ): [];
  const [CovidgetSumDataYest, setCovidgetSumDataYest] = useState(0);
  const [CovidgetSumDataTdy, setCovidgetSumDataTdy] = useState(0);
  const [getDate, setGetDate] = useState("");
  const [getArchive, setGetArchive] = useState([]);
  const [getArchiveSum, setGetArchiveSum] = useState(0); 
  console.log(getDate)
  var j=0;

  const showCovidVacStatus = () =>{
    Axios.get("https://data.gov.sg/api/action/datastore_search?resource_id=60c679fc-8c3c-49dc-beaf-95008619d5df&limit=100").then((response)=>{
      console.log(response.data); 
      setcovidVacStatus(response.data);
      setCondition(true);
    }) 
  } 
 
  const getCovidCases = () => {
  
    return condition1? covidCaseNumStatus.result.records.map((s,index) => { 
      
      return {
        label: [s.age_group, s.pr_date ],
        data: [s.count_of_case ],
        backgroundColor:s.age_group=="12 - 19 years old"?"#f38b4a":s.age_group=="20 - 39 years old"?'rgba(0, 0, 0, 0.1)':s.age_group=="40 - 59 years old"?'rgb(255, 205, 86)': s.age_group=="60 - 69 years old"?'rgb(255, 99, 132)': s.age_group=="70 years old and above"? 'rgba(75,192,192,1)':'#54ACEF',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2
      };
    }): [];
  };
  console.log(condition1? covidCaseNumStatus.result.records.map((s,index) => {
    // console.log(s.age_group); 
    return {
      pr_date: [s.pr_date] ,
      count_of_case: [s.count_of_case ],

    };
  }): []);

  const getCovidCasesAPI =()=>{    
    Axios.get("https://data.gov.sg/api/action/datastore_search?resource_id=6c14814b-09b7-408e-80c4-db3d393c7c15&limit=1000").then((response)=>{
    console.log(response.data);  
    setcovidCaseNumStatus(response.data);
    setCondition1(true);
    setLoading(false); 
    setDataRdy(true)
  }) 
  
}

const setPostReqAPI = ()=>{
  const promises = covidCaseNumStatus.result.records.map(paramKey => Axios.post("https://covid19sgtracker.herokuapp.com/create", {
    pr_date:[paramKey.pr_date],
    age_group:[paramKey.age_group],
    count_of_case: [paramKey.count_of_case] 
      }) 
    );
    
    window.location.reload();
    CovidgetSumDataYest == "Did not managed to retrieve data, press button again" ? alert("Unsuccessfull")  :  alert("Saved Successfully") 
}

  const getAccCovidCases =()=>{  

      var yesterday = new Date(Date.now() - 86400000);
      // console.log(JSON.stringify(CovidArrdata[111].pr_date).substring(10, 12)== JSON.stringify(yesterday.getDate()) ) 
      const totalyest = CovidArrdata.reduce((total, meal) => 
      JSON.stringify(meal.pr_date).substring(10, 12) === JSON.stringify(yesterday.getDate())? 
      total += parseInt(meal.count_of_case) : total, 0);
      console.log(totalyest)
      totalyest == 0 ? setCovidgetSumDataYest("Did not managed to retrieve data, press button again") : setCovidgetSumDataYest(totalyest);

      var today = new Date(Date.now());
      console.log(JSON.stringify(today.getDate())) 
      const totaltdy = CovidArrdata.reduce((total, meal) => 
      JSON.stringify(meal.pr_date).substring(10, 12) === JSON.stringify(today.getDate())? 
      total += parseInt(meal.count_of_case) : total, 0);
      console.log(totaltdy)
      totaltdy == 0 ? setCovidgetSumDataTdy("Unavailable now, check back again later") :  setCovidgetSumDataTdy(totaltdy)  
  }
  const [msgflag,setMsgflag]= useState(true);
  async function getArchiveData () {
      const response  =  await Axios.get(`https://covid19sgtracker.herokuapp.com/archive/${getDate}`) 
       
      console.log(response.data )
      setGetArchive(response.data)
      setLoadingArchive(false)  
      if(msgflag){
        alert("Fetching data...")
        setMsgflag(false);
      }
  }
  
  const showArchiveData =()=>{
    const totalArchiveData = getArchive.reduce((total, meal) =>  
    total += parseInt(meal.count_of_case) , 0);
   
    console.log(totalArchiveData)
    setGetArchiveSum( totalArchiveData );
  }
  // if (isLoading) {
  //   return <div className="App"> 
  //    <h1>Covid-19 Tracker</h1> 
  //   </div>;
  // }
  // if(!DataRdy){
  //   return <div className="App">Loading...</div>;
  // } 
  return (
     
      <div className="wrapper">

        <div>
         
          <h3>Date and Time: {`${new Date().toLocaleString()}`}</h3>  
           
        </div> 
          <button className='button' onClick={showCovidVacStatus}> Show Covid Vaccination Statuses</button>

          <div>
          {/* <ReactTable />   */}
          <Table> 
            <thead>
              <tr>
                <th></th>  
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><h4>{condition && "Unvacinnated Status"}</h4></td>
                {condition && covidVacStatus.result.records.map((item)=>{
              return <td> 
                 <div> Age: {'\n'} 
                <b>{item.age}</b>; {'\n'}</div>
                <div>Completed Full Regimen: {'\n'} 
                <b>{item.completed_full_regimen}</b>;  {'\n'}  </div> 
                <div> Unvaccinated: {'\n'} 
                <b>{item.unvaccinated}</b>; </div>  
                </td>;
            })}
              </tr>
            </tbody>
          </Table>
            
          </div>
            {/* <button onClick={showCovidCaseNumStatus}> Show Covid Cases Graph</button>  */}
            <div > 
            <div > 
            <button className='button' onClick={getCovidCasesAPI}> Retrieve Covid Stats first</button> 
            </div>
            <h1></h1>
            <button className='button'  onClick={getAccCovidCases}>Double Click to show Covid stats Retrieved</button>  
            <Table > 
              
            <thead >  
                <th ><h2 >{CovidgetSumDataYest==0?"":"Total Covid Cases Yesterday"}  </h2></th>   
                <th><h2 > {CovidgetSumDataYest==0?"":"Total Covid Cases Today"} </h2></th>  
            </thead>
            <tbody>
              <tr>
                
                <td><h2 style={{ marginTop:"1px", textAlign:"center", color: "red"} }>   {CovidgetSumDataYest==0?"": condition1 && CovidgetSumDataYest}</h2></td> 
                <td><h2 style={{ marginTop:"1px", textAlign:"center" , color: "red"}}>  {  CovidgetSumDataTdy==0?"": condition1 && CovidgetSumDataTdy}</h2></td>
              </tr>
            </tbody>
            </Table>
            <h3>Save stats to database</h3>
            <button className='button'  onClick={setPostReqAPI}> Save</button> 

            <h3><label for="start">Select date:</label>
              <h3> 
                <input type="date" id="start" name="trip-start" 
                      min="2018-01-01" max="2025-12-31" onChange={(event)=> {setGetDate(event.target.value)}}/>
                {'\n'}
                
                <button className='button'  onClick={getArchiveData}> Retrieve Archived Data</button>  </h3>
                <button className='button'  onClick={showArchiveData}> Show Archived numbers </button>   
                </h3>
            <Table > 
              
              <thead >
                  <th><h2 style={{ marginTop:"0px"}}>{getArchiveSum==0?"":"Total Covid Cases as of"} {!getDate?"":getDate}</h2></th>     
              </thead>
              <tbody>
                <tr> 
                  <td><h2 style={{ marginTop:"1px", textAlign:"center", color: "red"} }>   {getArchiveSum==0? "": isLoadingArchive? <div className="App">Loading...</div> : getArchiveSum }</h2></td>  
                </tr>
              </tbody>
              </Table>

            </div>
          <div>
        <Bar
          data={{  labels: [ 'Covid-19 cases'],
          datasets: [...getCovidCases()]
        }}
        height={200}
        width={300} 
          options={{
            title:{
              display:false,
              text:' ',
              fontSize:20
            },
            legend:{
              display:false,
              position:'right'
            },
            plugins: {
              legend: false // Hide legend
          },
          scales: {
              y: {
                  display: true // Hide Y axis labels
              },
              x: {
                  display: true // Hide X axis labels
              }
          }   
          }}
        />
      </div>  
      </div> 
  );
}

export default App;
