// // Check payload
// export const checkPayload = async (req,res,next) => {
//     if(req.headers['content-length'] > 0){
//         return res.status(400).send('');
//     }
// };

// // Check params
// export const checkParam = async (req,res,next) => {
//     if (req.query && Object.keys(req.query).length > 0) {
//         return res.status(400).send('Parameters not allowed');
//     }
// };