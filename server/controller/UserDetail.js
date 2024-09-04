/* eslint-disable prettier/prettier */
const getUserDetailsFromToken = require('../helpers/GetUserDetailFromToken');

/* eslint-disable prettier/prettier */
async function userDetails(request,response){
    try {
        const token = request.cookies.token || ""
        const user = await getUserDetailsFromToken(token)

        return response.status(200).json({
            message:'detail user',
            data: user
        });
    } catch (error) {
        return response.status(500).json({
            message:error.message || error,
            error: true
        })
    }
}

module.exports = userDetails;
