const getAddressFunction = (view) => {

  let str = ''

  str = view.name_obl ? str + view.name_obl : str
  str = view.name_rayon ? str + ', ' + view.name_rayon : str
  str = view.name_nas_punkt ? str + ', ' + view.name_nas_punkt : str
  str = view.Street ? str + ', ' + view.Street : str
  str = view.Number_of_house ? str + ', ' + view.Number_of_house : str

  if (str.trim().length === 0)
    str = null

  return str
}

export default getAddressFunction