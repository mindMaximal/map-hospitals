const mappings = [
  {
    columnName: 'Название',
    queryName: 'medical_center`.`name',
    fieldName: 'name'
  },
  {
    columnName: 'Тип',
    queryName: 'type',
    fieldName: 'type'
  },
  {
    columnName: 'Номер телефона',
    queryName: 'phone',
    fieldName: 'phone'
  },
  {
    columnName: 'Аптека',
    queryName: 'pharmacy',
    fieldName: 'pharmacy',
    binary: true
  },
  {
    columnName: 'Населенный пункт',
    queryName: 'locality`.`name',
    fieldName: 'locality'
  },
  {
    columnName: 'Год основания',
    queryName: 'founding_year',
    fieldName: 'foundingYear'
  },
  {
    columnName: 'Экстренная помощь',
    queryName: 'availability_of_emergency_mediical_care',
    fieldName: 'emergencyAssistance',
    binary: true
  },
  {
    columnName: 'Первая помощь',
    queryName: 'access_to_primary_health_care',
    fieldName: 'firstAid',
    binary: true
  },
  {
    columnName: 'Район',
    queryName: 'district`.`name',
    fieldName: 'area'
  },
  {
    columnName: 'id',
    queryName: 'medical_center`.`id',
    fieldName: 'id'
  },
  {
    columnName: 'Адрес',
    queryName: [
      'region`.`name',
      'district`.`name',
      'locality`.`name',
      'street',
      'number_of_house'
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