
function Deniedpage() {
    return (
      <>
      <div className="h-screen wfull flex flex-col justify-center items-center bg-blue-50">
          <h1 className="text-9xl font-bold text-blue-500">403</h1>
          <div className="text-blue-500 px-2 text-sm rounded font-semibold absolute rotate-12 bg-blue-50 ">
              Request Denied ...
          </div>
         
          <button className="mt-5">
         <a href="/" className="relative inline-blue-50 text-sm text-blue-50  bg-blue-500 font-medium p-4 rounded-lg hover:text-blue-500 hover:bg-blue-50 group active:text-blue-700 focus:outline-none focus-ring">
              <span className="relative black px-4 border-current">Go Back</span>
          </a>
          </button>
  
      </div>
        
      </>
    )
  }
  
  export default Deniedpage;
  
  