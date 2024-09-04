

export default function SkeletonLoader() {

    const lightColor = "bg-white"
    const darkColor = "bg-gray-700"

    return (
        <div className={`flex flex-col items-center h-auto`}>
        <div role="status" className={`flex h-auto  flex-col justify-evenly m-5 mt-16 w-[85%] ml-14 animate-pulse`}>
            <div className={`h-[4rem] max-w-[21rem] ${lightColor} rounded dark:${darkColor} w-3/4 mb-4`}></div>
            <div className={`h-[24px] max-w-[32rem]  ${lightColor} rounded dark:${darkColor} mb-2.5`}></div>

            <div className={`h-auto mt-3 mb-2 justify-between  w-full flex flex-row`}>
                <div className={`h-[2.5rem] w-[32rem] ${lightColor} rounded dark:${darkColor} mb-2.5`}></div>

                <div className={`h-[2.5rem] w-[5rem] ${lightColor} rounded dark:${darkColor}`}></div>
            </div>

            <div className={`h-[2px] w-full ${lightColor} rounded dark:${darkColor}  mb-2.5`}></div>
            <div className={`h-[2.5rem] mb-3 w-[5rem] ${lightColor} rounded dark:${darkColor}`}></div>

            <div className={`w-full flex h-[10rem]`}>
                <div className={`h-[7.625rem] mr-7 w-1/2 ${lightColor} rounded dark:${darkColor}  mb-2.5`}></div>
                <div className={`h-[7.625rem] w-1/2 ${lightColor} rounded dark:${darkColor}  mb-2.5`}></div>
            </div>
            <span className={`sr-only`}>Loading...</span>
        </div>
        </div>


    );
}