import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug
 * 
 * @param req - Next.js request object
 * @param params - Dynamic route parameters containing the slug
 * @returns JSON response with event data or error message
 */

type RouteParams = {
  params:Promise<{slug:string}>
}
export async function GET(
  req: NextRequest,
  { params }: RouteParams 
): Promise<NextResponse> {
  try {
    // Establish database connection
    await connectDB();

    // Extract and validate slug parameter
    const { slug  } = await params ;

    console.log(slug)

    // Check if slug is provided and not empty
    if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
      return NextResponse.json(
        { 
          message: "Validation error", 
          error: "Slug parameter is required and must be a non-empty string" 
        },
        { status: 400 }
      );
    }

    // Sanitize slug (remove leading/trailing whitespace and hyphens)
    const sanitizedSlug = slug.trim().replace(/^-+|-+$/g, "").toLowerCase();

    // Query database for event with matching slug
    const event = await Event.findOne({ slug: sanitizedSlug }).lean();

    // Handle case where event is not found
    if (!event) {
      return NextResponse.json(
        { 
          message: "Event not found", 
          error: `No event exists with slug: ${sanitizedSlug}` 
        },
        { status: 404 }
      );
    }

    // Return successful response with event data
    return NextResponse.json(
      { 
        message: "Event retrieved successfully", 
        event 
      },
      { status: 200 }
    );

  } catch (error) {
    // Handle Mongoose-specific errors
    if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json(
        { 
          message: "Invalid slug format", 
          error: "The provided slug contains invalid characters" 
        },
        { status: 400 }
      );
    }

    // Handle database connection errors
    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        { 
          message: "Database error", 
          error: "Failed to connect to database or execute query" 
        },
        { status: 503 }
      );
    }

    // Log unexpected errors for debugging
    console.error("Unexpected error in GET /api/events/[slug]:", error);

    // Return generic error response for unexpected errors
    return NextResponse.json(
      { 
        message: "Internal server error", 
        error: "An unexpected error occurred" 
      },
      { status: 500 }
    );
  }
}
