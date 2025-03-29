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
  