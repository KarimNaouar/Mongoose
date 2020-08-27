let express = require('express');
let mongoose = require('mongoose');

// Connexion to the DB
require ('dotenv').config();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => {
     console.log("Database connection successful")
   })
   .catch(err => {
     console.error("Database connection error")
   });


// Create the personSchema
var Schema= mongoose.Schema;
let personSchema = new Schema({
  firstName: { type: String, required: true, unique: true },
  age: { type: Number, default: 20 },
  favoriteFoods: [String]
});


// Create the personModel
let personModel = mongoose.model("Person", personSchema);


// Create and Save a Record of a Model
var person = new personModel({
  firstName: "Karim",
  age: 35,
  favoriteFoods: ["apple", "banana", "chocolate"]
});

person.save(function (err, data) {
  if (err) console.log("An error accured while saving the model");
  else  console.log("The model was saved");
});


// Create Many Records with model.create()
var arrayOfPeople = [
  { firstName: "Ali", age: 20, favoriteFoods: ["orange", "chocolate", "Strawberry"] },
  { firstName: "Salah", age: 56, favoriteFoods: ["pizza", "apple", "fish"] },
  { firstName: "Amira", age: 19, favoriteFoods: ["pizza", "orange", "pasta"] },
  { firstName: "Ines", age: 45, favoriteFoods: ["apple", "chocolate", "Strawberry"] },
];
personModel.create(arrayOfPeople, (err, data) => {
    if (err) console.log("An error accured while saving models");
    else console.log("Models were saved");
  });
  
  
// Search the Database using firstName
personModel.find({ firstName: "Karim" }).then((doc) => {
if (doc.length === 0)   // not sure about this check, maybe Document.prototype.$isEmpty()  must be used
 console.log("No entry found");
else
 console.log(doc);
})
.catch((err) => {
  console.error("An error accured while searching for a model by first name");
});  


// Search the Database using favoriteFoods and Return a Single Matching Document
personModel.findOne({ favoriteFoods: { $in: ["orange"] } }).then((doc) => {
if (doc.length === 0)   // not sure about this check, maybe Document.prototype.$isEmpty()  must be used, not working as intended
 console.log("No entry found");
else
 console.log(doc);
})
.catch((err) => {
  console.error("An error accured while searching for single a model by favorite food");
});  



// Search the Database using model.findById() to Search By _id
personModel.findById({_id:"5f4817c7009e1347c4eb13e2" }).then((doc) => {
if (doc.length === 0)   // not sure about this check, maybe Document.prototype.$isEmpty()  must be used, not working as intended
 console.log("No entry found");
else
 console.log(doc);
})
.catch((err) => {
  console.error("An error accured while searching for a model by ID");
});  

 
// Perform Classic Updates by Running Find, Edit, then Save
personModel.findById("5f4817c7009e1347c4eb13e2", (err, person) => {
  if (err) console.log(err);
  else
  person.favoriteFoods.push("hamburger")
  person.save((err, person) => {
    if (err) console.log(err);
	else
    console.log(person);
  });
});


// Perform New Updates on a Document Using model.findOneAndUpdate()
personModel.findOneAndUpdate(
  { firstName: "Salah" },
  { age: 20},
  { new: true },
  (err, person) => {
    if (err) console.log(err);
	else
    console.log(person);
  }
);



// Delete One Document Using model.findByIdAndRemove
personModel.findOneAndRemove("5f47e74623b0d744082627c3", (err, person) => {
  if (err) console.log("An error accured while deleting a model by ID");
  console.log(person);
});



// MongoDB and Mongoose - Delete Many Documents with model.remove()
personModel.deleteMany({ name: "mary" }, (err, person) => {
  if (err) console.log(err);
  console.log("Persons with first name 'mary' were deleted");
});



// Chain Search Query Helpers to Narrow Search Results
personModel
  .find({ favoriteFoods: { $in: ["burrito"] } })
  .sort({name: 'asc'} )
  .limit(2)
  .select("-age")
  .exec()
  .then((doc) => console.log(doc))
  .catch((err) => console.error(err));
