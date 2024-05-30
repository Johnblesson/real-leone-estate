import Apartments from "../models/apartments.js";
import User from "../models/auth.js";
import Applications from "../models/apply.js";

export const mainAdmin = async (req, res) => {
    try {
        // Fetch counts for each entity
        const apartmentsCount = await Apartments.countDocuments();
        const usersCount = await User.countDocuments();
        const applicationsCount = await Applications.countDocuments();

        const user = req.isAuthenticated() ? req.user : null;

        // Render the administrator template and pass counts as data
        res.render('administrator', { apartmentsCount, usersCount, applicationsCount, user });
    } catch (error) {
        console.log(error);
        // Handle errors appropriately, such as sending an error response
        res.status(500).json({ error: 'Internal server error' });
    }
}
