const roleMiddleware = (allowedRoles = []) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !user.profile) {
            return res.status(403).json({ message: "Accès Refusé. Aucun profil trouvé." });
        }

        if (!allowedRoles.includes(user.profile)) {
            return res.status(403).json({ message: "Accès Refusé. Vous n'avez pas les permissions." });
        }

        next();
    };
};

const isManager = roleMiddleware(['Manager']);
const isMechanic = roleMiddleware(['Mecanicien']);
const isClient = roleMiddleware(['Client']);

module.exports = {
    isManager,
    isMechanic,
    isClient
};