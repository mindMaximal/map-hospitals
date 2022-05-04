const mappings = [
  {
    columnName: 'Название',
    fullQueryName: 'medical_center`.`name',
    queryName: 'name',
    fieldName: 'name'
  },
  {
    columnName: 'Тип',
    fullQueryName: 'types`.`name` AS `type',
    fieldName: 'type'
  },
  {
    columnName: 'Номер телефона',
    fullQueryName: 'phone',
    fieldName: 'phone'
  },
  {
    columnName: 'Аптека',
    fullQueryName: 'pharmacy',
    fieldName: 'pharmacy',
    binary: true
  },
  {
    columnName: 'Населенный пункт',
    fullQueryName: 'locality`.`name` AS `locality_name',
    queryName: 'locality_name',
    fieldName: 'locality'
  },
  {
    columnName: 'Год основания',
    fullQueryName: 'founding_year',
    fieldName: 'foundingYear'
  },
  {
    columnName: 'Экстренная помощь',
    fullQueryName: 'availability_of_emergency_mediical_care',
    fieldName: 'emergencyAssistance',
    binary: true
  },
  {
    columnName: 'Первая помощь',
    fullQueryName: 'access_to_primary_health_care',
    fieldName: 'firstAid',
    binary: true
  },
  {
    columnName: 'Район',
    fullQueryName: 'district`.`name` AS `district_name',
    queryName: 'district_name',
    fieldName: 'area'
  },
  {
    columnName: 'id',
    fullQueryName: 'medical_center`.`id',
    queryName: 'id',
    fieldName: 'id'
  },
  {
    columnName: 'Адрес',
    fullQueryName: [
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
    fullQueryName: 'address',
    fieldName: 'address_'
  },
  {
    columnName: 'Население',
    fullQueryName: 'population',
    fieldName: 'population'
  }
]

export default mappings