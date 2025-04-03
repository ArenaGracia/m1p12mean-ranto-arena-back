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