module.exports={
  getAddressString(address){
    const { city, landmark, district, state, country, postalCode, phoneNumbers } = address

    const addressString = `${city},Near ${landmark},${district},
                          ${state},${country},${postalCode}
                         ,${phoneNumbers[0]} & ${phoneNumbers[1] && phoneNumbers[1]}`
                         
    return addressString
  }
}