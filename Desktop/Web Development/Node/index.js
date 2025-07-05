import inquirer from "inquirer"
import qr from "qr-image"
import fs from "fs"


inquirer.prompt([{
    message: "Type your url: ",
    name: "URL"
}]).then((answers) => {
    console.log(answers["URL"])
    var qr_image = qr.image(answers["URL"])
    qr_image.pipe(fs.createWriteStream("qr.png"))
    fs.appendFile("URL.txt", "\n" + answers["URL"], (err) => {
        if (err) {
            console.log(err);
        }
    },)
})