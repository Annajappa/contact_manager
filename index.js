import express from 'express';
import dotenv from "dotenv";
import fs from 'fs';




dotenv.config();
let port = process.env.PORT;

const app = express()
app.use(express.json());



const DATA_FILE = "./contact.json"

const read_data = () =>{
    let data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data)
}

const write_File = (data) =>{
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

//Post

app.post("/contact", (req, res) =>{
    try{
    let contacts = read_data()
    let new_contact = {id : Date.now(), ...req.body}
    contacts.push(new_contact)
    write_File(contacts)
    return res.send({message : "Contact was added", new_contact})
    }
    catch(error){
        return res.send({message : "Contact was Failed"})
    }

})

//Read

app.get("/contacts", (req, res) =>{
    try{
        const constact = read_data();
        res.json(constact)

    }catch(error){
        return res.send({message : "Contacts are not Render"})
    }
})

app.delete("/contact/:id", (req, res) =>{
    try{
        let contacts = read_data();
        let id = parseInt(req.params.id)
        let updated = contacts.filter((c) => c.id !== id);
        write_File(updated);
        res.send({message : "Contact was Deleted"})
    }catch(error){
        return res.send({message : "Contact was not deleted"})
    }
})

//put
app.put("/contact/:id", (req, res) =>{
    try {
    const id = parseInt(req.params.id);
    const contacts = read_data();
    const index = contacts.findIndex((c) => c.id === id);
    if (index === -1)
      return res.status(404).send({ message: "Contact not found" });

    contacts[index] = { ...contacts[index], ...req.body };
    write_File(contacts);
    res.send({ message: "✏️ Contact updated", contact: contacts[index] });
  } catch (error) {
    res.status(500).send({ message: "❌ Update failed" });
  }
})



app.listen(port, ()=>{
    console.log(`Server is Started on port number http://localhost:5000`);
})



