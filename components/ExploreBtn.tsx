"use client"
import Image from "next/image"



const ExploreBtn = ()=>{
    return(
        <button type="button" id="explore-btn" className="mt-7 mx-auto" onClick={()=>console.log("clicl")}>
            <a href="#events">Explore Event</a>
            <Image src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24}></Image>
        </button>
    )
}

export default ExploreBtn