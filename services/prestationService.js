
const { default: mongoose } = require("mongoose");
const { Prestation } = require("../models/Prestation");
const { ObjectId } = require("mongoose").Types;

async function getPrestationWithImage() {
    const prestations = await mongoose.connection.db.collection("v_prestation_libcomplet").find().toArray();
    const prestationsWithImages = prestations.map(p => {
        let imageBase64 = null;
        if (p.image) {
            imageBase64 = `data:image/jpeg;base64,${p.image.toString('base64')}`;
        }
        return { ...p, image: imageBase64,
        };
    });
    return prestationsWithImages;
}

async function getPrestationById(id) {
    const prestation = await Prestation.findById(id).populate('category_id');
    if (!prestation) {
        throw new Exception ('Prestation non trouvée.');
    }
    let imageBase64 = null;
    if (prestation.image && prestation.image instanceof Buffer) {
        imageBase64 = `data:image/jpeg;base64,${prestation.image.toString('base64')}`;
    }
    return {...prestation.toObject(), image: imageBase64};
}

async function getPrestationByCategory(categoryId) {
    const prestations = await mongoose.connection.db.collection("v_prestation_libcomplet").find({ "category._id" :  new ObjectId(categoryId) }).toArray();
    const prestationsWithImages = prestations.map(p => {
        let imageBase64 = null;
        if (p.image) {
            imageBase64 = `data:image/jpeg;base64,${p.image.toString('base64')}`;
        }
        return { ...p, image: imageBase64,
        };
    });
    return prestationsWithImages;
}

async function updatePrestation(id, prestationBody) {
    try {
        const prestation = await Prestation.findById(id);
        if (!prestation) {
            throw new Error ('Prestation non trouvée.' );
        }

        prestation.name = prestationBody.name || prestation.name;
        prestation.description = prestationBody.description || prestation.description;
        prestation.category = prestationBody.category || prestation.category;

        if (prestationBody.image) {
            prestation.image = prestationBody.image.replace(/\s/g, '');
        }

        await prestation.save();
        return prestation;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    getPrestationWithImage,
    getPrestationById,
    getPrestationByCategory,
    updatePrestation
}