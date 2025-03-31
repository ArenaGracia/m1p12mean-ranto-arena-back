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
      },
      {
        $project: {              
          typeId: 0,        
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
                from: "appointment",           
                localField: "appointment_id",   
                foreignField: "_id",     
                as: "appointment"
            }
        },
        { $unwind: "$appointment" },   
        {
            $lookup: {
                from: "user",           
                localField: "appointment.user_id",   
                foreignField: "_id",     
                as: "appointment.user"
            }
        },
        { $unwind: "$appointment.user" },   
        {
            $project: {
                "appointment.user_id": 0,  
                "appointment_id": 0,     
                "appointment.user.password": 0, 
                "appointment.user.contact": 0,
                "appointment.user.profile_id": 0
            }
        }
    ]
)



db.createView (
    "v_quote_details",
    "quote_details",
    [
        {
            $lookup: {
                from: "prestation_brand",
                localField: "prestation_brand_id",
                foreignField: "_id",
                as: "prestationBrand"
            },
        },
        { $unwind: "$prestationBrand" },  
        {
            $lookup: {
            from: "prestation",
            localField: "prestationBrand.prestation_id",
            foreignField: "_id",
            as: "prestation"
            }
        },
        { $unwind: "$prestation" }, 
    ]
)
