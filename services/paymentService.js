const { Payemnt } = require("../models/Payment");
const { mongoose } = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const { updateQuoteState } = require("../services/quoteService");
const { Payment } = require("../models/Payment");

async function createPayment (payment, amountLeft) {
    if (payment.amount > amountLeft) {
        throw new Error("Le montant du paiement est supérieur à la somme restante");
    } else if (payment.amount == amountLeft) { 
        // mettre à jour l'etat du devis comme payé
        await updateQuoteState(payment.quote_id, 5);
    }
    const newPayment = new Payment(payment);
    return newPayment.save();
}

async function getPaymentSummary (quoteId) {
    const paymentSummary =  await mongoose.connection.db
        .collection("v_quote_payment_summary")
        .findOne({ quote_id: new ObjectId(quoteId) });
    return paymentSummary;
}

async function getTotalRevenue (startDate, endDate) {
    console.log("StartDate : " + startDate + " EndDate : " + endDate)
    const totalRevenue = await Payment.aggregate([
        { $match: { date: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    console.log("total revenue :" + totalRevenue[0]?.total || 0);
    return totalRevenue[0]?.total || 0;
}

async function getDailyRevenue (startDate, endDate) {
    const dailyRevenue = await Payment.aggregate([
        { $match: { date: { $gte: startDate, $lte: endDate } } },
        { $group: { 
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, 
            total: { $sum: "$amount" } 
        } },
        { $sort: { _id: 1 } }
    ]);

    // mettre dans un mapping
    const revenueMap = dailyRevenue.reduce((acc, entry) => {
        acc[entry._id] = entry.total;
        return acc;
    }, {});

    // générer toute les dates entre l'intergave
    const allDates = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
        const formattedDate = currentDate.toISOString().split("T")[0]; 
        allDates.push({
            date: formattedDate,
            total: revenueMap[formattedDate] || 0  
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return allDates;
}

async function getMonthlyRevenue (start, end) {
    const monthlyRevenue = await Payment.aggregate([
        { $match: { date: { $gte: start, $lte: end } } },
        { $group: { 
            _id: { year: { $year: "$date" }, month: { $month: "$date" } }, 
            total: { $sum: "$amount" } 
        }},
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const revenueMap = monthlyRevenue.reduce((acc, entry) => {
        const formattedMonth = `${entry._id.year}-${String(entry._id.month).padStart(2, '0')}`;
        acc[formattedMonth] = entry.total;
        return acc;
    }, {});

    // Générer tous les mois entre dateStart et dateEnd
    const allMonths = [];
    let currentDate = new Date(start.getFullYear(), start.getMonth(), 1);
    while (currentDate <= end) {
        const formattedMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
        allMonths.push({
            month: formattedMonth,
            total: revenueMap[formattedMonth] || 0
        });
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return allMonths;
}

module.exports = {
    createPayment,
    getPaymentSummary,
    getTotalRevenue,
    getDailyRevenue,
    getMonthlyRevenue
}