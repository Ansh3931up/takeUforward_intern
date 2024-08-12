import { useDispatch, useSelector } from 'react-redux'; 
import { Link, useNavigate } from 'react-router-dom';

import {  removeBlog } from '../Redux/Blog';
import { addquestion } from '../Redux/Reducer';

function BlogCard({ data }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); 
    const role = useSelector((state) => state.auth.role); 

    const handleRead = (id) => {
        dispatch(addquestion(id));
        navigate('/updates/description', { state: { ...data } }) 
    };
    const handleRemove = (id) => {  
        dispatch(removeBlog({ id: id })); 
    };

    return (
        <div className={`flex w-full  bg-blue-900  border rounded-xl shadow-lg text-blue-50`}>
            <div className="p-5 w-2/3">
                <Link to={`/blog/description/${data?._id}`} className="block mb-2 text-xl font-bold text-blue-50">
                    {data?.title}
                </Link>
                {/* <p className="mb-4 text-blue-300">{truncateDescription(data?.description, 100)}</p> */}
                <div className="flex justify-between">
                    <button 
                        type="button" 
                        className="text-white bg-blue-500 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mb-2"
                        onClick={() => handleRead(data?.index)}// aslo add an event off handleread
                    >
                        Read More
                    </button>
                    {isLoggedIn && role === "ADMIN" && (
                        <button 
                            type="button" 
                            onClick={() => handleRemove(data?._id)}
                            className="text-white bg-blue-500 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mb-2"
                        >
                            Remove
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BlogCard;
