export function validateImage(file){
    const allowedMimeTypes = ['image/png', 'image/jpeg','image/jpg']
     console.log(allowedMimeTypes.includes(file?.type))
    if(!allowedMimeTypes.includes(file.type)){
       return false
    }else{
        return true
    }
}