import connectDB from "@/app/lib/mongoose";
import Ingredients from "@/app/models/ingredients";
import { NextResponse } from "next/server";



export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const input = searchParams.get('input');
        
        if (!input || input.trim().length === 0) {
          return NextResponse.json(
            { message: 'Invalid request data' },
            { status: 400 }
          );
        }
        
        await connectDB();

        const agg = [
            {
              $search: {
                index: "ingredients",
                compound: {
                  should: [
                    {
                      text: {
                        query: input,
                        path: "name",
                        fuzzy: {
                          maxEdits: 1, // Allow for one typo
                          prefixLength: input.length >= 4 ? input.length - 2 : 1 // Increase the severity as the length increases
                        },
                        score: {
                          boost: {
                            value: 5 // Increase the weight of exact matches
                          }
                        }
                      }
                    },
                    {
                      text: {
                        query: input,
                        path: "name",
                        fuzzy: {
                          maxEdits: 2, // Allowing for more inaccurate matches
                          prefixLength: 1
                        },
                        score: {
                          boost: {
                            value: 2 // Reducing the weight for less accurate matches
                          }
                        }
                      }
                    }
                  ],
                  minimumShouldMatch: 1 // We guarantee at least one match
                }
              }
            },
            {
              $limit: 10 // Limit the number of results
            }
        ];

        const result = await Ingredients.aggregate(agg);
        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
          { error: "An internal error occurred" },
          { status: 500 }
        );
    }
}
// Settings for atlas search
// {
//     "mappings": {
//       "dynamic": false,
//       "fields": {
//         "name": {
//           "analyzer": "custom_analyzer",
//           "type": "string"
//         }
//       }
//     },
//     "analyzers": [
//       {
//         "charFilters": [],
//         "name": "custom_analyzer",
//         "tokenFilters": [
//           {
//             "type": "lowercase"
//           }
//         ],
//         "tokenizer": {
//           "maxGram": 200,
//           "minGram": 2,
//           "type": "edgeGram"
//         }
//       }
//     ]
// }






export async function POST(req: Request) {
    try {
      await connectDB();
      const data = await req.json();
      if (!Array.isArray(data) || data.length === 0) {
        return NextResponse.json(
          { message: 'Invalid request data' },
          { status: 400 }
        );
      }

      for (const ingredient of data) {
        await Ingredients.create({
          name: ingredient.name,
          units: ['g','kg','ml','l','pcs'],
          count: 1,
          open_for_link: false,
          deletedAt: new Date()
        });
      }

      return NextResponse.json({ message: 'Success' });
    } catch (error) {
      console.error(error);      
      return NextResponse.json(
        { error: "An internal error occurred" },
        { status: 500 }
      );
    }
}





export async function PATCH(req: Request) {
  try {

    await connectDB();
    const toUpdate = [];

    const data = await req.json();


    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      );
    }


    for (const ingredient of data) {

      if (!ingredient.new_ingredient) {
        await Ingredients.findOneAndUpdate(
          { name: new RegExp(`^${ingredient.name.trim()}$`, 'i') },
          {
            $inc: { count: 1 },
            $set: { open_for_link: true }
          },
          { new: true }
        );
       
      } else {
        toUpdate.push(ingredient);
      }

    }
    return NextResponse.json({ message: 'Success', body: toUpdate });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'An internal error occurred' },
      { status: 500 }
    );
  }
}