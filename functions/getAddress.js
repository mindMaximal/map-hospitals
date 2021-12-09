const getAddress = (view) => {

  let str = ''

  str = view.region_name ? str + view.region_name : str
  str = view.district_name ? str + ', ' + view.district_name : str
  str = view.name_locality ? str + ', ' + view.name_locality : str
  str = view.street ? str + ', ' + view.street : str
  str = view.number_of_house ? str + ', ' + view.number_of_house : str

  if (str.trim().length === 0)
    str = null

  return str
}

export {getAddress}