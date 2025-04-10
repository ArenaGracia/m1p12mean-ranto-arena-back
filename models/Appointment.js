
const mongoose = require('mongoose');

const AppointmentStateSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    value: { type: Number, required: true },
    severity: { type: String, required: true }
}, { collection: 'appointment_state' });
  
const AppointmentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    car_id: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    time_start: { type: Date, required: true  },
    time_end: { type: Date },
    state_appointment_id: { type: mongoose.Schema.Types.ObjectId, ref: "AppointmentState", required: true }
}, { collection: 'appointment' }, { timestamps: true });


module.exports = {
    AppointmentState: mongoose.model("AppointmentState", AppointmentStateSchema),
    Appointment: mongoose.model('Appointment', AppointmentSchema)
};
