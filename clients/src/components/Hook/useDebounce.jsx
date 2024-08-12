export function useDebounce(cb,delay=1500){
    let timerid;

    return((...args)=>{
        clearTimeout(timerid);
        timerid=setTimeout(()=>{

        cb(...args)
        },delay)
    })

}