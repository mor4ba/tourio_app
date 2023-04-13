//import { places } from "../../../../lib/db.js";
import Place from "../../../../db/models/Place.js";
import dbConnect from "../../../../db/connect.js";

export default async function handler(request, response) {
  await dbConnect();
  const { id } = request.query;
  if (!id) {
    return;
  }

  switch (request.method) {
    case "GET":
      const place = await Place.findById(id);
      if (!place) {
        return response.status(404).json({ status: "Not found" });
      }
      return response.status(200).json(place);
      break;
    case "DELETE":
      const placeToDelete = await Place.findByIdAndRemove(id);
      return response.status(200).json(placeToDelete);
      break;
    case "PUT":
      const placeToUpdate = await Place.findByIdAndUpdate(id, {
        $set: request.body,
      });
      return response.status(200).json(placeToUpdate);
      break;
  }
}
