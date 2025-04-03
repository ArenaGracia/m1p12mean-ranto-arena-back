db.createView(
    "v_prestation_libcomplet",   
    "prestation",            
    [
        {
            $lookup: {
            from: "category",           
            localField: "category_id",   
            foreignField: "_id",     
            as: "category"
            }
        },
        { $unwind: "$category" },   
        {
            $project: {
            category_id : 0 
            }
        }
    ]
  )
  

db.createView(
    "v_category_libcomplet",  
    "category",               
    [
      {
        $lookup: {              
          from: "prestation",     
          localField: "_id",   
          foreignField: "category_id",
          as: "prestations"         
        }
      }
    ]
);

db.createView(
  "v_token_user",  
  "token_user",               
  [
    {
      $lookup: {              
        from: "user",     
        localField: "user_id",   
        foreignField: "_id",
        as: "user"         
      }
    },
    { $unwind: "$user" },   
  ]
);

  
db.createView ("v_user", "user", [
    {
        $lookup: {
            from: "profile",           
            localField: "profile_id",   
            foreignField: "_id",     
            as: "profile"
        }
    },
    { $unwind: "$profile" },   
    {
        $project: {
            "profile_id": 0,
            "profile.user_id": 0,            
            "user.password": 0,      
        }
    }
]);
  
// Appointment View jointure user & car & state
db.createView (
    "v_appointment_libcomplet",   
    "appointment",            
    [
        {
            $lookup: {
                from: "user",           
                localField: "user_id",   
                foreignField: "_id",     
                as: "user"
            }
        },
        { $unwind: "$user" },   
        {
            $lookup: {
                from: "car",           
                localField: "car_id",   
                foreignField: "_id",     
                as: "car"
            }
        },
        { $unwind: "$car" },   
        {
            $lookup: {
                from: "appointment_state",           
                localField: "state_appointment_id",   
                foreignField: "_id",     
                as: "appointment_state"
            }
        },
        { $unwind: "$appointment_state" },   
        {
            $project: {
                "car_id": 0,
                "car.user_id": 0,
                "user_id": 0,         
                "user.password": 0,
                "user.contact": 0,
                "user.profile_id": 0,
                "state_appointment_id": 0,
                "appointment_state.state_id": 0,
            }
        }
    ]
);


// Quote views

// devis avec rendez-vous et user
db.createView( "v_quote_libcomplet",  "quote",            
    [ 
        {
            $lookup: {
                from: "quote_state",           
                localField: "quote_state_id",   
                foreignField: "_id",     
                as: "quote_state"
            }
        },
        { $unwind: "$quote_state" },  
        {
            $lookup: {
                from: "v_appointment_libcomplet",           
                localField: "appointment_id",   
                foreignField: "_id",     
                as: "appointment"
            }
        },
        { $unwind: "$appointment" },  
        {
            $lookup: {
                from: "v_quote_details_libcomplet",
                localField: "_id",
                foreignField: "quote_id",
                as: "quote_details"
            },
        },  
        {
            $addFields: {
                total_price: { $sum: "$quote_details.price" },
                final_price: { 
                    $subtract: [
                        { $sum: "$quote_details.price" }, // Prix total
                        { $multiply: [ {$sum: "$quote_details.price"}, {$divide: ["$discount", 100]} ] }
                    ]
                }
            }
        },
        {
            $project: {
                "quote_state.state_id": 0,
                "quote_state_id": 0,
                "appointment_id": 0,
                "quote_details": 0,
            }
        },
    ]
)


db.createView ( "v_prestation_brand_libcomplet", "prestation_brand",
    [
        {
            $lookup: {
                from: "v_prestation_libcomplet",
                localField: "prestation_id",
                foreignField: "_id",
                as: "prestation"
            }
        },
        { $unwind: "$prestation" }, 
        {
            $lookup: {
                from: "brand",
                localField: "brand_id",
                foreignField: "_id",
                as: "brand"
            }
        },
        { $unwind: "$brand" }, 
        {
            $project: {
                "prestation.image": 0,
                "brand.image": 0,
                "brand_id": 0,
                "prestation_id" : 0,
            }
        }
    ]
)



// details payement par devis

db.createView("v_quote_payment_summary", "v_quote_libcomplet", [
    {
        $lookup: {
            from: "payment",
            localField: "_id",
            foreignField: "quote_id",
            as: "payments"
        }
    },
    {
        $unwind: {
            path: "$payments",
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $group: {
            _id: "$_id",
            final_price: { $first: "$final_price" },
            total_paid: { $sum: { $ifNull: ["$payments.amount", 0] } }
        }
    },
    {
        $project: {
            _id: 0,
            quote_id: "$_id",
            total_paid: 1,
            final_price: 1,
            amount_remaining: { $subtract: ["$final_price", "$total_paid"] }
        }
    }
]);


// lié au prestation brand et à l'éventuel tâche
db.createView(
    "v_quote_details_libcomplet",  
    "quote_details",               
    [
        {
            $lookup: {              
                from: "v_prestation_brand_libcomplet",     
                localField: "prestation_brand_id",   
                foreignField: "_id",
                as: "prestation_brand"         
            }
        },
        { $unwind: "$prestation_brand" }, 
        { 
            $lookup: {
                from: "v_task",
                localField: "_id",  
                foreignField: "quote_details_id",
                as: "task"
            }
        },
        { 
            $unwind: { 
                path: "$task", 
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {              
                prestation_brand_id: 0, 
                "prestation_brand.prestation.description": 0       
            }
        }
    ]
);


db.createView(
    "v_car_brand",   
    "car",            
    [
      {
        $lookup: {
          from: "brand",           
          localField: "brand_id",   
          foreignField: "_id",     
          as: "brand"
        }
      },
      { $unwind: "$brand" },   
      {
        $project: {
          brand_id : 0,
          "brand.image" : 0
        }
      }
    ]
);


// Devis avec liste details devis
db.v_quote_libcomplet.aggregate([
    {
        $lookup: {
            from: "v_quote_details_libcomplet",
            localField: "_id",
            foreignField: "quote_id",
            as: "quote_details"
        },
    },  
    {
        $addFields: {
            total_price: { 
                $sum: "$quote_details.price"
            },
            final_price: { 
                $subtract: [
                    { $sum: "$quote_details.price" }, // Prix total
                    { 
                        $multiply: [
                            { $sum: "$quote_details.price" }, // Prix total
                            { $divide: ["$discount", 100] } // Remise en %
                        ]
                    }
                ]
            }
        }
    },
    {
        $project: {              
            "quote_details.quote_id": 0,
            "total_price":0
        }
    }
]);

db.createView("v_task", "task", [
    {
        $lookup: {
            from: "task_state",           
            localField: "task_state_id",   
            foreignField: "_id",     
            as: "task_state"
        }
    },
    { $unwind: "$task_state" },
    {
        $project: {
            "task_state_id": 0,  
            "__v": 0
        }
    }
]);

db.createView("v_task_libcomplet", "v_task",
[
    {
        $lookup: {
            from: "v_quote_details_libcomplet",
            localField: "quote_details_id",
            foreignField: "_id",
            as: "quote_details"
        }
    },
    { $unwind: { path: "$quote_details", preserveNullAndEmptyArrays: true  }  },
    {
        $lookup: {
            from: "user", 
            localField: "user_id", 
            foreignField: "_id",
            as: "user"
        }
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    {
        $project: {
            "user.password": 0,  
            "user.contact": 0, 
            "user.profile_id": 0,
            "task_state.state_id": 0,
            "state_task_id": 0,
            "quote_details_id": 0,
            "quote_details.task": 0,
            "__v": 0
        }
    }
]);



// View pour la performance des mecaniciens par tâche 
db.createView("v_performance_per_task", "v_task_libcomplet", [
    { $match: { estimated_duration: { $exists: true, $ne: null } } },
    {
        $addFields: {
            performance : {
                $multiply: [
                    { $divide: [ "$estimated_duration", { $toDouble: "$quote_details.prestation_brand.duration" } ] },
                    100
                ]
            },
            prestation_duration : "$quote_details.prestation_brand.duration",
            prestation : "$quote_details.prestation_brand.prestation.name",
            category : "$quote_details.prestation_brand.prestation.category.name",
        }
    },
    {
        $project: {
            "_id": 1,
            "user._id": 1,
            "user.name": 1,
            "user.first_name": 1,
            "prestation_duration": 1,
            "estimated_duration": 1,
            "prestation": 1,
            "category": 1,
            "performance": 1
        }
    }
]);
