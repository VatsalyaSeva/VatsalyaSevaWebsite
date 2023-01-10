type props = {
    isLoading:boolean
}

export const Loader = ({isLoading}:props)=>{
    return(isLoading ?
        <div className="flex flex-col justify-center items-center h-[100vh] w-[100vh] bg-amber-100">
            <p className="text-3xl text-red-500">Loading</p>
        </div>
        :<div></div>
    )
}