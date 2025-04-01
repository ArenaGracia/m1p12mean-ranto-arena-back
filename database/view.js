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