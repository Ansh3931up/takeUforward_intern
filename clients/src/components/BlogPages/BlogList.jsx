import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { filterQuestionByIndex, getblog } from "../../Redux/Blog";
import { getUserData } from "../../Redux/Reducer";
import BlogCard from "../BlogCard";
import { useDebounce } from "../Hook/useDebounce";
import updateImage from "./update.jpg"; // Import the background image

function BlogList() {
    const dispatch = useDispatch();
    const filterdata = useSelector((state) => state?.question?.SingleQuestion);
    const BlogData = useSelector((state) => state?.question?.QuestionData);
    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn); 
    const role = useSelector((state) => state?.auth?.role); 
    const data = useSelector((state) => state?.auth?.data);
    console.log("fliterdat",filterdata)
    // console.log(data)
    // dispatch(getUserData());
    useEffect(() => {
        dispatch(getblog());
        dispatch(getUserData());
        
    }, [dispatch]);

    const [search, setsearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      
        dispatch(filterQuestionByIndex(searchTerm.toString()));
    }, [searchTerm, dispatch]);

    const debouncedCallBack = useDebounce((e) => setSearchTerm(e?.target?.value));

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : BlogData.length - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex < BlogData.length - 1 ? prevIndex + 1 : 0));
    };

    return (
        <div 
            className="min-h-[90vh] pt-12 overflow-auto flex flex-col gap-10 text-blue-900"
            style={{ backgroundImage: `url(${updateImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >    
            <h1 className="text-4xl font-bold text-center">Your Questions</h1>
            <header className="mb-8 m-2">
                <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
                    <input
                        type="text"
                        placeholder="Enter QuestionId"
                        onChange={(e) => debouncedCallBack(e)}
                        className="flex-1 p-2 border bg-blue-50 text-blue-500 rounded"
                    />
                    <button 
                        className="py-2 px-4 bg-blue-500 border rounded-xl text-blue-50 mt-2 md:mt-0" 
                        onClick={() => setsearch(!search)}
                    >
                        Search
                    </button>
                </div>
            </header>

            {(filterdata !== null && searchTerm) ? (
                <>
                    <h2 className="text-blue-700 m-2 text-3xl font-extrabold text-center">Filtered Question</h2>
                    <BlogCard key={filterdata?.index} data={filterdata} />
                </>
            ) : (
                <>
                    <h2 className="text-blue-700 m-2 text-3xl font-extrabold text-center">Question of the day</h2>
                    <div className="flex flex-col gap-8 w-full lg:w-3/4 mx-auto">
                        {BlogData.length > 0 && (
                            <BlogCard key={BlogData[currentIndex]?._id} data={BlogData[currentIndex]} />
                        )}
                        <div className="flex justify-between mt-4">
                            <button 
                                onClick={handlePrev} 
                                className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Prev
                            </button>
                            <button 
                                onClick={handleNext} 
                                className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}

            <div className="w-full lg:w-3/4 mx-auto my-auto">
                <div className="max-h-64 overflow-y-auto">
                    <table className="w-full min-w-max border rounded-lg bg-blue-50">
                        <thead>
                            <tr className="border-b">
                                <th className="pb-2 pt-4 text-start uppercase tracking-wide text-gray-600 border-r">ID</th>
                                <th className="pb-2 pt-4 text-start uppercase tracking-wide text-gray-600">Questions</th>
                                <th className="pb-2 pt-4 text-start uppercase tracking-wide text-gray-600">Questions Attempted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {BlogData.slice().reverse().map((user) => (
                                <tr key={user?.index} className="border-b">
                                    <td className="py-3 text-sm">
                                        <p className="text-sm font-medium text-gray-700">{user?.index}</p>
                                    </td>
                                    <td className="py-3 text-sm">
                                        <p className="text-sm font-medium text-gray-700">{user?.title}</p>
                                    </td>
                                    <td className="py-3 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-white ${data?.isSubscribed?.includes(user?.index) ? 'bg-green-500' : 'bg-red-500'}`}>
                                            {data?.isSubscribed?.includes(user?.index) ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isLoggedIn && role === "ADMIN" && (
                <Link to="/updates/create" className="text-white bg-blue-500 w-full md:w-[11%] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mb-2">
                    Create New Question
                </Link>
            )}

            {!isLoggedIn && (
                <div className="h-10"></div> // Add some space at the bottom when the user is not logged in
            )}
        </div>
    );
}

export default BlogList;
