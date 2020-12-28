const fs = require('fs')
const path = require('path')

// 1. 创建文件夹
/* const dirname = './why'
if(!fs.existsSync(dirname)) {
    fs.mkdir(dirname, err => {
        console.log(err)
    })
}

function getFiles(dirname){
    fs.readdir(dirname, {withFileTypes: true},  (err, files) => {

        for(let file of files) {
            //console.log(file)
            if(file.isDirectory()) {
                const filepath = path.resolve(dirname, file.name)
                getFiles(filepath)
            } else {
                console.log(file.name)
            }
        }
    })
}

getFiles(dirname) */

// 3. 重命名

fs.rename('./Mic', "./mic", err => {
    console.log(err)
})
