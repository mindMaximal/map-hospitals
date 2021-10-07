const mappings = [
  {
    columnName: 'Название',
    queryName: 'name_Med_punkt',
    fieldName: 'name'
  },
  {
    columnName: 'Тип',
    queryName: 'type_Med_punkt',
    fieldName: 'type'
  },
  {
    columnName: 'Номер телефона',
    queryName: 'Phone_number',
    fieldName: 'phone'
  },
  {
    columnName: 'Аптека',
    queryName: 'Pharmacy',
    fieldName: 'pharmacy',
    binary: true
  },
  {
    columnName: 'Населенный пункт',
    queryName: 'name_nas_punkt',
    fieldName: 'locality'
  },
  {
    columnName: 'Год основания',
    queryName: 'Founding_year',
    fieldName: 'foundingYear'
  },
  {
    columnName: 'Экстренная помощь',
    queryName: 'Availability_of_emergency_mediical_care',
    fieldName: 'emergencyAssistance',
    binary: true
  },
  {
    columnName: 'Первая помощь',
    queryName: 'Access_to_primary_health_care',
    fieldName: 'firstAid',
    binary: true
  },
  {
    columnName: 'Район',
    queryName: 'name_rayon',
    fieldName: 'area'
  },
  {
    columnName: 'id',
    queryName: 'id_Med_punkt',
    fieldName: 'id'
  },
  {
    columnName: 'Адрес',
    queryName: [
      'name_obl',
      'name_rayon',
      'name_nas_punkt',
      'Street',
      'Number_of_house'
    ],
    fieldName: 'address'
  },
  {
    columnName: 'Адрес',
    queryName: 'address',
    fieldName: 'address_'
  }
]

export default mappings