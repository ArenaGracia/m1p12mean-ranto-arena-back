
const mongoose = require('mongoose');

const AppointmentStateSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    value: { type: Number, required: true },
    severity: { type: String, required: true }
}, { collection: 'appointment_state' });
  
const AppointmentSchema = new mongoose.Schema({
    timeStart: { type: Date, required: true, map: "time_start"  },
    timeEnd: { type: Date, required: true, map: "time_end" },
    realTimeStart: { type: Date, required: true, map: "real_time_start" },
    realTimeEnd: { type: Date, required: true, map: "real_time_end" },
    appointmentState: { type: mongoose.Schema.Types.ObjectId, map: "appointment_state_id", ref: "AppointmentState", required: true },
}, { collection: 'appointment' }, { timestamps: true });


module.exports = {
    AppointmentState: mongoose.model("AppointmentState", AppointmentStateSchema),
    Appointment: mongoose.model('Appointment', AppointmentSchema),
};
