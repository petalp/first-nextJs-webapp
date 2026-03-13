import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req:NextRequest){
    try{
        await connectDB()
        const formData = await req.formData()

        let event;
        try{
            event = Object.fromEntries(formData.entries())
        }catch(e){
            return NextResponse.json({message:"Invalid JSON data format"}, {status:400})
        }
        const file = formData.get("image") as File 

        if(!file) return NextResponse.json({message:"Image file require"}, {status:400})

        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
        if(!allowedTypes.includes(file.type)){
            return NextResponse.json({message:"Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed"}, {status:400})
        }

        const maxSize = 5 * 1024 * 1024 // 5MB
        if(file.size > maxSize){
            return NextResponse.json({message:"File size exceeds 5MB limit"}, {status:400})
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const uploadResult = await new Promise((resolve, reject)=>{
            cloudinary.uploader.upload_stream({resource_type:"image", folder:"DevEvent"}, (error, results)=>{
                if(error) return reject(error)
                resolve(results)
        }).end(buffer)
        })
        
        event.image = (uploadResult as {secure_url:string}).secure_url
        
        const createdEvent = await Event.create(event)
        return NextResponse.json({message:"Event created Successfully", event:createdEvent}, {status:201})
    }catch(e){
        console.error(e)
        return NextResponse.json({message:"Event creation Failed", error:e instanceof Error ? e.message : "unknown"})
    }

}


export async function GET(){
    try{
        await connectDB()
        
        const events = await Event.find().sort({createdAt:-1})
        
        return NextResponse.json({message:"Event", events})
    }catch(e){
        console.error(e)
        return NextResponse.json({message:"Event fetching failed", error: e instanceof Error ? e.message : "unknown"}, {status:500})
    }
}