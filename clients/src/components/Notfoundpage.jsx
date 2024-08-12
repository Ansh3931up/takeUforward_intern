import { Link, useNavigate } from "react-router-dom";

function Notfoundpage() {
  const navigate=useNavigate();
  return (
    <>
    <div className="h-screen wfull flex flex-col justify-center items-center bg-blue-50">
        <h1 className="text-9xl font-bold text-blue-500">404</h1>
        <div className="text-blue-500 px-2 text-sm rounded font-semibold absolute rotate-12 bg-blue-50 ">
            Page not found ...
        </div>
       
        <button className="mt-5" onClick={()=>navigate(-1)}>
       <Link to="/" className="relative inline-blue-50 text-sm text-blue-50  bg-blue-500 font-medium p-4 rounded-lg hover:text-blue-500 hover:bg-blue-50 group active:text-blue-700 focus:outline-none focus-ring">
            <span className="relative black px-4 border-current">Go Back</span>
        </Link>
        </button>

    </div>
      
    </>
  )
}

export default Notfoundpage;

