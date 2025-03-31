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
  
  
  