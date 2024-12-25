export function validateImage(file){
    const allowedMimeTypes = ['image/png', 'image/jpeg','image/jpg']
    if(!allowedMimeTypes.includes(file.type)){
       return false
    }else{
        return true
    }
}