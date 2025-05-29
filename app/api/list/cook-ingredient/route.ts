import connectDB from "@/app/lib/mongoose";
import ListIngredients from "@/app/models/list";
import { NextResponse } from "next/server";
import _ from "lodash";





export async function PATCH(request: Request) {
    try {
        const dataUnit = await request.json();
        const { connection_id, name, units } = dataUnit;

        if (!connection_id || !name || !units ) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

        await connectDB();

        const document = await ListIngredients.findOne({ connection_id, name });

        if (!document) {
            return Response.json({ error: 'Document not found' }, { status: 404 });
        }

        const updatedDoc = await ListIngredients.findOneAndUpdate(
            { connection_id, name:name.trim() },
            { 
                $push: { units: units } 
            },
            { new: true } 
        );        

        if (!updatedDoc) {
            return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
        }

        return NextResponse.json({unit:updatedDoc.units[updatedDoc.units.length - 1], _id:updatedDoc._id}, { status: 200 });

    } catch (error) {
        console.log(error)
         return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}




export async function POST(request: Request) {
    try{
        const dataUnit = await request.json();
        
        if (!dataUnit.connection_id || !dataUnit.name) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }
        
        await connectDB();

        const newIngredient = new ListIngredients(dataUnit);
        await newIngredient.save();


        // if detailed error handling is required
        // try {
        //     await newIngredient.save();
        // } catch (saveError) {
        //     console.error(saveError);
        //     return NextResponse.json(
        //         { error: 'Failed to save new ingredient' },
        //         { status: 500 }
        //     );
        // }


        // const filteredData = _.omit(_.cloneDeep(newIngredient.toObject()), ["connection_id", "updatedAt", "createdAt", "__v"]);
        const { connection_id, updatedAt, createdAt, __v, ...filteredData } = newIngredient.toObject();


        return NextResponse.json(filteredData, { status: 201 });

    }catch(error){
        console.error(error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );

    }

}