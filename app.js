var methodOverride  =   require("method-override"),
bodyParser          =   require("body-parser"),
mongoose            =   require("mongoose"),
express             =   require("express"),
app                 =   express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// mongoose.connect("mongodb://localhost:27017/food_app", {useNewUrlParser: true});
mongoose.connect("mongodb+srv://yelpuser:WpxAhqD1FMOyKIER@cluster0-y9rzq.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true},function(err) {
    if (err) { return console.error(err);}
  });

var foodSchema = new mongoose.Schema({
    title: String,
    image: String,
    recipe: String,
    shortDesc: String,
    createdDate: {type: Date, default: Date.now}
});
var FoodRecipe = mongoose.model("FoodRecipe", foodSchema);

//ROOT ROUTE
app.get("/", function(req, res){
    res.render("landing");
});

//INDEX ROUTE
app.get("/foodRecipes", function(req, res){
    FoodRecipe.find({}, function(err, allRecipes){
        if(err){
            console.log(err);
        } else{
            res.render("index", {recipes : allRecipes});
        }
    })
});

//NEW ROUTE
app.get("/foodRecipes/new", function(req, res){
    res.render("new");
});

//CREATE ROUTE
app.post("/foodRecipes", function(req, res){
    FoodRecipe.create(req.body.recipe, function(err, newRecipe){
        if(err){
            console.log(err);
        } else{
            res.redirect("/foodRecipes");
        }
    })
});

//SHOW ROUTE
app.get("/foodRecipes/:id", function(req, res){
    FoodRecipe.findById(req.params.id, function(err, foundRecipe){
        if(err){
            res.redirect("/foodRecipes");
        } else{
            res.render("show",{recipe:foundRecipe});
        }
    });
});

//EDIT ROUTE
app.get("/foodRecipes/:id/edit", function(req, res){
    FoodRecipe.findById(req.params.id, function(err, foundRecipe){
        if(err){
            res.redirect("/foodRecipes");
        } else{
            res.render("edit",{recipe: foundRecipe});
        }
    })
});

//UPDATE ROUTE
app.put("/foodRecipes/:id", function(req, res){
    FoodRecipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err, updatedRecipe){
        if(err){
            res.redirect("/foodRecipes/" + req.params.id + "/edit");
        }else{
            res.redirect("/foodRecipes/" + req.params.id);
        }
    })
});

//DELETE ROUTE
app.delete("/foodRecipes/:id", function(req, res){
    FoodRecipe.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/foodRecipes");
        } else{
            res.redirect("/foodRecipes");
        }
    })
});

app.listen(process.env.PORT || 5000, function(){
    console.log("Server has started");
});