db.createView(
    "v_prestation_libcomplet",   
    "prestation",            
    [
      {
<<<<<<< Updated upstream
        $lookup: {
          from: "category",           
          localField: "category_id",   
          foreignField: "_id",     
          as: "category"
=======
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
db.createView(
    "v_quote_libcomplet",   
    "quote",            
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
            $project: {
                "appointment.appointment_state": 0,
                "quote_state.state_id": 0,
                "quote_state_id": 0,
                "appointment_id": 0
            }
        } 
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
>>>>>>> Stashed changes
        }
      },
      { $unwind: "$category" },   
      {
        $project: {
          category_id : 0 
        }
      }
    ]
<<<<<<< Updated upstream
  )
  
=======
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
        $project: {              
            "quote_details.quote_id": 0,
        }
    }
]);


db.createView("v_task_libcomplet", "task",
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
            "prestation_brand_id": 0,
            "__v": 0
        }
    }
]
);
>>>>>>> Stashed changes
