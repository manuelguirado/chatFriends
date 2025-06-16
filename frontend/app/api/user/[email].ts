import { handleUserByEmail } from "@/lib/utils/handleUser";
export default async function handler(req: any, res: any) {
 if (req.method === "GET") {
   const { email } = req.query;
   if (!email) {
     return res.status(400).json({ error: "Email is required" });
   }

   const userResponse = await handleUserByEmail(email);
   if (userResponse.error) {
     return res.status(404).json({ error: userResponse.error });
   }

   return res.status(200).json(userResponse);
 }


}
