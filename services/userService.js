const { default: mongoose } = require("mongoose");

async function getMecanicienPerformancePerTask() {
    const performances = await mongoose.connection.db
        .collection("v_performance_per_task")
        .find()
        .toArray();
    return performances;
}

module.exports = {
    getMecanicienPerformancePerTask
}