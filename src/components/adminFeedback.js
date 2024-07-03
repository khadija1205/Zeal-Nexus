import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import noteContext from '../context/noteContext';

export const AdminFeedback = () => {
  let bodykadata=[]
  const navigate = useNavigate();
  const { state, dispatch } = useContext(noteContext);
  const [newds,setnewds]=useState()

  useEffect(() => {
    if(localStorage.getItem('admintoken')){
      dothis()
      getalldata()
    }else{
      dothis()
      navigate("/adminsignin")
    }  
  },[]);

  function dothis(){
    dispatch({ type: 'UPDATE_VALUE', payload: false });
  dispatch({ type: 'UPDATE_AVALUE', payload: true });
   }

   let rott=360
   const reloadhistory=async(e)=>{
    console.log("not hapeening")
    let elly=document.getElementById('tero')
    
    elly.style.transform = `rotate(${rott}deg)`;
    rott=rott+360
    const tempv= await getalldata();
   }

  const getalldata=async (e)=>{
    const response=await fetch(`http://${state.backend}:${state.port}/api/ad/allfeedback`,{
        method:'get',
        headers:{
            'Content-Type':'application/json',
            'auth-token':localStorage.getItem('admintoken')
        },
        
    });
    let json=await response.json();
    let elly=document.getElementById('tbody')
    if(json.response){
    console.log(json)
    for(let i=0;i<parseInt(json.allfeedback.length);i++){
      let title=json.allfeedback[i].title
      let message=json.allfeedback[i].message
         
      bodykadata.push(<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <th scope="row" className="px-48 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {title}
      </th>
      <td className="px-48 py-4">
         {message}
      </td>
  </tr>)
  
    }
    setnewds(bodykadata)
   
    }
    else{}
  
  
  }

  return (
    <>
    <div className="downward">
    <div className="one two fourth justify-content-center calcby">
  
      
    <div className='relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border h100 p-4'>
  
  
  <div className="relative sm:rounded-lg">
      <div className='reloadhistorydiv'>
  <p className="w-full p-2 text-lg font-semibold text-gray-900 bg-white dark:text-white dark:bg-gray-800 text-center">
             Feedback
          </p>
          <div className="sbTnsdiv">
           
          {/* <button className="text-black bg-gray-100 hover:bg-gray-200  focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:focus:ring-gray-500" id='addcompid' onClick={plusclicked} data-bs-toggle="modal" data-bs-target="#addnewcompform">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
   <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
 </svg>
  
  </button> */}
  <button className="text-black bg-gray-100 hover:bg-gray-200  focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:focus:ring-gray-500" id='refdiv' onClick={reloadhistory}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise trotate" id='tero' viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
  </svg>
  
  </button>
  </div>
          </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                  <th scope="col" className="px-48 py-3">
                     Title
                  </th>
                  <th scope="col" className="px-48 py-3">
                      Message
                  </th>
              </tr>
          </thead>
          <tbody id='tbody' >
          
         
              {bodykadata}
            {newds}
          </tbody>
      </table>
  </div>
  
  </div>
    </div>
    </div>
    </>
   )
}
