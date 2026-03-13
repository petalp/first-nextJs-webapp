import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";

const bookings = 10

const EventDetailItem = ({icon, alt, label}:{icon:string, alt:string, label:string})=>{
   return(
    <div className="flex-row-gap-2 items-center">
        <Image src={icon} alt={alt} width={17} height={17}/>
        <p>{label}</p>
    </div>
   ) 
}

const EventAgenda = ({agendaItems}:{agendaItems:string []}) =>(
    <div className="agenda">
        <h2>Agenda</h2>

        <ul>
            {agendaItems.map(item =>(
                <li key={item}>{item}</li>
            ))}
        </ul>
    </div>
)

const EventTags = ({tags}:{tags:string []})=>(
    <div className="flex flex-row gap-1.5 flex-wrap">
        {tags.map(tag=>(
            <div key={tag}>{tag}</div>
        ))}
    </div>
)

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetialsPage = async ({params}:{params:Promise<{slug:string}>})=>{
    const {slug} = await params
    const request = await fetch(`${BASE_URL}/api/events/${slug}`)
    const {event} = await request.json()
    
    if(!event) return notFound();
    return (
        <section id="event">
            <div className="header">
                <h1>Event Description</h1>
                <p className="mt-2">{event.description}</p>
            </div>

            <div className="details">
                {/* left side -Event Content */}

                <div className="content">
                    <Image src={event.image} alt={event.title} width={800} height={800} className="banner" />

                    <section className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{event.overview}</p>
                    </section>

                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={event.date}/>
                        <EventDetailItem icon="/icons/clock.svg" alt="clock" label={event.time}/>
                        <EventDetailItem icon="/icons/pin.svg" alt="pin" label={event.location}/>
                        <EventDetailItem icon="/icons/mode.svg" alt="mode" label={event.mode}/>
                        <EventDetailItem icon="/icons/audience.svg" alt="audience" label={event.audience}/>
                    </section>

                    <EventAgenda agendaItems={JSON.parse(event.agenda[0])}/>

                    <section className="flex-col-gap-2">
                        <h2>About the Organizer</h2>
                        <p>{event.organizer}</p>
                    </section>

                    <EventTags tags={JSON.parse(event.tags[0])} />
                </div>

                

                {/* Right side  */}
                <aside className="booking">
                    <div className="signup-card">
                        <h2>Book Your Spot</h2>
                        {bookings > 0 ? (
                            <p className="text-sm">
                                Join {bookings} people who have already booked their spot!
                            </p>
                        ):(
                            <p className="text-sm">Be the first to book your spot</p>
                        )}
                        <BookEvent />
                    </div>

                </aside>
            </div>
        </section>
    )
}

export default EventDetialsPage